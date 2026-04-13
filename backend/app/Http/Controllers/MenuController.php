<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use App\Models\OrderItem;
use Carbon\Carbon;

class MenuController extends Controller
{
    

    public function getMenusByRestaurant($id)
    {
        // Récupérer le restaurant avec ses menus (relation "menus")
        $restaurant = Restaurant::with('menuItems')->findOrFail($id);
        $menusGrouped = $restaurant->menuItems->groupBy('category');
    

        $result = [];
        $categoryId = 1;
    
        foreach ($menusGrouped as $category => $items) {
            $categoryGroup = [
                'id' => (string) $categoryId++,
                'name' => $category,
                'items' => [],
            ];
    
            foreach ($items as $menu) {
                $categoryGroup['items'][] = [
                    'id' => (string) $menu->id,
                    'name' => $menu->name,
                    'description' => $menu->description,
                    'image' => $menu->image ? asset('storage/' . $menu->image) : '/placeholder.svg?height=200&width=200',
                    'price' => (float) $menu->price,
                ];
            }
    
            $result[] = $categoryGroup;
        }
    
        $user = Restaurant::with('user')->find($id);
        // Retourner le résultat avec le nom du restaurant
        return response()->json([
            'restaurant_name' => $restaurant->name,
            'restaurant_address' => $restaurant->address,
            'categories' => $result,
            'user'=>$user
        ]);
    }
    
    
    
    

    public function mostOrderedMenuThisWeek()
    {
        $startOfWeek = Carbon::now('Africa/Casablanca')->startOfWeek();
        $endOfWeek = Carbon::now('Africa/Casablanca')->endOfWeek();
    
        \Log::info('Start of week: ' . $startOfWeek);
        \Log::info('End of week: ' . $endOfWeek);
    
        $topMenus = OrderItem::whereHas('order', function ($query) use ($startOfWeek, $endOfWeek) {
                $query->whereBetween('created_at', [$startOfWeek, $endOfWeek]);
            })
            ->selectRaw('menu_id, SUM(quantity) as total_quantity')
            ->groupBy('menu_id')
            ->orderByDesc('total_quantity')
            ->take(5)
            ->get();
    
        $result = [];
    
        foreach ($topMenus as $item) {
            $menu = Menu::with('restaurant.reviews')->find($item->menu_id);
    
            if ($menu && $menu->restaurant) {
                $averageRating = $menu->restaurant->reviews->avg('rating');
    
                $result[] = [
                    'menu_id' => $menu->id,
                    'menu_name' => $menu->name,
                    'menu_image' => $menu->image ? asset('storage/' . $menu->image) : null, // <- ajoute l'image
                    'total_quantity' => $item->total_quantity,
                    'restaurant_name' => $menu->restaurant->name,
                    'restaurant_rating' => round($averageRating, 2),
                ];
            }
        }
    
        return response()->json($result);
    }

    //best promo

    public function bestPromotionsWithCategories(Request $request)
    {
        // Récupère toutes les promos avec leurs restaurants liés
        $menus = Menu::with('restaurant')
                    ->whereNotNull('discount')
                    ->orderByDesc('discount')
                    ->take(10)
                    ->get();
    
        // Liste des catégories distinctes parmi les menus avec promos
        $categories = Menu::whereNotNull('discount')
                          ->distinct()
                          ->pluck('category');
    
        return response()->json([
            'menus' => $menus,
            'categories' => $categories,
        ]);
    }

    
    
}
