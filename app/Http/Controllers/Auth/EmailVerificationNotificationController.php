<?php

namespace App\Http\Controllers\Auth;

use App\Enum\RolesEnum;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
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

        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}
