import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { DailyStat } from '../../../core/models';

@Component({
  selector: 'app-daily-chart',
  standalone: true,
  imports: [],
  templateUrl: './daily-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyChartComponent {
  readonly dailyStats = input.required<DailyStat[]>();

  readonly chartData = computed<DailyStat[]>(() => {
    return [...this.dailyStats()].reverse().slice(-14);
  });

  readonly maxSeconds = computed<number>(() => {
    const stats = this.chartData();
    if (stats.length === 0) return 3600;
    const max = Math.max(...stats.map((s) => s.totalSeconds));
    return Math.max(max, 1800);
  });

  getWorkPercent(seconds: number): number {
    const max = this.maxSeconds();
    if (max === 0) return 0;
    return Math.min(100, Math.round((seconds / max) * 100));
  }

  formatDayLabel(studyDay: string): string {
    const parts = studyDay.split('-');
    if (parts.length < 3) return studyDay;
    return `${parts[2]}/${parts[1]}`;
  }

  formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m} min`;
  }
}
