<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'ai_limit',
    ];

    // If you store the user's tier directly in users table:
    // public function users()
    // {
    //     return $this->hasMany(User::class, 'tier_id');
    // }
}
