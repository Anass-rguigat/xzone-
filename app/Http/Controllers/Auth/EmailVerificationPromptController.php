<?php

namespace App\Http\Controllers\Auth;


use App\Enum\RolesEnum;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     */
    public function __invoke(Request $request): RedirectResponse|Response
    {
        if ($request->user()->hasVerifiedEmail()) {
            $user = $request->user();

            if ($user->hasRole(RolesEnum::SuperAdmin->value)) {
                return redirect()->intended(route('profile.edit', absolute: false));
            } elseif ($user->hasRole(RolesEnum::Admin->value)) {
                return redirect()->intended(route('profile.edit', absolute: false));
            } else {
                return redirect()->intended(route('profile.edit', absolute: false));
            }
        }

        return Inertia::render('Auth/VerifyEmail', ['status' => session('status')]);
    }
}