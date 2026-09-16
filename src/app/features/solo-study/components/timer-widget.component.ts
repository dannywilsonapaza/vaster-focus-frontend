import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerService } from '../../../core/services/timer.service';
import { SessionType } from '../../../core/models';
import {
  LucidePlay,
  LucidePause,
  LucideRotateCcw,
  LucideCheckCircle2,
} from '@lucide/angular';

@Component({
  selector: 'app-timer-widget',
  standalone: true,
  imports: [
    CommonModule,
    LucidePlay,
    LucidePause,
    LucideRotateCcw,
    LucideCheckCircle2,
  ],
  template: `
    <div class="relative flex flex-col items-center justify-center p-8 rounded-3xl bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 max-w-md w-full mx-auto">
      <!-- Mode Selector Pills -->
      <div class="flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10 mb-8">
        <button
          type="button"
          (click)="setMode('WORK')"
          [class]="modeButtonClass('WORK')"
          class="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
        >
          Pomodoro (25m)
        </button>
        <button
          type="button"
          (click)="setMode('SHORT_BREAK')"
          [class]="modeButtonClass('SHORT_BREAK')"
          class="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
        >
          Descanso (5m)
        </button>
        <button
          type="button"
          (click)="setMode('LONG_BREAK')"
          [class]="modeButtonClass('LONG_BREAK')"
          class="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
        >
          Largo (15m)
        </button>
      </div>

      <!-- Circular Progress & Display -->
      <div class="relative w-64 h-64 flex items-center justify-center mb-8">
        <!-- SVG Progress Ring -->
        <svg class="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="44"
            class="text-white/5 stroke-current"
            stroke-width="4"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            [class]="progressColorClass()"
            stroke-width="4"
            stroke-linecap="round"
            fill="transparent"
            [style.strokeDasharray]="276.46"
            [style.strokeDashoffset]="strokeDashoffset()"
            class="transition-all duration-300"
          />
        </svg>

        <!-- Center Time Text -->
        <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span class="text-5xl font-mono font-bold tracking-wider select-none text-white drop-shadow-md">
            {{ timerService.formattedTime() }}
          </span>
          <div class="flex items-center gap-1.5 mt-2 text-xs font-medium" [class]="statusColorClass()">
            <span class="w-2 h-2 rounded-full animate-ping" [class.hidden]="timerService.status() !== 'RUNNING'"></span>
            <span>{{ statusText() }}</span>
          </div>
        </div>
      </div>

      <!-- Controls Actions -->
      <div class="flex items-center gap-4">
        <button
          type="button"
          (click)="togglePlayPause()"
          [class]="playButtonClass()"
          class="flex items-center justify-center w-14 h-14 rounded-full font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
          [attr.aria-label]="timerService.status() === 'RUNNING' ? 'Pausar' : 'Iniciar'"
        >
          @if (timerService.status() === 'RUNNING') {
            <svg lucidePause [size]="24" class="w-6 h-6 text-black fill-current"></svg>
          } @else {
            <svg lucidePlay [size]="24" class="w-6 h-6 text-black fill-current ml-0.5"></svg>
          }
        </button>

        <button
          type="button"
          (click)="timerService.reset()"
          class="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-200 border border-white/10"
          aria-label="Reiniciar"
        >
          <svg lucideRotateCcw [size]="18" class="w-4 h-4"></svg>
        </button>
      </div>

      <!-- Active Linked Goals pill -->
      @if (timerService.activeGoalIds().length > 0) {
        <div class="mt-6 flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full">
          <svg lucideCheckCircle2 [size]="14" class="w-3.5 h-3.5"></svg>
          <span>{{ timerService.activeGoalIds().length }} meta(s) vinculada(s)</span>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerWidgetComponent {
  readonly timerService = inject(TimerService);

  readonly strokeDashoffset = computed(() => {
    const circumference = 276.46;
    const progress = this.timerService.progress();
    return circumference - (progress / 100) * circumference;
  });

  readonly statusText = computed(() => {
    switch (this.timerService.status()) {
      case 'RUNNING':
        return this.timerService.mode() === 'WORK' ? 'Enfoque Profundo' : 'Descanso';
      case 'PAUSED':
        return 'Pausado';
      case 'COMPLETED':
        return '¡Completado!';
      default:
        return 'Listo';
    }
  });

  readonly progressColorClass = computed(() => {
    const mode = this.timerService.mode();
    if (mode === 'WORK') return 'stroke-emerald-400';
    if (mode === 'SHORT_BREAK') return 'stroke-sky-400';
    return 'stroke-purple-400';
  });

  readonly playButtonClass = computed(() => {
    const mode = this.timerService.mode();
    if (mode === 'WORK') return 'bg-emerald-400 hover:bg-emerald-300 text-black';
    if (mode === 'SHORT_BREAK') return 'bg-sky-400 hover:bg-sky-300 text-black';
    return 'bg-purple-400 hover:bg-purple-300 text-black';
  });

  readonly statusColorClass = computed(() => {
    const mode = this.timerService.mode();
    if (this.timerService.status() === 'RUNNING') {
      return mode === 'WORK' ? 'text-emerald-400' : 'text-sky-400';
    }
    return 'text-white/60';
  });

  setMode(mode: SessionType) {
    this.timerService.setMode(mode);
  }

  togglePlayPause() {
    if (this.timerService.status() === 'RUNNING') {
      this.timerService.pause();
    } else {
      this.timerService.start();
    }
  }

  modeButtonClass(mode: SessionType): string {
    const isSelected = this.timerService.mode() === mode;
    if (!isSelected) {
      return 'text-white/60 hover:text-white hover:bg-white/5';
    }
    if (mode === 'WORK') return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    if (mode === 'SHORT_BREAK') return 'bg-sky-500/20 text-sky-400 border border-sky-500/30';
    return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
  }
}
