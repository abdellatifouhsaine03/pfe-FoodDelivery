<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Restaurant;
use App\Models\User;
use App\Models\RiderStatus;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;

class OrdersController extends Controller
{
    // Lister toutes les commandes (avec leurs items)
    public function index()
    {
        $orders = Order::with(['user', 'restaurant', 'rider', 'items.menu'])->get();
        return response()->json($orders);
    }

    // Afficher une commande spécifique
    public function show($id)
    {
        $order = Order::with(['user', 'restaurant', 'rider', 'items.menu'])->findOrFail($id);
        return response()->json($order);
    }




    // Mettre à jour le status de la commande
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,out_for_delivery,delivered,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->status = $validated['status'];

        if ($validated['status'] === 'delivered') {
            $order->delivered_at = now();
        }
        $order->save();

        return response()->json($order);
    }





    public function getTodayOrders(Request $request)
    {
        $userId = $request->query('user_id');
    
        // Trouver le restaurant lié à l'utilisateur
        $restaurant = Restaurant::where('user_id', $userId)->first();
    
        if (!$restaurant) {
            return response()->json(['message' => 'Aucun restaurant trouvé pour cet utilisateur'], 404);
        }
    
        // Récupérer les commandes du restaurant
        $orders = Order::with(['user', 'items.menu'])
            ->where('restaurant_id', $restaurant->id)
            ->get();
    
        return response()->json($orders);
    }

    public function getDeliveredOrders($id)
    {
        $orders = Order::with('restaurant')
                       ->whereIn('status', ['pending', 'processing'])
                       ->orWhere(function($query) use ($id) {
                           $query->where('status', 'out_for_delivery')
                                 ->where('rider_id', $id);
                       })
                       ->get();
    
        return response()->json($orders);
    }    

public function assignToRider(Request $request, $id)
{
    $riderId = $request->input('rider_id');

    // Vérifie si le rider a déjà une commande en cours de livraison
    $existingOrder = Order::where('rider_id', $riderId)
        ->where('status', 'out_for_delivery')
        ->first();

    if ($existingOrder) {
        return response()->json([
            'message' => 'Vous avez déjà une commande à livrer.',
        ], 400);
    }

    $order = Order::findOrFail($id);

    if (!in_array($order->status, ['pending', 'processing'], true)) {
        return response()->json([
            'message' => 'Cette commande ne peut plus Ãªtre prise en charge.',
        ], 400);
    }

    if ($order->rider_id && (int) $order->rider_id !== (int) $riderId) {
        return response()->json([
            'message' => 'Cette commande est dÃ©jÃ  attribuÃ©e Ã  un autre livreur.',
        ], 409);
    }

    $order->rider_id = $riderId;
    $order->status = 'out_for_delivery';
    $order->save();

    return response()->json([
        'message' => 'Commande assignée au livreur avec succès.',
        'order' => $order
    ]);
}



public function markAsDelivered($id)
{
    $order = Order::findOrFail($id);

    if ($order->status !== 'out_for_delivery') {
        return response()->json([
            'message' => 'Impossible de terminer une commande qui n’est pas en cours de livraison.'
        ], 400);
    }

    $order->status = 'delivered';
    $order->delivered_at = now();
    $order->save();

    return response()->json([
        'message' => 'Commande marquée comme livrée.',
        'order' => $order
    ]);
}

public function currentOrder(Request $request)
    {

    $riderId = $request->query('rider_id');
        // Récupérer la dernière commande "en cours" pour ce livreur
        $order = Order::with(['user', 'restaurant', 'items.menu'])
            ->where('rider_id', $riderId)
            ->where('status', 'out_for_delivery')
            ->latest()
            ->first();

        if (!$order) {
            return response()->json(['message' => 'No active order'], 404);
        }

        return response()->json($order);
    }


}
