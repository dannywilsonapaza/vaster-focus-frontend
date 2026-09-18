import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
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
    LucidePlay,
    LucidePause,
    LucideRotateCcw,
    LucideCheckCircle2,
  ],
  templateUrl: './timer-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerWidgetComponent {
  readonly timerService = inject(TimerService);

  readonly strokeDashoffset = computed<number>(() => {
    const circumference = 276.46;
    const progress = this.timerService.progress();
    return circumference - (progress / 100) * circumference;
  });

  readonly statusText = computed<string>(() => {
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

  readonly progressColorClass = computed<string>(() => {
    const mode = this.timerService.mode();
    if (mode === 'WORK') return 'stroke-emerald-400';
    if (mode === 'SHORT_BREAK') return 'stroke-sky-400';
    return 'stroke-purple-400';
  });

  readonly playButtonClass = computed<string>(() => {
    const mode = this.timerService.mode();
    if (mode === 'WORK') return 'bg-emerald-400 hover:bg-emerald-300 text-black';
    if (mode === 'SHORT_BREAK') return 'bg-sky-400 hover:bg-sky-300 text-black';
    return 'bg-purple-400 hover:bg-purple-300 text-black';
  });

  readonly statusColorClass = computed<string>(() => {
    const mode = this.timerService.mode();
    if (this.timerService.status() === 'RUNNING') {
      return mode === 'WORK' ? 'text-emerald-400' : 'text-sky-400';
    }
    return 'text-white/60';
  });

  setMode(mode: SessionType): void {
    this.timerService.setMode(mode);
  }

  togglePlayPause(): void {
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
