<?php


use App\Http\Controllers\AIController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\cafesController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\MenuorderController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\RiderController;
use App\Http\Controllers\RiderRegistrationController;
use App\Http\Controllers\SeatingAreaController;
use App\Http\Controllers\UserController;
use App\Models\Rider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/users', [AuthController::class, 'register']);
//resto
Route::post('/restaurants', [RestaurantController::class, 'store']);
Route::get('/restaurants', [RestaurantController::class, 'index']);
Route::get('/restaurants/trending', [RestaurantController::class, 'popular_resto']);
Route::get('/restaurants/HotRestaurants', [RestaurantController::class, 'HotRestaurants']);
Route::get('/restaurants/{id}/similar', [RestaurantController::class, 'simularresto']);


//cafe
Route::get('/cafes', [cafesController::class, 'index']);
Route::get('/cafes/brandes', [cafesController::class, 'cofebrande']);
Route::get('/cafes/popular', [cafesController::class, 'popular_cafe']);

//pandingresto
Route::prefix('restaurants')->group(function () {
    Route::get('/pending', [PartnerController::class, 'pending']);
    Route::get('/approved', [PartnerController::class, 'approved']);
    Route::put('/{id}/approve', [PartnerController::class, 'approve']);
    Route::put('/{id}/reject', [PartnerController::class, 'reject']);
});

//registre_livreur
Route::post('/register-rider', [RiderRegistrationController::class, 'store']);

//pandindrivers
Route::prefix('riders')->group(function () {
    Route::get('/pending', [RiderController::class, 'pending']);
    Route::get('/approved', [RiderController::class, 'approved']);
    Route::put('/{id}/approve', [RiderController::class, 'approve']);
    Route::put('/{id}/reject', [RiderController::class, 'reject']);
});


//reviws
Route::get('/reviews', [ReviewController::class, 'index']);
Route::get('/reviews/{id}',[ReviewController::class, 'restoreviews']);
Route::post('/reviews', [ReviewController::class, 'store']);

//most order menu 
Route::get('/reports/most-ordered-menu', [MenuController::class, 'mostOrderedMenuThisWeek']);
Route::get('/restaurants/{id}/menus', [MenuController::class, 'getMenusByRestaurant']);
//best promo
Route::get('/best-promotions-and-categories', [MenuController::class, 'bestPromotionsWithCategories']);

//orders
Route::post('/orders', [OrderController::class, 'store_order']);
Route::post('/order-items', [OrderController::class, 'store_items']);
Route::get('/orders/user/{id}', [OrderController::class, 'getUserOrders']);
Route::get('/orders/{id}/tracking', [OrderController::class, 'track']);
Route::put('/orders/{id}/cancel', [OrderController::class, 'cancelOrder']);

//seating-postion
Route::get('/seating-areas/{restaurant_id}', [SeatingAreaController::class, 'index']);

//reservation
Route::post('/reservations', [SeatingAreaController::class, 'store']);
Route::get('/reservations/user/{user_id}', [ReservationController::class, 'getUserReservations']);
Route::patch('/reservations/{id}/cancel', [ReservationController::class, 'cancelReservation']);

//user
Route::put('/users/{id}', [UserController::class, 'update']);

//resto user
Route::get('/user/{id}/restaurant', [RestaurantController::class, 'getRestaurantByUser']);

//chatAi
Route::post('/ai/chat', [AIController::class, 'chat']);


//yoouseff-----------------------------------------------
use App\Http\Controllers\MenusController;

Route::apiResource('menus', MenusController::class);
Route::get('/users/{userId}/menus', [MenusController::class, 'index']);



use App\Http\Controllers\OrdersController;


Route::prefix('orders')->group(function () {
    Route::get('today', [OrdersController::class, 'getTodayOrders']);       // priorité haute
    Route::get('delivered/{id}', [OrdersController::class, 'getDeliveredOrders']);
    Route::get('rider/order', [OrdersController::class, 'currentOrder']); // avant {id} !!
    // routes/api.php
    Route::get('', [OrdersController::class, 'index']);
    Route::get('{id}', [OrdersController::class, 'show']);                 // doit être en dernier
    Route::patch('{id}/status', [OrdersController::class, 'updateStatus']);
    Route::patch('{id}/assign', [OrdersController::class, 'assignToRider']); // ok ici
    Route::patch('{id}/delivered', [OrdersController::class, 'markAsDelivered']);
});








use App\Http\Controllers\SeatingAreasController;

Route::apiResource('seating-areas', SeatingAreasController::class);

// Route spéciale pour supprimer une table (SeatingPosition)
Route::delete('/seating-positions/{id}', [SeatingAreasController::class, 'destroyPosition']);
Route::get('/seating-positions', [SeatingAreasController::class, 'getSeatingPositions']);

use App\Http\Controllers\ReservationsController;

Route::get('/reservations', [ReservationsController::class, 'index']);
Route::put('/reservations/{id}', [ReservationsController::class, 'update']);
Route::delete('/reservations/{id}', [ReservationsController::class, 'destroy']);
Route::patch('/reservations/{id}', [ReservationsController::class, 'updateStatus']);


Route::get('/restaurants/{id}/reservations', [ReservationsController::class, 'getByRestaurant']);


use App\Http\Controllers\AnalyticsController;

Route::get('/analytics', [AnalyticsController::class, 'weeklyStats']);




use App\Http\Controllers\RidersController;

Route::get('/rider/status', [RidersController::class, 'getStatus']);
Route::post('/rider/status', [RidersController::class, 'updateStatus']);
Route::get('/rider/{riderId}/today-summary', [RidersController::class, 'getTodaySummary']);
Route::get('/riders/{id}/profile', [RidersController::class, 'getProfile']);
Route::get('/riders/{user_id}', [RidersController::class, 'showInfo']);
Route::put('/riders/{user_id}', [RidersController::class, 'updateInfo']);

