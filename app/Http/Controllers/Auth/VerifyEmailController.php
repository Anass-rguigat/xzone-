<?php

namespace App\Http\Controllers\Auth;

use App\Enum\RolesEnum;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('profile.edit', absolute: false).'?verified=1');
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        $user = $request->user();

        if ($user->hasRole(RolesEnum::SuperAdmin->value)) {
            return redirect()->intended(route('profile.edit', absolute: false));
        } elseif ($user->hasRole(RolesEnum::Admin->value)) {
            return redirect()->intended(route('profile.edit', absolute: false));
        } else {
            return redirect()->intended(route('profile.edit', absolute: false));
        }
    }
}
