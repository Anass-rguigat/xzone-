<?php

namespace App\Http\Controllers\Auth;

use App\Enum\RolesEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\AuthenticationLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Jenssegers\Agent\Agent;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $agent = new Agent();
        $agent->setUserAgent($request->userAgent());

        $success = false;
        $user_id = null;
        try {
            $request->authenticate();
            $success = true;
            $user_id = Auth::id();
        } catch (\Illuminate\Auth\AuthenticationException $e) {
            throw $e;
        } finally {
            AuthenticationLog::create([
                'user_id' => $success ? $user_id : null,
                'email' => $request->email,
                'ip_address' => $request->ip(),
                'mac_address' => $this->getClientMacAddress(),
                'success' => $success,
                'user_agent' => $request->userAgent(),
            ]);
        }

        $request->session()->regenerate();

        $user = $request->user();

        if ($user->hasRole(RolesEnum::SuperAdmin->value)) {
            return redirect()->intended(route('profile.edit', absolute: false));
        } elseif ($user->hasRole(RolesEnum::Admin->value)) {
            return redirect()->intended(route('profile.edit', absolute: false));
        } else {
            return redirect()->intended(route('profile.edit', absolute: false));
        }
    }

    private function getClientMacAddress()
    {
        return substr(exec('getmac'), 0, 17); // Windows seulement
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
