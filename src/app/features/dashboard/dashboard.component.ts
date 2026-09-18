import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { StatsSummary, DailyStat, Session } from '../../core/models';
import { StatCardComponent } from './components/stat-card.component';
import { DailyChartComponent } from './components/daily-chart.component';
import { LucideArrowLeft, LucideHistory, LucideRefreshCw } from '@lucide/angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    StatCardComponent,
    DailyChartComponent,
    LucideArrowLeft,
    LucideHistory,
    LucideRefreshCw,
  ],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly apiService = inject(ApiService);

  readonly summary = signal<StatsSummary | null>(null);
  readonly dailyStats = signal<DailyStat[]>([]);
  readonly recentSessions = signal<Session[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly Math = Math;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);

    this.apiService.getStatsSummary().subscribe({
      next: (sum) => this.summary.set(sum),
      error: (e) => console.error('[Dashboard] Error resumen:', e),
    });

    this.apiService.getDailyStats(undefined, undefined, 30).subscribe({
      next: (daily) => this.dailyStats.set(daily),
      error: (e) => console.error('[Dashboard] Error daily:', e),
    });

    this.apiService.getSessions(10).subscribe({
      next: (sessions) => {
        this.recentSessions.set(sessions);
        this.isLoading.set(false);
      },
      error: (e) => {
        console.error('[Dashboard] Error sessions:', e);
        this.isLoading.set(false);
      },
    });
  }

  formatWorkHours(seconds: number): string {
    const hours = (seconds / 3600).toFixed(1);
    return `${hours} hrs`;
  }

  formatSessionDate(isoString: string): string {
    const d = new Date(isoString);
    return d.toLocaleString('es-PE', {
      timeZone: 'America/Lima',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
