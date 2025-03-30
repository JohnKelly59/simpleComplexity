<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class GoogleExtensionController extends Controller
{
    /**
     * Step 1: Called by the Chrome Extension to start the Google OAuth flow.
     * Example extension URL:
     *   https://your-app.test/auth/google/extension?redirect_uri=chrome-extension://<EXT_ID>/extension-callback
     */
    public function redirect(Request $request)
    {
        // 1) The Chrome extension passes ?redirect_uri=chrome-extension://<ext-id>/callback
        $extensionRedirectUri = $request->input('redirect_uri');

        // 2) We build the *final callback route* in our app, but we append the extensionRedirectUri
        //    as a query param. That way, when Google completes the flow, it will send the user
        //    back to *our* callback route *with* this param.
        $callbackUrl = route('google.extension.callback', [
            'ext_redirect_uri' => $extensionRedirectUri,
        ]);

        // 3) Initiate the Google OAuth flow *statelessly*, specifying the custom callback URL
        //    by using ->with(['redirect_uri' => ...]).
        return Socialite::driver('google')
            ->stateless()
            // Laravel Socialite respects the "redirect_uri" parameter for the final callback
            ->with(['redirect_uri' => $callbackUrl])
            ->redirect();
    }

    /**
     * Step 2: Google sends the user back here after they grant permission.
     *  e.g. GET /auth/google/extension/callback?ext_redirect_uri=chrome-extension://<EXT_ID>/callback
     */
    public function callback(Request $request)
    {
        // 1) Grab the extension’s redirect URI we appended above
        $extensionRedirectUri = $request->query('ext_redirect_uri');

        // 2) Finalize stateless Google OAuth
        $googleUser = Socialite::driver('google')->stateless()->user();

        // 3) Create or find a local user record
        $user = User::firstOrCreate(
            ['email' => $googleUser->email],
            [
                'name' => $googleUser->name ?? 'Google User',
                // For security, always store *some* password (can be random if you never need local login)
                'password' => bcrypt(\Str::random(16)),
                'subscriptionTier' => 'free',
            ]
        );

        // 4) Log them in so if they visit the site normally, the session is authenticated
        Auth::login($user);

        // 5) Generate a Sanctum personal access token for API usage from the extension
        $token = $user->createToken('ChromeExtension')->plainTextToken;

        // 6) If we have a valid extensionRedirectUri,
        //    redirect to the extension with the token in the query string
        if ($extensionRedirectUri) {
            return redirect()->away($extensionRedirectUri . '?token=' . urlencode($token));
        }

        // 7) Otherwise, just do whatever fallback makes sense
        //    perhaps a normal web user flow
        return redirect('/dashboard');
    }
}
