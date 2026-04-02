<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function store_order(Request $request)
{
    Log::info('Requête reçue pour création de commande', $request->all());

    $validator = Validator::make($request->all(), [
        'user_id' => 'required|exists:users,id',
        'rider_id' => 'nullable|exists:users,id',
        'restaurant_id' => 'required|exists:restaurants,id',
        'order_number' => 'required|unique:orders,order_number',
        'status' => 'required|in:pending,processing,out_for_delivery,delivered,cancelled',
        'delivery_address' => 'required|string',
        'contact_number' => 'required|string',
        'special_instructions' => 'nullable|string',
        'subtotal' => 'required|numeric|min:0',
        'delivery_fee' => 'required|numeric|min:0',
        'total' => 'required|numeric|min:0',
        'payment_method' => 'required|in:cash,credit_card,mobile_payment',
        'payment_status' => 'required|in:pending,paid,failed',
        'delivered_at' => 'nullable|date',
        
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }
    

    $order = Order::create($validator->validated());
    return response()->json($order, 201);
}
public function store_items(Request $request)
{
    Log::info('Requête reçue pour création de commande itms ', $request->all());

    $data = $request->all(); // doit être un array associatif

    $validator = Validator::make($data, [
        'order_id' => 'required|exists:orders,id',
        'menu_id' => 'required|exists:menus,id',
        'quantity' => 'required|integer|min:1',
        'price' => 'required|numeric|min:0',
        'special_instructions' => 'nullable|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $item = OrderItem::create($validator->validated());

    return response()->json($item, 201);
}
public function getUserOrders($userId)
{
    $orders = Order::with([
        'restaurant:id,name,address',
        'rider:id,name,phone',
        'items.menu:id,name,image',
    ])
        ->where('user_id', $userId)
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(fn($order) => $this->serializeOrder($order));

    return response()->json($orders);
}

public function track($id)
{
    $order = Order::with([
        'restaurant:id,name,address',
        'rider:id,name,phone',
        'items.menu:id,name,image',
    ])->findOrFail($id);

    return response()->json($this->serializeOrder($order));
}

// Annuler une commande
public function cancelOrder($id)
{
    $order = Order::find($id);

    if (!$order) {
        return response()->json(['message' => 'Order not found'], 404);
    }

    if ($order->status !== 'pending') {
        return response()->json(['message' => 'Only pending orders can be cancelled'], 400);
    }

    $order->status = 'cancelled';
    $order->save();

    return response()->json(['message' => 'Order cancelled successfully', 'order' => $order]);
}

private function serializeOrder(Order $order): array
{
    $items = $order->items->map(function ($item) {
        $quantity = max((int) $item->quantity, 1);
        $lineTotal = (float) $item->price;

        return [
            'id' => $item->id,
            'name' => $item->menu?->name ?? 'Menu item',
            'image' => $item->menu?->image,
            'quantity' => $quantity,
            'unit_price' => round($lineTotal / $quantity, 2),
            'line_total' => $lineTotal,
            'special_instructions' => $item->special_instructions,
        ];
    })->values();

    return [
        'id' => $order->id,
        'order_number' => $order->order_number,
        'status' => $order->status,
        'status_label' => $this->statusLabel($order->status),
        'status_note' => $this->statusNote($order),
        'progress_percentage' => $this->progressPercentage($order->status),
        'can_cancel' => $order->status === 'pending',
        'placed_at' => $order->created_at?->toIso8601String(),
        'updated_at' => $order->updated_at?->toIso8601String(),
        'delivered_at' => $order->delivered_at?->toIso8601String(),
        'delivery_address' => $order->delivery_address,
        'contact_number' => $order->contact_number,
        'special_instructions' => $order->special_instructions,
        'subtotal' => (float) $order->subtotal,
        'delivery_fee' => (float) $order->delivery_fee,
        'total' => (float) $order->total,
        'payment_method' => $order->payment_method,
        'payment_method_label' => $this->paymentMethodLabel($order->payment_method),
        'payment_status' => $order->payment_status,
        'restaurant' => $order->restaurant ? [
            'id' => $order->restaurant->id,
            'name' => $order->restaurant->name,
            'address' => $order->restaurant->address,
        ] : null,
        'rider' => $order->rider ? [
            'id' => $order->rider->id,
            'name' => $order->rider->name,
            'phone' => $order->rider->phone,
        ] : null,
        'items_summary' => $items->map(fn($item) => $item['quantity'] . 'x ' . $item['name'])->implode(', '),
        'tracking_steps' => $this->trackingSteps($order->status),
        'items' => $items->all(),
    ];
}

private function trackingSteps(string $status): array
{
    $steps = [
        ['key' => 'pending', 'label' => 'Order placed', 'description' => 'We received your order and sent it to the restaurant.'],
        ['key' => 'processing', 'label' => 'Preparing', 'description' => 'The restaurant is preparing your items.'],
        ['key' => 'out_for_delivery', 'label' => 'On the way', 'description' => 'Your rider has picked up the order.'],
        ['key' => 'delivered', 'label' => 'Delivered', 'description' => 'The order arrived at your address.'],
    ];

    $currentIndex = $this->statusIndex($status);

    return collect($steps)->map(function ($step, $index) use ($currentIndex, $status) {
        $isCancelled = $status === 'cancelled';
        $completed = !$isCancelled && $index < $currentIndex;
        $current = !$isCancelled && $index === $currentIndex;

        if ($isCancelled) {
            $completed = $index === 0;
            $current = false;
        }

        return [
            ...$step,
            'completed' => $completed,
            'current' => $current,
        ];
    })->values()->all();
}

private function statusIndex(string $status): int
{
    return match ($status) {
        'pending' => 0,
        'processing' => 1,
        'out_for_delivery' => 2,
        'delivered' => 3,
        default => 0,
    };
}

private function progressPercentage(string $status): int
{
    return match ($status) {
        'pending' => 25,
        'processing' => 50,
        'out_for_delivery' => 80,
        'delivered' => 100,
        default => 0,
    };
}

private function statusLabel(string $status): string
{
    return match ($status) {
        'pending' => 'Pending',
        'processing' => 'Preparing',
        'out_for_delivery' => 'On the way',
        'delivered' => 'Delivered',
        'cancelled' => 'Cancelled',
        default => ucfirst(str_replace('_', ' ', $status)),
    };
}

private function statusNote(Order $order): string
{
    return match ($order->status) {
        'pending' => 'The restaurant has received your order.',
        'processing' => 'Your meal is being prepared.',
        'out_for_delivery' => $order->rider
            ? $order->rider->name . ' is heading to your address.'
            : 'A rider is on the way with your order.',
        'delivered' => 'Your order was delivered successfully.',
        'cancelled' => 'This order was cancelled before delivery.',
        default => 'Your order is being updated.',
    };
}

private function paymentMethodLabel(string $paymentMethod): string
{
    return match ($paymentMethod) {
        'cash' => 'Cash',
        'credit_card' => 'Credit card',
        'mobile_payment' => 'Mobile payment',
        default => ucfirst(str_replace('_', ' ', $paymentMethod)),
    };
}
}
