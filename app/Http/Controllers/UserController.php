<?php

namespace App\Http\Controllers;

use App\Enum\PermissionsEnum;
use App\Enum\RolesEnum;
use App\Http\Resources\AuthUserResource;
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
    

    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => AuthUserResource::collection(User::all())->collection->toArray()
        ]);
    }

    public function edit(User $user)
    {
        // Vérifier si l'utilisateur peut modifier cet utilisateur spécifique
        if (!Gate::allows('manage_users') && Auth::id() !== $user->id) {
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
        // Vérifier si l'utilisateur peut modifier cet utilisateur spécifique
        if (!Gate::allows('manage_users') && Auth::id() !== $user->id) {
            return redirect()->route('users.index')
                ->with('error', 'You do not have permission to update this user.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'max:20'],
            'city' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
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
            // Vérifier si on essaie de retirer le dernier SuperAdmin
            if ($user->hasRole(RolesEnum::SuperAdmin->value) && 
                !in_array(RolesEnum::SuperAdmin->value, $validated['roles'])) {
                $superAdminCount = User::role(RolesEnum::SuperAdmin->value)->count();
                if ($superAdminCount <= 1) {
                    return redirect()->back()
                        ->with('error', 'Cannot remove the last SuperAdmin role.');
                }
            }

            // Handle SuperAdmin special case
            $isSuperAdmin = in_array(RolesEnum::SuperAdmin->value, $validated['roles']);

            // Sync roles and permissions atomically
            DB::transaction(function () use ($user, $validated, $isSuperAdmin) {
                // Mettre à jour les informations de base de l'utilisateur
                $user->update([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'phone' => $validated['phone'],
                    'city' => $validated['city'],
                    'country' => $validated['country'],
                ]);

                // IMPORTANT: Ne pas détacher les rôles existants
                // Utiliser syncRoles qui gère correctement la synchronisation
                $user->syncRoles($validated['roles']);

                // Gérer les permissions
                if ($isSuperAdmin) {
                    // SuperAdmin obtient toutes les permissions
                    $permissions = Permission::all();
                    $user->syncPermissions($permissions);
                } else {
                    // Synchroniser uniquement les permissions sélectionnées
                    $permissions = Permission::whereIn('name', $validated['permissions'])->get();
                    $user->syncPermissions($permissions);
                }

                // Log pour le débogage
                Log::info('User updated', [
                    'user_id' => $user->id,
                    'updated_by' => Auth::id(),
                    'roles' => $validated['roles'],
                    'permissions' => $isSuperAdmin ? 'all' : $validated['permissions'],
                    'current_permissions' => $user->getAllPermissions()->pluck('name'),
                    'user_data' => [
                        'name' => $validated['name'],
                        'email' => $validated['email'],
                        'phone' => $validated['phone'],
                        'city' => $validated['city'],
                        'country' => $validated['country'],
                    ],
                ]);
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
