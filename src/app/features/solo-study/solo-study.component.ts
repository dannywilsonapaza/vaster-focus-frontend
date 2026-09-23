import { Component, ChangeDetectionStrategy, viewChild, signal, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BackgroundLayerComponent } from './components/background-layer.component';
import { TimerWidgetComponent } from './components/timer-widget.component';
import { AudioMixerWidgetComponent } from './components/audio-mixer-widget.component';
import { GoalsWidgetComponent } from './components/goals-widget.component';
import { TimerService } from '../../core/services/timer.service';
import {
  LucideBarChart3,
  LucideClock,
  LucideTarget,
  LucideMusic,
  LucideQuote,
  LucideMaximize,
  LucideMinimize,
  LucideImage,
  LucideRefreshCw,
} from '@lucide/angular';

export interface Quote {
  text: string;
  author: string;
}

export const SPANISH_QUOTES: Quote[] = [
  {
    text: 'Si la gente supiera lo duro que he trabajado para obtener mi maestría, no parecería tan maravillosa en absoluto.',
    author: 'Mono',
  },
  {
    text: 'No es que sea muy inteligente, es solo que me quedo con los problemas durante más tiempo.',
    author: 'Albert Einstein',
  },
  {
    text: 'Somos lo que hacemos día a día. De modo que la excelencia no es un acto, sino un hábito.',
    author: 'Aristóteles',
  },
  {
    text: 'La concentración es la clave secreta de toda la fuerza en cualquier ámbito de la vida.',
    author: 'Ralph Waldo Emerson',
  },
  {
    text: 'Un pequeño paso constante cada día construye resultados extraordinarios.',
    author: 'Séneca',
  },
  {
    text: 'Tu futuro está creado por lo que haces hoy, no por lo que harás mañana.',
    author: 'Robert Kiyosaki',
  },
];

@Component({
  selector: 'app-solo-study',
  standalone: true,
  imports: [
    RouterLink,
    BackgroundLayerComponent,
    TimerWidgetComponent,
    AudioMixerWidgetComponent,
    GoalsWidgetComponent,
    LucideBarChart3,
    LucideClock,
    LucideTarget,
    LucideMusic,
    LucideQuote,
    LucideMaximize,
    LucideMinimize,
    LucideImage,
    LucideRefreshCw,
  ],
  templateUrl: './solo-study.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoloStudyComponent {
  readonly timerService = inject(TimerService);
  readonly bgLayer = viewChild.required<BackgroundLayerComponent>('bgLayer');
  readonly goalsWidget = viewChild<GoalsWidgetComponent>(GoalsWidgetComponent);

  readonly showTimer = signal<boolean>(true);
  readonly showGoals = signal<boolean>(true);
  readonly showAudioMixer = signal<boolean>(false);
  readonly showQuote = signal<boolean>(true);
  readonly showBgMenu = signal<boolean>(false);
  readonly isFullscreen = signal<boolean>(false);

  readonly quotes = SPANISH_QUOTES;
  readonly currentQuoteIndex = signal<number>(0);
  readonly currentQuote = computed(() => this.quotes[this.currentQuoteIndex()]);

  readonly goalsProgressText = computed(() => {
    const widget = this.goalsWidget();
    if (!widget) return '0/0';
    return `${widget.completedCount()}/${widget.goals().length}`;
  });

  toggleTimer(): void {
    this.showTimer.update((v) => !v);
  }

  toggleGoals(): void {
    this.showGoals.update((v) => !v);
  }

  toggleAudioMixer(): void {
    this.showAudioMixer.update((v) => !v);
  }

  toggleQuote(): void {
    this.showQuote.update((v) => !v);
  }

  nextQuote(): void {
    this.currentQuoteIndex.update((i) => (i + 1) % this.quotes.length);
  }

  toggleBgMenu(): void {
    this.showBgMenu.update((v) => !v);
  }

  toggleFullscreen(): void {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      this.isFullscreen.set(true);
    } else {
      document.exitFullscreen().catch(() => {});
      this.isFullscreen.set(false);
    }
  }
}
