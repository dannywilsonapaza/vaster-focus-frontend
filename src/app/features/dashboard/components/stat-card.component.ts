import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import {
  LucideFlame,
  LucideClock,
  LucideCheckCircle2,
  LucideTrophy,
  LucideCalendar,
} from '@lucide/angular';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [
    LucideFlame,
    LucideClock,
    LucideCheckCircle2,
    LucideTrophy,
    LucideCalendar,
  ],
  templateUrl: './stat-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string | number>();
  readonly subtitle = input<string>();
  readonly icon = input<string>('clock');
  readonly accent = input<'emerald' | 'amber' | 'blue' | 'purple'>('emerald');

  readonly iconColorClass = computed<string>(() => {
    switch (this.accent()) {
      case 'amber':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'blue':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'purple':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }
  });
}
