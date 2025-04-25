<?php

namespace App\Http\Controllers;

use App\Models\AuthenticationLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthenticationLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = AuthenticationLog::with('user')->get();
        return Inertia::render('AuthenticationLogs/Index', [
            'logs' => $logs
        ]);
    }
}
