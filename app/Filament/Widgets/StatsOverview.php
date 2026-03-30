<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;


class StatsOverview extends StatsOverviewWidget
{
    protected static bool $isLazy = false;

    protected ?string $heading = 'Analytics';

    protected ?string $description = 'An overview of some analytics.';
    protected function getStats(): array
    {
        return [
            Stat::make('Unique views', '192.1k')
                ->description('32k increase')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('info'),
            Stat::make('Bounce rate', date('d M Y', time())),
            Stat::make('Average time on page', '3:12'),
            Stat::make('Unique views', '192.1k'),
            Stat::make('Bounce rate', date('d M Y', time())),
            Stat::make('Average time on page', '3:12')
                ->description('3% increase')
                ->descriptionIcon('heroicon-o-arrow-right-circle'),
        ];
    }
}
