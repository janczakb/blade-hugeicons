<?php

declare(strict_types=1);

namespace Bjanczak\BladeHugeicons;

use BladeUI\Icons\Factory;
use Illuminate\Support\ServiceProvider;

final class BladeHugeiconsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/../config/blade-hugeicons.php', 'blade-hugeicons');
        $this->callAfterResolving(Factory::class, function (Factory $factory): void {
            $configuration = (array) $this->app->make('config')->get('blade-hugeicons', []);
            $factory->add('hugeicons', array_replace($configuration, [
                'path' => __DIR__.'/../resources/svg',
            ]));
        });
    }

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../config/blade-hugeicons.php' => $this->app->configPath('blade-hugeicons.php'),
            ], 'blade-hugeicons-config');
        }
    }
}
