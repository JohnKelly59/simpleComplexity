<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Cashier\Exceptions\PaymentActionRequired;
use Stripe\StripeClient;
use Inertia\Inertia;


class SubscriptionController extends Controller
{
    public function upgrade(Request $request, string $tier)
    {
        // 1) Ensure the user is logged in.
        $user = $request->user();

        // 2) Make sure the user has a Stripe customer ID.
        // This will create a new Stripe customer if one does not exist.
        $user->createOrGetStripeCustomer();

        // 3) Determine the Stripe Price ID based on the subscription tier.
        $stripePriceId = match ($tier) {
            'pro'       => env('STRIPE_PRICE_TIER2'),
            'unlimited' => env('STRIPE_PRICE_TIER3'),
            default     => null,
        };

        if (!$stripePriceId) {
            abort(404, 'Unknown subscription tier.');
        }

        // 4) Create a Stripe Checkout Session for a subscription.
        $stripe = new StripeClient(config('cashier.secret'));
        $checkoutSession = $stripe->checkout->sessions->create([
            'customer' => $user->stripe_id,
            'mode'     => 'subscription',
            'line_items' => [
                [
                    'price'    => $stripePriceId,
                    'quantity' => 1,
                ],
            ],
            'subscription_data' => [
                'metadata' => [
                    'type' => $tier,
                ],
            ],
            'success_url' => route('subscription.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url'  => route('subscription.cancel'),
        ]);

        // 5) Redirect the user to Stripe's hosted Checkout page.
        return redirect($checkoutSession->url);
    }

    public function success(Request $request)
    {
        // Optionally, verify the checkout session using $request->session_id
        return redirect()->route('dashboard')->with('success', 'Subscription successful!');
    }

    public function cancelView(Request $request)
    {
        return redirect()->route('dashboard')->with('error', 'Subscription process was canceled.');
    }

    public function cancelSubscription(Request $request)
    {
        $user = $request->user();

        // Check if the user is subscribed to 'pro' or 'unlimited'
        if ($user->subscribed('pro')) {
            $user->subscription('pro')->cancel();
        } elseif ($user->subscribed('unlimited')) {
            $user->subscription('unlimited')->cancel();
        } else {
            return Inertia::render('SubscriptionSettings', [
                'flash' => [
                    'error' => 'No active subscription found to cancel.'
                ],
            ]);
        }

        return Inertia::render('settings/subscription', [
            'flash' => [
                'success' => 'Subscription cancelled. You will retain access until the end of your billing period.'
            ],
        ]);
    }
}
