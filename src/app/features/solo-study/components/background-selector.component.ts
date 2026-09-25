import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackgroundService } from '../../../core/services/background.service';
import {
  BackgroundCategory,
  BackgroundItem,
  BackgroundType,
} from '../../../core/models/background.model';
import {
  LucideX,
  LucidePlus,
  LucideTrash2,
  LucideVolume2,
  LucideVolumeX,
  LucideVideo,
  LucideImage,
  LucideSparkles,
  LucideSunMedium,
  LucideCheck,
} from '@lucide/angular';

@Component({
  selector: 'app-background-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideX,
    LucidePlus,
    LucideTrash2,
    LucideVolume2,
    LucideVolumeX,
    LucideVideo,
    LucideImage,
    LucideSparkles,
    LucideSunMedium,
    LucideCheck,
  ],
  templateUrl: './background-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundSelectorComponent {
  readonly backgroundService = inject(BackgroundService);

  readonly close = output<void>();

  readonly activeCategory = signal<BackgroundCategory>('all');

  // Formulario para fondos personalizados
  readonly customUrl = signal<string>('');
  readonly customName = signal<string>('');
  readonly customType = signal<BackgroundType>('youtube');
  readonly errorMessage = signal<string | null>(null);

  readonly categories = [
    { id: 'all' as BackgroundCategory, label: 'Todos' },
    { id: 'youtube' as BackgroundCategory, label: 'YouTube' },
    { id: 'gif' as BackgroundCategory, label: 'Gifs' },
    { id: 'image' as BackgroundCategory, label: 'Images' },
    { id: 'color' as BackgroundCategory, label: 'OLED' },
    { id: 'custom' as BackgroundCategory, label: '+ Añadir' },
  ];

  readonly filteredBackgrounds = computed<BackgroundItem[]>(() => {
    const cat = this.activeCategory();
    const all = this.backgroundService.allBackgrounds();

    if (cat === 'all') return all;
    if (cat === 'custom') return this.backgroundService.customBackgrounds();
    return all.filter((b) => b.type === cat);
  });

  selectBackground(item: BackgroundItem): void {
    this.backgroundService.selectBackground(item.id);
  }

  onDarknessChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.backgroundService.setDarknessOpacity(Number(input.value));
  }

  onVolumeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.backgroundService.setAudioVolume(Number(input.value));
  }

  handleAddCustom(): void {
    this.errorMessage.set(null);
    const result = this.backgroundService.addCustomBackground(
      this.customName(),
      this.customUrl(),
      this.customType()
    );

    if (result.success) {
      this.customUrl.set('');
      this.customName.set('');
    } else {
      this.errorMessage.set(result.error || 'URL inválida');
    }
  }

  handleRemoveCustom(id: string, event: Event): void {
    event.stopPropagation();
    this.backgroundService.removeCustomBackground(id);
  }
}
