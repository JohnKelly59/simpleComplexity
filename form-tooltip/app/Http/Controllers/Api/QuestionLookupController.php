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

        try {
            // Check if user is on an unlimited subscription first
            if ($user->subscribed('unlimited')) {
                \Log::info('User is on unlimited subscription');
                $result = $this->aiService->getTooltips($request->keys);
                $user->increment('ai_calls_count');
            }
            // For pro subscription, enforce the 5000 AI call limit
            elseif ($user->subscribed('pro')) {
                \Log::info('User is on pro subscription');
                if (($user->ai_calls_count ?? 0) < 5000) {
                    $result = $this->aiService->getTooltips($request->keys);
                    $user->increment('ai_calls_count');
                } else {
                    \Log::info('Pro user AI call limit reached; falling back to database');
                    $result = $this->dbService->getTooltips($request->keys);
                }
            }
            // Non-subscribed users use database tooltips
            else {
                $result = $this->dbService->getTooltips($request->keys);
            }

            return response()->json($result, Response::HTTP_OK);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'Failed to look up tooltips'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
