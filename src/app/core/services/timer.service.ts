import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { SessionType } from '../models';
import { ApiService } from './api.service';

export type TimerStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED';

const STORAGE_KEY = 'vaster_focus_timer_state';

interface StoredTimerState {
  mode: SessionType;
  status: TimerStatus;
  targetSeconds: number;
  remainingSeconds: number;
  targetEndTime: number | null;
  startedAt: string | null;
  activeGoalIds: string[];
  focusMinutes?: number;
  breakMinutes?: number;
  autoLoop?: boolean;
  soundChimeEnabled?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private readonly apiService = inject(ApiService);

  readonly mode = signal<SessionType>('WORK');
  readonly status = signal<TimerStatus>('IDLE');
  readonly focusMinutes = signal<number>(50);
  readonly breakMinutes = signal<number>(10);
  readonly autoLoop = signal<boolean>(true);
  readonly soundChimeEnabled = signal<boolean>(true);
  readonly targetSeconds = signal<number>(3000); // 50 min default
  readonly remainingSeconds = signal<number>(3000);
  readonly activeGoalIds = signal<string[]>([]);

  private targetEndTime: number | null = null;
  private sessionStartedAt: Date | null = null;
  private timerInterval: any = null;

  readonly formattedTime = computed(() => {
    const total = this.remainingSeconds();
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  });

  readonly formattedFocusTime = computed(() => {
    const total = this.focusMinutes() * 60;
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  });

  readonly formattedBreakTime = computed(() => {
    const total = this.breakMinutes() * 60;
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  });

  readonly progress = computed(() => {
    const target = this.targetSeconds();
    if (target === 0) return 0;
    const elapsed = target - this.remainingSeconds();
    return Math.min(100, Math.max(0, (elapsed / target) * 100));
  });

  constructor() {
    this.restoreState();

    // Re-check time on tab visibility change to guarantee zero drift
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && this.status() === 'RUNNING' && this.targetEndTime) {
          this.recalculateRemaining();
        }
      });
    }
  }

  adjustFocusMinutes(delta: number): void {
    const updated = Math.max(5, Math.min(180, this.focusMinutes() + delta));
    this.focusMinutes.set(updated);
    if (this.mode() === 'WORK' && this.status() === 'IDLE') {
      this.targetSeconds.set(updated * 60);
      this.remainingSeconds.set(updated * 60);
    }
    this.saveState();
  }

  adjustBreakMinutes(delta: number): void {
    const updated = Math.max(1, Math.min(60, this.breakMinutes() + delta));
    this.breakMinutes.set(updated);
    if (this.mode() !== 'WORK' && this.status() === 'IDLE') {
      this.targetSeconds.set(updated * 60);
      this.remainingSeconds.set(updated * 60);
    }
    this.saveState();
  }

  toggleAutoLoop(): void {
    this.autoLoop.update((v) => !v);
    this.saveState();
  }

  toggleSoundChime(): void {
    this.soundChimeEnabled.update((v) => !v);
    this.saveState();
  }

  setMode(newMode: SessionType) {
    this.pause();
    this.mode.set(newMode);
    let defaultSeconds = this.focusMinutes() * 60;
    if (newMode === 'SHORT_BREAK') defaultSeconds = this.breakMinutes() * 60;
    if (newMode === 'LONG_BREAK') defaultSeconds = Math.min(30, this.breakMinutes() * 2) * 60;

    this.targetSeconds.set(defaultSeconds);
    this.remainingSeconds.set(defaultSeconds);
    this.status.set('IDLE');
    this.targetEndTime = null;
    this.sessionStartedAt = null;
    this.saveState();
  }

  start() {
    if (this.status() === 'RUNNING') return;

    if (!this.sessionStartedAt) {
      this.sessionStartedAt = new Date();
    }

    this.targetEndTime = Date.now() + this.remainingSeconds() * 1000;
    this.status.set('RUNNING');

    this.clearInterval();
    this.timerInterval = setInterval(() => {
      this.tick();
    }, 250);

    this.saveState();
  }

  pause() {
    if (this.status() !== 'RUNNING') return;

    this.recalculateRemaining();
    this.status.set('PAUSED');
    this.clearInterval();
    this.targetEndTime = null;
    this.saveState();
  }

  reset() {
    this.pause();
    this.remainingSeconds.set(this.targetSeconds());
    this.status.set('IDLE');
    this.sessionStartedAt = null;
    this.targetEndTime = null;
    this.saveState();
  }

  toggleGoal(goalId: string) {
    const current = this.activeGoalIds();
    if (current.includes(goalId)) {
      this.activeGoalIds.set(current.filter((id) => id !== goalId));
    } else {
      this.activeGoalIds.set([...current, goalId]);
    }
    this.saveState();
  }

  private tick() {
    if (!this.targetEndTime) return;

    const diff = this.targetEndTime - Date.now();
    const remaining = Math.max(0, Math.ceil(diff / 1000));
    this.remainingSeconds.set(remaining);

    if (remaining <= 0) {
      this.onCompleted();
    }
  }

  private recalculateRemaining() {
    if (!this.targetEndTime) return;
    const diff = this.targetEndTime - Date.now();
    const remaining = Math.max(0, Math.ceil(diff / 1000));
    this.remainingSeconds.set(remaining);
  }

  private onCompleted() {
    this.clearInterval();
    this.status.set('COMPLETED');
    if (this.soundChimeEnabled()) {
      this.playChimeSound();
    }

    const endedAt = new Date();
    const startedAt = this.sessionStartedAt || new Date(endedAt.getTime() - this.targetSeconds() * 1000);
    const durationSeconds = this.targetSeconds();
    const currentMode = this.mode();
    const goalIds = this.activeGoalIds();

    // Persist completed session to backend
    this.apiService
      .createSession({
        type: currentMode,
        status: 'COMPLETED',
        targetSeconds: durationSeconds,
        durationSeconds: durationSeconds,
        startedAt: startedAt.toISOString(),
        endedAt: endedAt.toISOString(),
        goalIds: currentMode === 'WORK' ? goalIds : [],
      })
      .subscribe({
        next: (savedSession) => {
          console.log('[TimerService] Sesión guardada exitosamente:', savedSession.id);
        },
        error: (err) => {
          console.error('[TimerService] Error guardando sesión:', err);
        },
      });

    // Automatically prepare next break or work block
    setTimeout(() => {
      if (currentMode === 'WORK') {
        this.setMode('SHORT_BREAK');
      } else {
        this.setMode('WORK');
      }
      if (this.autoLoop()) {
        this.start();
      }
    }, 1500);
  }

  private playChimeSound() {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // Audio autoplay may be constrained until user interacts
    }
  }

  private clearInterval() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private saveState() {
    if (typeof localStorage === 'undefined') return;
    const state: StoredTimerState = {
      mode: this.mode(),
      status: this.status(),
      targetSeconds: this.targetSeconds(),
      remainingSeconds: this.remainingSeconds(),
      targetEndTime: this.targetEndTime,
      startedAt: this.sessionStartedAt ? this.sessionStartedAt.toISOString() : null,
      activeGoalIds: this.activeGoalIds(),
      focusMinutes: this.focusMinutes(),
      breakMinutes: this.breakMinutes(),
      autoLoop: this.autoLoop(),
      soundChimeEnabled: this.soundChimeEnabled(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  private restoreState() {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const state: StoredTimerState = JSON.parse(raw);

      this.mode.set(state.mode || 'WORK');
      this.targetSeconds.set(state.targetSeconds || 3000);
      this.activeGoalIds.set(state.activeGoalIds || []);
      if (state.focusMinutes) this.focusMinutes.set(state.focusMinutes);
      if (state.breakMinutes) this.breakMinutes.set(state.breakMinutes);
      if (state.autoLoop !== undefined) this.autoLoop.set(state.autoLoop);
      if (state.soundChimeEnabled !== undefined) this.soundChimeEnabled.set(state.soundChimeEnabled);

      if (state.startedAt) {
        this.sessionStartedAt = new Date(state.startedAt);
      }

      if (state.status === 'RUNNING' && state.targetEndTime) {
        const remaining = Math.max(0, Math.ceil((state.targetEndTime - Date.now()) / 1000));
        if (remaining > 0) {
          this.remainingSeconds.set(remaining);
          this.targetEndTime = state.targetEndTime;
          this.start();
        } else {
          this.remainingSeconds.set(0);
          this.status.set('COMPLETED');
        }
      } else {
        this.remainingSeconds.set(state.remainingSeconds || 3000);
        this.status.set(state.status === 'PAUSED' ? 'PAUSED' : 'IDLE');
      }
    } catch (e) {
      console.warn('[TimerService] No se pudo restaurar estado de localStorage:', e);
    }
  }
}
