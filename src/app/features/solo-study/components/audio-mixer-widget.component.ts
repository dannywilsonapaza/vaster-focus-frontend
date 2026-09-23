import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { AudioMixerService, SoundTrack } from '../../../core/services/audio-mixer.service';
import {
  LucideVolume2,
  LucideVolumeX,
  LucideCloudRain,
  LucideMusic,
  LucideFlame,
  LucideBookOpen,
  LucideSliders,
  LucideX,
} from '@lucide/angular';

@Component({
  selector: 'app-audio-mixer-widget',
  standalone: true,
  imports: [
    LucideVolume2,
    LucideVolumeX,
    LucideCloudRain,
    LucideMusic,
    LucideFlame,
    LucideBookOpen,
    LucideSliders,
    LucideX,
  ],
  templateUrl: './audio-mixer-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioMixerWidgetComponent {
  readonly mixerService = inject(AudioMixerService);
  readonly close = output<void>();

  onMasterVolumeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.mixerService.setMasterVolume(Number(input.value));
  }

  onTrackVolumeChange(id: SoundTrack['id'], event: Event): void {
    const input = event.target as HTMLInputElement;
    this.mixerService.setTrackVolume(id, Number(input.value));
  }
}
