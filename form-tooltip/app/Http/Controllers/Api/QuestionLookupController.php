<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\TooltipDbService;
use App\Services\TooltipAiService;
use Symfony\Component\HttpFoundation\Response;

class QuestionLookupController extends Controller
{
    public function __construct(
        protected TooltipDbService $dbService,
        protected TooltipAiService $aiService
    ) {
        // ...
    }

    public function handle(Request $request)
    {
        $request->validate([
            'keys' => 'required|array',
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Not authenticated'], 401);
        }

        // Determine tier from Stripe subscription
        $subscription = $user->subscription('default');
        $tier = 'free';
        if ($subscription && $subscription->active()) {
            $priceId = $subscription->items->first()->stripe_price ?? null;
            if ($priceId === env('STRIPE_PRICE_TIER2')) {
                $tier = 'tier2';
            } elseif ($priceId === env('STRIPE_PRICE_TIER3')) {
                $tier = 'tier3';
            }
        }

        // Map tier -> AI limit
        $tierAiLimits = [
            'free'  => 0,
            'tier2' => 5000,
            'tier3' => null, // unlimited
        ];

        $limit   = $tierAiLimits[$tier];
        $current = $user->ai_calls_count ?? 0; // store usage on user or elsewhere

        try {
            // If free => fallback
            if ($tier === 'free') {
                $result = $this->dbService->getTooltips($request->keys);
            }
            // If tier2 => check usage
            elseif ($tier === 'tier2') {
                if (!is_null($limit) && $current < $limit) {
                    $result = $this->aiService->getTooltips($request->keys);
                    $user->increment('ai_calls_count');
                } else {
                    $result = $this->dbService->getTooltips($request->keys);
                }
            }
            // If tier3 => unlimited
            else { // 'tier3'
                $result = $this->aiService->getTooltips($request->keys);
                $user->increment('ai_calls_count');
            }

            return response()->json($result, 200);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'Failed to look up tooltips'], 500);
        }
    }
}
