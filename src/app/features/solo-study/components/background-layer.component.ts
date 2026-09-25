import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { BackgroundService } from '../../../core/services/background.service';

@Component({
  selector: 'app-background-layer',
  standalone: true,
  imports: [],
  templateUrl: './background-layer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundLayerComponent {
  readonly backgroundService = inject(BackgroundService);

  readonly activeBackground = this.backgroundService.activeBackground;
  readonly safeYouTubeUrl = this.backgroundService.safeYouTubeUrl;
  readonly darknessOpacity = this.backgroundService.darknessOpacity;

  // Compatibilidad hacia atrás
  readonly presets = this.backgroundService.presets;
  readonly activePreset = this.backgroundService.activeBackground;

  setPreset(id: string): void {
    this.backgroundService.selectBackground(id);
  }
}
