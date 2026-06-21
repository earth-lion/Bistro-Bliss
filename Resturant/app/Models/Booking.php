<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = ['user_id', 'num_of_people', 'booking_date', 'booking_time', 'status'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}