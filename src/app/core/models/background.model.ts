export type BackgroundType = 'color' | 'image' | 'gif' | 'youtube';

export type BackgroundCategory = 'all' | 'youtube' | 'gif' | 'image' | 'color' | 'custom';

export interface BackgroundItem {
  id: string;
  name: string;
  type: BackgroundType;
  accentColor: string;
  thumbnailUrl: string;
  // For 'color'
  gradientClass?: string;
  // For 'image' | 'gif'
  sourceUrl?: string;
  // For 'youtube'
  youtubeId?: string;
  // Custom user item flag
  isCustom?: boolean;
}

export interface BackgroundState {
  activeBackgroundId: string;
  darknessOpacity: number; // 0 to 50 %
  youtubeMuted: boolean;
  youtubeVolume: number; // 0 to 100
  customBackgrounds: BackgroundItem[];
}

export const DEFAULT_BACKGROUND_PRESETS: BackgroundItem[] = [
  // OLED / Colores Minimalistas
  {
    id: 'oled-pure',
    name: 'OLED Pure Black',
    type: 'color',
    gradientClass: 'bg-[#030303]',
    accentColor: '#10b981',
    thumbnailUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="70"><rect width="100" height="70" fill="%23050505"/><circle cx="50" cy="35" r="15" fill="%2310b981" opacity="0.3"/></svg>',
  },
  {
    id: 'cozy-night',
    name: 'Noche Acogedora',
    type: 'color',
    gradientClass: 'bg-gradient-to-br from-[#090a0f] via-[#050508] to-[#0d0e14]',
    accentColor: '#3b82f6',
    thumbnailUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="70"><rect width="100" height="70" fill="%23090a0f"/><circle cx="50" cy="35" r="15" fill="%233b82f6" opacity="0.3"/></svg>',
  },
  {
    id: 'lofi-sunset',
    name: 'Atardecer Lofi',
    type: 'color',
    gradientClass: 'bg-gradient-to-br from-[#120710] via-[#0a0508] to-[#080511]',
    accentColor: '#ec4899',
    thumbnailUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="70"><rect width="100" height="70" fill="%23120710"/><circle cx="50" cy="35" r="15" fill="%23ec4899" opacity="0.3"/></svg>',
  },
  {
    id: 'emerald-focus',
    name: 'Enfoque Esmeralda',
    type: 'color',
    gradientClass: 'bg-gradient-to-br from-[#02150d] via-[#030806] to-[#04100c]',
    accentColor: '#059669',
    thumbnailUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="70"><rect width="100" height="70" fill="%2302150d"/><circle cx="50" cy="35" r="15" fill="%23059669" opacity="0.3"/></svg>',
  },

  // YouTube Curados
  {
    id: 'yt-coffee-shop',
    name: 'Cafetería ASMR 4K',
    type: 'youtube',
    youtubeId: 'uU_RxnJOdMQ',
    accentColor: '#d97706',
    thumbnailUrl: 'https://img.youtube.com/vi/uU_RxnJOdMQ/hqdefault.jpg',
  },

  // Dinámicos / GIFs en Bucle
  {
    id: 'gif-lofi-room',
    name: 'Habitación Nocturna',
    type: 'gif',
    sourceUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1920&q=80',
    accentColor: '#818cf8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=300&q=60',
  },
  {
    id: 'gif-rain-window',
    name: 'Lluvia en la Ventana',
    type: 'gif',
    sourceUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1920&q=80',
    accentColor: '#38bdf8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=300&q=60',
  },

  // Imágenes Estáticas en Alta Definición
  {
    id: 'img-minimal-desk',
    name: 'Escritorio Minimalista',
    type: 'image',
    sourceUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
    accentColor: '#94a3b8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=60',
  },
  {
    id: 'img-night-library',
    name: 'Lectura a Medianoche',
    type: 'image',
    sourceUrl: 'https://images.unsplash.com/photo-1507842229451-7f01be7ff612?auto=format&fit=crop&w=1920&q=80',
    accentColor: '#60a5fa',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507842229451-7f01be7ff612?auto=format&fit=crop&w=300&q=60',
  },
  {
    id: 'img-tokyo-night',
    name: 'Luces de Ciudad',
    type: 'image',
    sourceUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    accentColor: '#a855f7',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=60',
  },
];
