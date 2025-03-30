<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\GoogleExtensionController;
use Laravel\Cashier\Http\Controllers\WebhookController;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\SubscriptionController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Group routes that require auth and email verification
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard route that computes subscription tier
    Route::get('/dashboard', function () {
        $user = Auth::user();

        // Default to free
        $tier = 'free';

        // Check if the user has an active subscription
        $subscription = $user->subscription('default');
        if ($subscription && $subscription->active()) {
            $priceId = $subscription->items->first()->stripe_price ?? null;
            if ($priceId === env('STRIPE_PRICE_TIER2')) {
                $tier = 'tier2';
            } elseif ($priceId === env('STRIPE_PRICE_TIER3')) {
                $tier = 'tier3';
            }
        }

        // Pass subscription tier and AI calls count to the dashboard page
        return Inertia::render('dashboard', [
            'auth' => [
                'user' => [
                    'id'             => $user->id,
                    'name'           => $user->name,
                    'email'          => $user->email,
                    'tier'           => $tier,
                    'ai_calls_count' => $user->ai_calls_count ?? 0,
                ],
            ],
        ]);
    })->name('dashboard');

    // (Optional) subscription endpoints
    Route::post('/subscribe', [SubscriptionController::class, 'subscribe'])->name('subscribe');
    Route::post('/cancel-subscription', [SubscriptionController::class, 'cancel'])->name('cancel-subscription');
});

// Google OAuth routes
Route::get('/auth/google/redirect', function () {
    return Socialite::driver('google')->redirect();
})->name('google.redirect');

Route::get('/auth/callback/google', function () {
    $googleUser = Socialite::driver('google')->user();

    // Check if user exists
    $user = User::where('email', $googleUser->email)->first();

    if (!$user) {
        // Create a new user without setting 'subscriptionTier'
        $user = User::create([
            'name'     => $googleUser->name ?? 'Google User',
            'email'    => $googleUser->email,
            // Generate a random password or leave blank
            'password' => bcrypt(Str::random(16)),
        ]);
    }

    Auth::login($user);
    return redirect('/dashboard');
})->name('google.callback');

// Google Extension routes
Route::get('/auth/google/extension', [GoogleExtensionController::class, 'redirect'])->name('google.extension.redirect');
Route::get('/auth/google/extension/callback', [GoogleExtensionController::class, 'callback'])->name('google.extension.callback');

// Stripe Webhook endpoint for Cashier
Route::post('/stripe/webhook', [WebhookController::class, 'handleWebhook']);

Route::get('/subscription/manage', function () {
    $user = Auth::user();
    $tier = 'free';
    $subscription = $user->subscription('default');
    if ($subscription && $subscription->active()) {
        $priceId = $subscription->items->first()->stripe_price ?? null;
        if ($priceId === env('STRIPE_PRICE_TIER2')) {
            $tier = 'tier2';
        } elseif ($priceId === env('STRIPE_PRICE_TIER3')) {
            $tier = 'tier3';
        }
    }
    return Inertia::render('SubscriptionManagement', [
        'auth' => [
            'user' => [
                'id'   => $user->id,
                'name' => $user->name,
                'tier' => $tier,
            ],
        ],
    ]);
})->name('subscription.manage');
// Include other routes
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
