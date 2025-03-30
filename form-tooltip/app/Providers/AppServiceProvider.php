<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\TooltipAiService;
use App\Services\TooltipDbService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind the TooltipAiService as a singleton
        $this->app->singleton(TooltipAiService::class, function ($app) {
            return new TooltipAiService();
        });

        // Bind the TooltipDbService as a singleton
        $this->app->singleton(TooltipDbService::class, function ($app) {
            return new TooltipDbService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
