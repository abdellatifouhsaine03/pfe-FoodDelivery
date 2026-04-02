<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class AIController extends Controller
{
    public function chat(Request $request)
    {
        $userMessage = strtolower($request->message);
        $convId = $request->convId ?? 'default';

        // 🔥 STEP 1: Try local parsing (FAST)
        $parsed = $this->localParse($userMessage);

        // 🔥 STEP 2: If failed → use AI
        if (!$parsed) {
            $parsed = $this->callAI($userMessage);
        }

        if (!$parsed) {
            return response()->json([
                'reply' => '🤔 Sorry, I did not understand.'
            ]);
        }

        return $this->handleIntent($parsed, $convId);
    }

    // ==============================
    // 🔥 LOCAL PARSER
    // ==============================
    private function localParse($message)
    {
        $menuItems = Menu::pluck('name')->toArray();
        $normalizedWords = $this->normalizeWords(explode(' ', $message));
        $foundItems = [];

        foreach ($normalizedWords as $word) {
            foreach ($menuItems as $dbItem) {
                similar_text($word, strtolower($dbItem), $percent);
                if ($percent > 70) {
                    $foundItems[] = $dbItem;
                }
            }
        }

        if (!empty($foundItems)) {
            return [
                "intent" => "order_food",
                "items" => array_unique($foundItems)
            ];
        }

        if (preg_match('/^[1-3]$/', trim($message))) {
            return [
                "intent" => "choose_option",
                "choice" => (int)$message
            ];
        }

        if (in_array($message, ['yes', 'ok', 'confirm'])) {
            return ["intent" => "confirm_order"];
        }

        // Conversational shortcuts
        $greetings = ['hello', 'hi', 'hey'];
        $thanks = ['thanks', 'thank you'];
        $goodbye = ['bye', 'goodbye', 'see you'];
        $smallTalk = ['how are you', "what's up"];

        if (in_array($message, $greetings)) return ["intent" => "greeting"];
        if (in_array($message, $thanks)) return ["intent" => "thanks"];
        if (in_array($message, $goodbye)) return ["intent" => "goodbye"];
        foreach ($smallTalk as $phrase) {
            if (str_contains($message, $phrase)) return ["intent" => "small_talk"];
        }

        return null;
    }

    private function normalizeWords($words)
    {
        $map = [
            'jus' => 'juice',
            'juse' => 'juice',
            'coka' => 'coca',
            'cofee' => 'coffee',
            'atay' => 'tea',
            'ma' => 'water'
        ];

        return array_map(fn($word) => $map[strtolower($word)] ?? strtolower($word), $words);
    }

    // ==============================
    // 🤖 AI FALLBACK
    // ==============================
    private function callAI($message)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('NVIDIA_API_KEY'),
            'Accept' => 'application/json'
        ])->post('https://integrate.api.nvidia.com/v1/chat/completions', [
            "model" => "meta/llama-4-maverick-17b-128e-instruct",
            "messages" => [
                [
                    "role" => "user",
                    "content" => $this->systemPrompt() . "\nUser: " . $message
                ]
            ]
        ]);

        if ($response->failed()) return null;

        $text = $response->json()['choices'][0]['message']['content'] ?? null;
        return $this->extractJson($text);
    }

    private function systemPrompt()
    {
        return <<<EOT
You are a smart and friendly food ordering assistant. Extract structured information from the user message as JSON.

Fields:
- intent (order_food, choose_option, confirm_order, greeting, thanks, goodbye, small_talk, unknown)
- items (array of food names if mentioned)
- category (Entrée, Plat principal, Dessert, Boisson)
- choice (number if user picks an option)
- sentiment (positive, neutral, negative)
- urgency (low, normal, high)

Rules:
1. Food classification:
   - Drink → category = "Boisson"
   - Dessert → category = "Dessert"
   - Food → category = "Plat principal"
   - If specific item exists → use items
2. Conversational intents:
   - "hello", "hi", "hey" → greeting
   - "thanks", "thank you" → thanks
   - "bye", "goodbye", "see you" → goodbye
   - Small talk → small_talk
   - Anything unrecognized → unknown
3. Sentiment:
   - Positive words → positive
   - Neutral words → neutral
   - Negative words → negative
4. Urgency:
   - "quick", "asap", "hurry" → high
   - Normal requests → normal
   - Polite/casual → low
5. Return **ONLY JSON**.

Examples:
User: I want pizza  
{
  "intent": "order_food",
  "items": ["pizza"],
  "category": "Plat principal",
  "choice": null,
  "sentiment": "neutral",
  "urgency": "normal"
}

User: hi  
{
  "intent": "greeting",
  "items": [],
  "category": null,
  "choice": null,
  "sentiment": "positive",
  "urgency": "low"
}

User: thanks a lot!  
{
  "intent": "thanks",
  "items": [],
  "category": null,
  "choice": null,
  "sentiment": "positive",
  "urgency": "low"
}

User: I need this ASAP!  
{
  "intent": "order_food",
  "items": [],
  "category": null,
  "choice": null,
  "sentiment": "neutral",
  "urgency": "high"
}
EOT;
    }

    private function extractJson($text)
    {
        if (!$text) return null;
        preg_match('/\{.*\}/s', $text, $matches);
        return isset($matches[0]) ? json_decode($matches[0], true) : null;
    }

    // ==============================
    // 🎯 BUSINESS LOGIC
    // ==============================
    private function handleIntent($data, $convId)
    {
        switch ($data['intent'] ?? null) {
            case 'order_food':
                return $this->handleOrder($data, $convId);

            case 'choose_option':
                return $this->handleChoice($data, $convId);

            case 'confirm_order':
                return $this->handleConfirmation($convId);

            case 'greeting':
                return response()->json(['reply' => '👋 Hello! What would you like to order today?']);

            case 'thanks':
                return response()->json(['reply' => '😊 You’re welcome!']);

            case 'goodbye':
                return response()->json(['reply' => '👋 Goodbye! See you next time.']);

            case 'small_talk':
                return response()->json(['reply' => '😄 I’m doing great! How about you?']);

            default:
                return response()->json(['reply' => '🤔 Sorry, I did not understand. Can you rephrase?']);
        }
    }

    private function handleOrder($data, $convId)
    {
        $items = $data['items'] ?? [];
        $category = $data['category'] ?? null;

        $query = Menu::query();

        if (!empty($items)) {
            foreach ($items as $item) {
                $query->orWhere('name', 'LIKE', "%$item%");
            }
        } elseif ($category) {
            $query->where('category', $category);
        }

        $products = $query->with('restaurant')->limit(3)->get();

        if ($products->isEmpty()) {
            return response()->json(['reply' => 'No matching items found 😢']);
        }

        Cache::put("conv_{$convId}_last_options", $products, 300);

        $message = "🔥 I found these options:\n\n";
        foreach ($products as $i => $p) {
            $message .= ($i + 1) . ". {$p->name} - {$p->restaurant->name} ({$p->price}dh)\n";
        }
        $message .= "\n👉 Reply with a number";

        return response()->json(['reply' => $message]);
    }

    private function handleChoice($data, $convId)
    {
        $options = Cache::get("conv_{$convId}_last_options");

        if (!$options) {
            return response()->json(['reply' => 'No options available. Please start again.']);
        }

        $choice = ($data['choice'] ?? 0) - 1;
        $selected = $options[$choice] ?? null;

        if (!$selected) return response()->json(['reply' => 'Invalid choice.']);

        Cache::put("conv_{$convId}_selected_product", $selected, 3600);

        return response()->json([
            'reply' => "✅ You selected {$selected->name}. Confirm? (yes/no)"
        ]);
    }

    private function handleConfirmation($convId)
    {
        $product = Cache::get("conv_{$convId}_selected_product");
        $user_id = 1; // Replace with auth()->id() in real app

        if (!$product) return response()->json(['reply' => 'No product selected.']);

        try {
            $order = Order::create([
                'product_id' => $product->id,
                'user_id' => (int)$user_id,
                'restaurant_id' => 2,
                'order_number' => 'ORD-001',
                'status' => 'pending',
                'total' => $product->price,
                'delivery_address' => '123 Main Street',
                'contact_number' => '0600000000',
                'special_instructions' => 'Leave at door',
                'subtotal' => 29.00,
                'delivery_fee' => 5.00,
                'payment_method' => 'cash',
                'payment_status' => 'pending',
                'delivered_at' => null,
            ]);

            Cache::forget("conv_{$convId}_last_options");
            Cache::forget("conv_{$convId}_selected_product");

            return response()->json([
                'reply' => "🎉 Order placed! {$product->price}dh"
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'reply' => '❌ Error creating order: ' . $e->getMessage()
            ], 500);
        }
    }
}