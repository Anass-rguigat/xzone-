<?php

namespace App\Providers;

use App\Http\Controllers\DiscountController;
use App\Http\Controllers\DiscountComponentController;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Relation::morphMap([
            'Battery' => \App\Models\Battery::class,
            'Ram' => \App\Models\Ram::class,
            'Disk' => \App\Models\Server::class,
            // Ajoute ici tous tes types de composants
        ]);
    }
}
