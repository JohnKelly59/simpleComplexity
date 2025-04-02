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
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as VerifyCsrfTokenMiddleware;
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
        if ($user->subscribed('pro') || $user->subscribed('unlimited')) {
            \Log::info('User is subscribed');
            if ($user->subscribed('pro')) {
                $tier = 'Pro';
            } elseif ($user->subscribed('unlimited')) {
                $tier = 'Unlimited';
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

    Route::get('/subscription/manage', [SubscriptionController::class, 'managePortal'])->name('subscription.manage');
    Route::get('/subscription/upgrade/{tier}', [SubscriptionController::class, 'upgrade'])
        ->name('subscription.upgrade');
    Route::post('/subscription/cancel-subscription', [SubscriptionController::class, 'cancelSubscription'])
        ->name('subscription.cancel-subscription');
    Route::get('/subscription/success', [SubscriptionController::class, 'success'])->name('subscription.success');
    Route::get('/subscription/cancel', [SubscriptionController::class, 'cancelView'])->name('subscription.cancel');
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
Route::post('/stripe/webhook', [WebhookController::class, 'handleWebhook'])->withoutMiddleware([VerifyCsrfTokenMiddleware::class]);;

// Include other routes
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
