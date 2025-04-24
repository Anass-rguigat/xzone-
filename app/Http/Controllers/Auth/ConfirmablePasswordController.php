<?php

namespace App\Http\Controllers\Auth;

use App\Enum\RolesEnum;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ConfirmablePasswordController extends Controller
{
    /**
     * Show the confirm password view.
     */
    public function show(): Response
    {
        return Inertia::render('Auth/ConfirmPassword');
    }

    /**
     * Confirm the user's password.
     */
    public function store(Request $request): RedirectResponse
    {
        if (! Auth::guard('web')->validate([
            'email' => $request->user()->email,
            'password' => $request->password,
        ])) {
            throw ValidationException::withMessages([
                'password' => __('auth.password'),
            ]);
        }

        $request->session()->put('auth.password_confirmed_at', time());
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
