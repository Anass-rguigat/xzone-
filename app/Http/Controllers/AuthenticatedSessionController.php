<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AuthenticationLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Jenssegers\Agent\Agent;

class AuthenticatedSessionController extends Controller
{
    public function store(Request $request)
    {
        $agent = new Agent();
        $agent->setUserAgent($request->userAgent());

        $success = false;
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

        return response()->noContent();
    }
} 