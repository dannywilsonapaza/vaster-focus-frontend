import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  BackgroundItem,
  BackgroundType,
  DEFAULT_BACKGROUND_PRESETS,
} from '../models/background.model';

const STORAGE_KEY = 'vaster_focus_background_state';

interface StoredBackgroundState {
  activeId: string;
  darknessOpacity: number;
  isAudioMuted: boolean;
  audioVolume: number;
  customBackgrounds: BackgroundItem[];
}

@Injectable({
  providedIn: 'root',
})
export class BackgroundService {
  private readonly sanitizer = inject(DomSanitizer);

  // Catálogo base de presets
  readonly presets = signal<BackgroundItem[]>(DEFAULT_BACKGROUND_PRESETS);

  // Fondos personalizados añadidos por el usuario
  readonly customBackgrounds = signal<BackgroundItem[]>([]);

  // Todos los fondos disponibles (combinados)
  readonly allBackgrounds = computed<BackgroundItem[]>(() => [
    ...this.presets(),
    ...this.customBackgrounds(),
  ]);

  // Fondo activo actual
  readonly activeBackground = signal<BackgroundItem>(this.presets()[0]);

  // Nivel de atenuación / oscurecimiento (0 a 50%)
  readonly darknessOpacity = signal<number>(0);

  // Estado de audio para videos de YouTube
  readonly isAudioMuted = signal<boolean>(true);
  readonly audioVolume = signal<number>(50);

  // URL segura para renderizar el iframe de YouTube
  readonly safeYouTubeUrl = computed<SafeResourceUrl | null>(() => {
    const bg = this.activeBackground();
    if (bg.type !== 'youtube' || !bg.youtubeId) {
      return null;
    }
    // Parámetros optimizados para loop infinito, sin controles y compatible con postMessage
    const rawUrl = `https://www.youtube-nocookie.com/embed/${bg.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${bg.youtubeId}&playsinline=1&rel=0&showinfo=0&modestbranding=1&enablejsapi=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  });

  constructor() {
    this.loadStateFromStorage();

    // Sincronización reactiva automática a localStorage
    effect(() => {
      if (typeof window === 'undefined') return;

      const state: StoredBackgroundState = {
        activeId: this.activeBackground().id,
        darknessOpacity: this.darknessOpacity(),
        isAudioMuted: this.isAudioMuted(),
        audioVolume: this.audioVolume(),
        customBackgrounds: this.customBackgrounds(),
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (err) {
        console.warn('No se pudo guardar el estado de fondos en localStorage:', err);
      }
    });
  }

  /**
   * Selecciona un fondo por su ID
   */
  selectBackground(id: string): void {
    const found = this.allBackgrounds().find((b) => b.id === id);
    if (found) {
      this.activeBackground.set(found);
    }
  }

  /**
   * Modifica el nivel de opacidad de la capa atenuadora (0 a 50%)
   */
  setDarknessOpacity(opacity: number): void {
    const clamped = Math.max(0, Math.min(50, Math.round(opacity)));
    this.darknessOpacity.set(clamped);
  }

  /**
   * Alterna el silenciador del video de YouTube de fondo
   */
  toggleAudioMute(): void {
    const nextMuted = !this.isAudioMuted();
    this.isAudioMuted.set(nextMuted);
    if (nextMuted) {
      this.sendYouTubeCommand('mute');
    } else {
      this.sendYouTubeCommand('unMute');
      this.sendYouTubeCommand('setVolume', [this.audioVolume()]);
    }
  }

  /**
   * Ajusta el volumen del video de YouTube (0 a 100)
   */
  setAudioVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(100, Math.round(volume)));
    this.audioVolume.set(clamped);
    if (!this.isAudioMuted()) {
      this.sendYouTubeCommand('setVolume', [clamped]);
    }
  }

  /**
   * Extrae el ID de un video de YouTube a partir de múltiples formatos de URL
   */
  extractYouTubeId(input: string): string | null {
    if (!input) return null;
    const trimmed = input.trim();

    // Si ya es un ID de 11 caracteres alfanuméricos
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }

    const regExp =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/;
    const match = trimmed.match(regExp);
    return match ? match[1] : null;
  }

  /**
   * Agrega un nuevo fondo personalizado (YouTube, Imagen o GIF)
   */
  addCustomBackground(
    name: string,
    url: string,
    type: BackgroundType
  ): { success: boolean; error?: string; item?: BackgroundItem } {
    const trimmedUrl = url.trim();
    const finalName = name.trim() || 'Fondo personalizado';

    if (!trimmedUrl) {
      return { success: false, error: 'La URL no puede estar vacía' };
    }

    if (type === 'youtube') {
      const ytId = this.extractYouTubeId(trimmedUrl);
      if (!ytId) {
        return {
          success: false,
          error: 'URL de YouTube no válida (ej. https://youtu.be/ID o https://youtube.com/watch?v=ID)',
        };
      }

      const newItem: BackgroundItem = {
        id: `custom-yt-${Date.now()}`,
        name: finalName,
        type: 'youtube',
        youtubeId: ytId,
        accentColor: '#f59e0b',
        thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
        isCustom: true,
      };

      this.customBackgrounds.update((list) => [newItem, ...list]);
      this.activeBackground.set(newItem);
      return { success: true, item: newItem };
    }

    // Imagen o GIF
    const newItem: BackgroundItem = {
      id: `custom-${type}-${Date.now()}`,
      name: finalName,
      type: type,
      sourceUrl: trimmedUrl,
      accentColor: '#38bdf8',
      thumbnailUrl: trimmedUrl,
      isCustom: true,
    };

    this.customBackgrounds.update((list) => [newItem, ...list]);
    this.activeBackground.set(newItem);
    return { success: true, item: newItem };
  }

  /**
   * Elimina un fondo personalizado de la lista
   */
  removeCustomBackground(id: string): void {
    this.customBackgrounds.update((list) => list.filter((b) => b.id !== id));
    if (this.activeBackground().id === id) {
      this.activeBackground.set(this.presets()[0]);
    }
  }

  /**
   * Envía comandos de reproducción a la ventana del iframe de YouTube mediante postMessage
   */
  private sendYouTubeCommand(func: string, args: any[] = []): void {
    if (typeof document === 'undefined') return;
    const iframe = document.getElementById('youtube-bg-player') as HTMLIFrameElement | null;
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func,
            args,
          }),
          '*'
        );
      } catch (err) {
        console.warn('Error al enviar comando a YouTube Iframe:', err);
      }
    }
  }

  /**
   * Restaura el estado guardado desde localStorage
   */
  private loadStateFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed: StoredBackgroundState = JSON.parse(raw);
      if (parsed.customBackgrounds && Array.isArray(parsed.customBackgrounds)) {
        this.customBackgrounds.set(parsed.customBackgrounds);
      }

      if (typeof parsed.darknessOpacity === 'number') {
        this.setDarknessOpacity(parsed.darknessOpacity);
      }

      if (typeof parsed.isAudioMuted === 'boolean') {
        this.isAudioMuted.set(parsed.isAudioMuted);
      }

      if (typeof parsed.audioVolume === 'number') {
        this.setAudioVolume(parsed.audioVolume);
      }

      if (parsed.activeId) {
        const found = [
          ...this.presets(),
          ...(parsed.customBackgrounds || []),
        ].find((b) => b.id === parsed.activeId);
        if (found) {
          this.activeBackground.set(found);
        }
      }
    } catch (err) {
      console.warn('Error al restaurar fondo de localStorage:', err);
    }
  }
}
