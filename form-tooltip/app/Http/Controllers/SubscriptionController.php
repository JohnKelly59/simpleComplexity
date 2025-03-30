<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Cashier\Exceptions\PaymentActionRequired;

class SubscriptionController extends Controller
{
    /**
     * Subscribe or upgrade to tier2 or tier3.
     */
    public function subscribe(Request $request)
    {
        $request->validate([
            'tier'           => 'required|in:tier2,tier3',
            'payment_method' => 'required|string',
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        // Map the incoming tier => Stripe price ID
        $priceId = $request->tier === 'tier2'
            ? env('STRIPE_PRICE_TIER2')
            : env('STRIPE_PRICE_TIER3');

        // Ensure the user is a Stripe customer
        $user->createOrGetStripeCustomer();

        // Update the default payment method
        $user->updateDefaultPaymentMethod($request->payment_method);

        try {
            $subscription = $user->subscription('default');

            // If the user already has an active subscription, we'll SWAP instead of creating a brand new one
            if ($subscription && $subscription->active()) {
                // Swap to the new plan
                $subscription->swap($priceId);

                return response()->json([
                    'status'        => 'upgraded',
                    'tier'          => $request->tier,
                    'stripe_status' => $subscription->refresh()->stripe_status,
                ], 200);
            } else {
                // Otherwise, create a new subscription
                $newSubscription = $user->newSubscription('default', $priceId)
                    ->create($request->payment_method);

                return response()->json([
                    'status'        => 'subscribed',
                    'tier'          => $request->tier,
                    'stripe_status' => $newSubscription->stripe_status,
                ], 200);
            }
        } catch (PaymentActionRequired $e) {
            // If 3D Secure or SCA is required
            return response()->json([
                'error'                         => 'Payment action required',
                'payment_intent_client_secret'  => $e->payment->client_secret,
            ], 422);
        } catch (\Exception $e) {
            \Log::error('SubscriptionController@subscribe error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to subscribe or upgrade subscription'
            ], 500);
        }
    }

    /**
     * Cancel the user's subscription.
     */
    public function cancel(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        $subscription = $user->subscription('default');
        if (!$subscription) {
            return response()->json(['error' => 'No subscription found'], 404);
        }

        // If subscription not active or already canceled
        if (!$subscription->active()) {
            return response()->json([
                'error' => 'Subscription is not currently active or already canceled'
            ], 400);
        }

        // Cancel at period end (if you want immediate cancellation, use cancelNow())
        $subscription->cancel();

        return response()->json([
            'status'        => 'canceled',
            'stripe_status' => $subscription->refresh()->stripe_status,
        ], 200);
    }
}
