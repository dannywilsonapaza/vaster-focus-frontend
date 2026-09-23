import { Component, ChangeDetectionStrategy, inject, output, computed } from '@angular/core';
import { TimerService } from '../../../core/services/timer.service';
import {
  LucideClock,
  LucideVolume2,
  LucideVolumeX,
  LucideInfo,
  LucideX,
  LucideMinus,
  LucidePlus,
  LucideRotateCcw,
  LucidePlay,
  LucidePause,
  LucideCheckCircle2,
} from '@lucide/angular';

@Component({
  selector: 'app-timer-widget',
  standalone: true,
  imports: [
    LucideClock,
    LucideVolume2,
    LucideVolumeX,
    LucideInfo,
    LucideX,
    LucideMinus,
    LucidePlus,
    LucideRotateCcw,
    LucidePlay,
    LucidePause,
    LucideCheckCircle2,
  ],
  templateUrl: './timer-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerWidgetComponent {
  readonly timerService = inject(TimerService);
  readonly close = output<void>();

  readonly displayFocusTime = computed(() => {
    if (this.timerService.mode() === 'WORK' && this.timerService.status() === 'RUNNING') {
      return this.timerService.formattedTime();
    }
    return this.timerService.formattedFocusTime();
  });

  readonly displayBreakTime = computed(() => {
    if (this.timerService.mode() !== 'WORK' && this.timerService.status() === 'RUNNING') {
      return this.timerService.formattedTime();
    }
    return this.timerService.formattedBreakTime();
  });

  togglePlayPause(): void {
    if (this.timerService.status() === 'RUNNING') {
      this.timerService.pause();
    } else {
      this.timerService.start();
    }
  }
}
