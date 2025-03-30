<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subscription;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $subscriptions = [
            [
                'name'     => 'free',
                'ai_limit' => 0,
            ],
            [
                'name'     => 'tier2',
                'ai_limit' => 5000,
            ],
            [
                'name'     => 'tier3',
                'ai_limit' => null
            ],
        ];

        foreach ($subscriptions as $subscription) {
            Subscription::updateOrCreate(
                ['name' => $subscription['name']], // condition to check if record exists
                $subscription                      // data to insert/update
            );
        }
    }
}
