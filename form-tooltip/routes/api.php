<?php

// routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\QuestionLookupController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/question-lookup', [QuestionLookupController::class, 'handle'])
        ->name('question-lookup');
});

Route::post('/login', function (Request $request) {
    $request->validate([
        'email'    => 'required|email',
        'password' => 'required',
    ]);

    if (!Auth::attempt($request->only('email', 'password'))) {
        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    /** @var \App\Models\User $user */
    $user = Auth::user();
    // Create a Sanctum personal access token
    $token = $user->createToken('chrome-extension')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user'  => $user,
    ]);
});
