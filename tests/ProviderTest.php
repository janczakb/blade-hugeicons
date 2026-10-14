<?php

declare(strict_types=1);

namespace Bjanczak\BladeHugeicons\Tests;

use Bjanczak\BladeHugeicons\BladeHugeiconsServiceProvider;
use BladeUI\Icons\BladeIconsServiceProvider;
use BladeUI\Icons\Factory;
use Orchestra\Testbench\TestCase;

final class ProviderTest extends TestCase
{
    protected function getPackageProviders($app): array
    {
        return [BladeIconsServiceProvider::class, BladeHugeiconsServiceProvider::class];
    }

    public function test_it_registers_the_set_and_renders_only_the_requested_svg(): void
    {
        $factory = $this->app->make(Factory::class);
        $this->assertArrayHasKey('hugeicons', $factory->all());
        $html = $factory->svg('hugeicons-unfold-more', 'h-5 w-5 stroke-2')->toHtml();
        $document = new \DOMDocument;
        $this->assertTrue($document->loadXML($html));
        $this->assertSame(1, $document->getElementsByTagName('svg')->length);
        $this->assertSame(2, $document->getElementsByTagName('path')->length);
        $this->assertStringContainsString('stroke-2', $html);
        $this->assertStringNotContainsString('<script', $html);
        $this->assertStringNotContainsString('<link', $html);
        foreach (['search-01', 'calendar-05', 'linkedin-02'] as $name) {
            $this->assertStringContainsString('<svg', $factory->svg('hugeicons-'.$name)->toHtml());
        }
    }

    public function test_filled_details_do_not_inherit_an_unwanted_outline(): void
    {
        $html = $this->app->make(Factory::class)->svg('hugeicons-access')->toHtml();
        $document = new \DOMDocument;
        $this->assertTrue($document->loadXML($html));
        $this->assertFalse($document->documentElement->hasAttribute('stroke'));
        $this->assertSame('1.5', $document->documentElement->getAttribute('stroke-width'));
    }

    public function test_the_set_supports_custom_prefix_and_default_classes(): void
    {
        $this->app->make('config')->set('blade-hugeicons.prefix', 'customhuge');
        $this->app->make('config')->set('blade-hugeicons.class', 'stroke-2');
        $this->app->forgetInstance(Factory::class);
        $factory = $this->app->make(Factory::class);
        $this->assertStringContainsString('stroke-2', $factory->svg('customhuge-unfold-more')->toHtml());
    }
}
