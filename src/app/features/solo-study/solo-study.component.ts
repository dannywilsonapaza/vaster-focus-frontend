import { Component, ChangeDetectionStrategy, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BackgroundLayerComponent } from './components/background-layer.component';
import { TimerWidgetComponent } from './components/timer-widget.component';
import { AudioMixerWidgetComponent } from './components/audio-mixer-widget.component';
import { GoalsWidgetComponent } from './components/goals-widget.component';
import { LucideBarChart3, LucideClock } from '@lucide/angular';

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
  ],
  templateUrl: './solo-study.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoloStudyComponent {
  readonly bgLayer = viewChild.required<BackgroundLayerComponent>('bgLayer');
}
