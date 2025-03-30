<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');

    Route::get('/settings/subscription', function () {
        $user = Auth::user();

        // Default to 'free'
        $tier = 'free';

        // Check subscription
        $subscription = $user->subscription('default');
        if ($subscription && $subscription->active()) {
            $priceId = $subscription->items->first()->stripe_price ?? null;
            if ($priceId === env('STRIPE_PRICE_TIER2')) {
                $tier = 'tier2';
            } elseif ($priceId === env('STRIPE_PRICE_TIER3')) {
                $tier = 'tier3';
            }
        }

        return Inertia::render('settings/subscription', [
            'auth' => [
                'user' => [
                    'id'   => $user->id,
                    'name' => $user->name,
                    'tier' => $tier,
                ],
            ],
        ]);
    })->name('settings.subscription');
});
