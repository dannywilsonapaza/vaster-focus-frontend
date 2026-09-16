import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BackgroundPreset {
  id: string;
  name: string;
  gradientClass: string;
  accentColor: string;
}

@Component({
  selector: 'app-background-layer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-colors duration-1000"
         [ngClass]="activePreset().gradientClass">
      <!-- Ambient Glow Orbs -->
      <div class="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[140px] opacity-25 animate-pulse"
           [style.background-color]="activePreset().accentColor"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[140px] opacity-20 animate-pulse"
           [style.background-color]="activePreset().accentColor"
           style="animation-delay: 2s;"></div>
      
      <!-- Subtle scanline / grid texture overlay -->
      <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div class="absolute inset-0 bg-black/40"></div>
    </div>
  `,
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

  setPreset(id: string) {
    const found = this.presets().find((p) => p.id === id);
    if (found) {
      this.activePreset.set(found);
    }
  }
}
