<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index()
    {
       
        $logs = AuditLog::with(['user', 'auditable'])
            ->get();

        return Inertia::render('AuditLogs/Index', [
            'logs' => $logs->toArray()
        ]);
    }

    public function show(AuditLog $auditLog)
    {
        
        $auditLog->load(['user', 'auditable']);

        return Inertia::render('AuditLogs/Show', [
            'log' => $auditLog
        ]);
    }
}