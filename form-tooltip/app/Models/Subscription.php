<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    // If your table name is not `subscriptions`, set protected $table = 'subscriptions';
    // But by default it matches the class name (plural).

    protected $fillable = [
        'user_id',
        'name',           // 'free', 'tier2', 'tier3'
        'ai_limit',       // e.g. 0 for free, 5000 for tier2, null for tier3
        'ai_calls_count',
        'stripe_id',
        'stripe_status',
        'stripe_price',
        'quantity',
        'trial_ends_at',
        'ends_at',
    ];

    /**
     * Relation to the user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
