import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    CommonModule,
    LucideFlame,
    LucideClock,
    LucideCheckCircle2,
    LucideTrophy,
    LucideCalendar,
  ],
  template: `
    <div class="p-5 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/10 shadow-lg flex flex-col justify-between transition-all hover:border-white/20">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-medium text-white/50 tracking-wider uppercase">{{ title() }}</span>
        <div class="flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 border border-white/5" [ngClass]="iconColorClass()">
          @switch (icon()) {
            @case ('flame') { <svg lucideFlame [size]="16" class="w-4 h-4"></svg> }
            @case ('clock') { <svg lucideClock [size]="16" class="w-4 h-4"></svg> }
            @case ('check') { <svg lucideCheckCircle2 [size]="16" class="w-4 h-4"></svg> }
            @case ('trophy') { <svg lucideTrophy [size]="16" class="w-4 h-4"></svg> }
            @default { <svg lucideCalendar [size]="16" class="w-4 h-4"></svg> }
          }
        </div>
      </div>

      <div>
        <div class="text-3xl font-mono font-bold tracking-tight text-white">
          {{ value() }}
        </div>
        @if (subtitle()) {
          <p class="text-xs text-white/40 mt-1 font-mono">
            {{ subtitle() }}
          </p>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string | number>();
  readonly subtitle = input<string>();
  readonly icon = input<string>('clock');
  readonly accent = input<'emerald' | 'amber' | 'blue' | 'purple'>('emerald');

  readonly iconColorClass = computed(() => {
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
