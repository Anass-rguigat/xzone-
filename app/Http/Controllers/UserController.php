<?php

namespace App\Http\Controllers;

use App\Enum\PermissionsEnum;
use App\Enum\RolesEnum;
use App\Http\Resources\AuthUserResource;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
{
    private function logAudit($event, $user, $changes = null)
    {
        $oldValues = [];
        $newValues = [];

        if ($changes) {
            $oldValues = $changes['old'] ?? [];
            $newValues = $changes['new'] ?? [];
        }

        AuditLog::create([
            'user_id' => Auth::check() ? Auth::id() : null,
            'event' => $event,
            'auditable_type' => User::class,
            'auditable_id' => $user->id,
            'old_values' => json_encode($oldValues),
            'new_values' => json_encode($newValues),
            'url' => request()->fullUrl(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => AuthUserResource::collection(User::all())->collection->toArray()
        ]);
    }

    public function edit(User $user)
    {
        if (!Gate::allows('Gerer_Utilisateurs') && Auth::id() !== $user->id) {
            return redirect()->route('users.index')
                ->with('error', 'You do not have permission to edit this user.');
        }

        return Inertia::render('Users/Edit', [
            'user' => new AuthUserResource($user),
            'roles' => RolesEnum::values(),
            'roleLabels' => RolesEnum::labels(),
            'permissions' => PermissionsEnum::values(),
            'permissionLabels' => PermissionsEnum::labels(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        if (!Gate::allows('Gerer_Utilisateurs') && Auth::id() !== $user->id) {
            return redirect()->route('users.index')
                ->with('error', 'You do not have permission to update this user.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['string', 'in:' . implode(',', RolesEnum::values())],
            'permissions' => ['required', 'array', 'min:1'],
            'permissions.*' => ['string', 'in:' . implode(',', PermissionsEnum::values())],
        ], [
            'roles.required' => 'At least one role is required.',
            'roles.min' => 'At least one role must be selected.',
            'permissions.required' => 'At least one permission is required.',
            'permissions.min' => 'At least one permission must be selected.',
        ]);

        try {
            if ($user->hasRole(RolesEnum::SuperAdmin->value) && 
                !in_array(RolesEnum::SuperAdmin->value, $validated['roles'])) {
                $superAdminCount = User::role(RolesEnum::SuperAdmin->value)->count();
                if ($superAdminCount <= 1) {
                    return redirect()->back()
                        ->with('error', 'Cannot remove the last SuperAdmin role.');
                }
            }

            $isSuperAdmin = in_array(RolesEnum::SuperAdmin->value, $validated['roles']);
            $oldAttributes = $user->getAttributes();
            $oldRoles = $user->roles->pluck('name')->toArray();
            $oldPermissions = $user->getAllPermissions()->pluck('name')->toArray();

            DB::transaction(function () use ($user, $validated, $isSuperAdmin, $oldAttributes, $oldRoles, $oldPermissions) {
                // Update user
                $user->update([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                ]);

                // Sync roles and permissions
                $user->syncRoles($validated['roles']);
                
                if ($isSuperAdmin) {
                    $permissions = Permission::all();
                    $user->syncPermissions($permissions);
                } else {
                    $permissions = Permission::whereIn('name', $validated['permissions'])->get();
                    $user->syncPermissions($permissions);
                }

                // Get new state
                $newRoles = $user->roles->pluck('name')->toArray();
                $newPermissions = $user->getAllPermissions()->pluck('name')->toArray();

                // Log user changes
                $this->logAudit('modifier', $user, [
                    'old' => $oldAttributes,
                    'new' => $user->getChanges()
                ]);

                // Log role changes
                $addedRoles = array_diff($newRoles, $oldRoles);
                $removedRoles = array_diff($oldRoles, $newRoles);
                
                if (!empty($addedRoles)) {
                    $this->logAudit('rôles_ajouter', $user, ['new' => $addedRoles]);
                }
                if (!empty($removedRoles)) {
                    $this->logAudit('rôles_retirer', $user, ['old' => $removedRoles]);
                }

                // Log permission changes
                $addedPermissions = array_diff($newPermissions, $oldPermissions);
                $removedPermissions = array_diff($oldPermissions, $newPermissions);
                
                if (!empty($addedPermissions)) {
                    $this->logAudit('permissions_ajouter', $user, ['new' => $addedPermissions]);
                }
                if (!empty($removedPermissions)) {
                    $this->logAudit('permissions_retirer', $user, ['old' => $removedPermissions]);
                }
            });

            return redirect()->route('users.index')
                ->with('success', 'User updated successfully');
        } catch (\Exception $e) {
            Log::error('User update error: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'updated_by' => Auth::id(),
                'error' => $e->getMessage()
            ]);
            return redirect()->back()
                ->with('error', 'Error updating user: ' . $e->getMessage());
        }
    }
}