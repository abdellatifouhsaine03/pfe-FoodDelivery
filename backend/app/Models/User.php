<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements JWTSubject , MustVerifyEmail
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'phone', 'address', 'type'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


    public function restaurant()
    {
    return $this->hasOne(Restaurant::class);
    }

    public function rider()
{
    return $this->hasOne(Rider::class);
}


    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function riderDeliveries()
    {
        return $this->hasMany(Order::class, 'rider_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function riderStatus()
    {
        return $this->hasOne(RiderStatus::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // Required for JWT
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
