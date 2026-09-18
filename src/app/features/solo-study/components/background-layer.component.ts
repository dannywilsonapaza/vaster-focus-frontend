import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

export interface BackgroundPreset {
  id: string;
  name: string;
  gradientClass: string;
  accentColor: string;
}

@Component({
  selector: 'app-background-layer',
  standalone: true,
  imports: [],
  templateUrl: './background-layer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundLayerComponent {
  readonly presets = signal<BackgroundPreset[]>([
    {
      id: 'oled-pure',
      name: 'OLED Pure Black',
      gradientClass: 'bg-[#030303]',
      accentColor: '#10b981',
    },
    {
      id: 'cozy-night',
      name: 'Noche Acogedora',
      gradientClass: 'bg-gradient-to-br from-[#090a0f] via-[#050508] to-[#0d0e14]',
      accentColor: '#3b82f6',
    },
    {
      id: 'lofi-sunset',
      name: 'Atardecer Lofi',
      gradientClass: 'bg-gradient-to-br from-[#120710] via-[#0a0508] to-[#080511]',
      accentColor: '#ec4899',
    },
    {
      id: 'emerald-focus',
      name: 'Enfoque Esmeralda',
      gradientClass: 'bg-gradient-to-br from-[#02150d] via-[#030806] to-[#04100c]',
      accentColor: '#059669',
    },
  ]);

  readonly activePreset = signal<BackgroundPreset>(this.presets()[0]);

  setPreset(id: string): void {
    const found = this.presets().find((p) => p.id === id);
    if (found) {
      this.activePreset.set(found);
    }
  }
}
