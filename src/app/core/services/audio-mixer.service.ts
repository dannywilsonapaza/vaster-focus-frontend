import { Injectable, signal } from '@angular/core';

export interface SoundTrack {
  id: 'rain' | 'lofi' | 'fire' | 'library';
  name: string;
  icon: string;
  isPlaying: boolean;
  volume: number; // 0 to 100
}

@Injectable({
  providedIn: 'root',
})
export class AudioMixerService {
  readonly isMuted = signal<boolean>(false);
  readonly masterVolume = signal<number>(80);

  readonly tracks = signal<SoundTrack[]>([
    { id: 'rain', name: 'Lluvia', icon: 'cloud-rain', isPlaying: false, volume: 50 },
    { id: 'lofi', name: 'Lofi Chords', icon: 'music', isPlaying: false, volume: 50 },
    { id: 'fire', name: 'Chimenea', icon: 'flame', isPlaying: false, volume: 40 },
    { id: 'library', name: 'Biblioteca', icon: 'book-open', isPlaying: false, volume: 30 },
  ]);

  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private channelGains: Map<string, GainNode> = new Map();
  private activeGenerators: Map<string, { stop: () => void }> = new Map();

  private ensureAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtx();

      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted() ? 0 : this.masterVolume() / 100, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleTrack(id: 'rain' | 'lofi' | 'fire' | 'library') {
    this.ensureAudioContext();

    this.tracks.update((current) =>
      current.map((track) => {
        if (track.id === id) {
          const nextState = !track.isPlaying;
          if (nextState) {
            this.startTrackSound(id, track.volume / 100);
          } else {
            this.stopTrackSound(id);
          }
          return { ...track, isPlaying: nextState };
        }
        return track;
      })
    );
  }

  setTrackVolume(id: 'rain' | 'lofi' | 'fire' | 'library', volume: number) {
    this.ensureAudioContext();

    this.tracks.update((current) =>
      current.map((track) => (track.id === id ? { ...track, volume } : track))
    );

    const gainNode = this.channelGains.get(id);
    if (gainNode && this.audioCtx) {
      gainNode.gain.setValueAtTime(volume / 100, this.audioCtx.currentTime);
    }
  }

  toggleMasterMute() {
    this.ensureAudioContext();
    const nextMuted = !this.isMuted();
    this.isMuted.set(nextMuted);

    if (this.masterGain && this.audioCtx) {
      const target = nextMuted ? 0 : this.masterVolume() / 100;
      this.masterGain.gain.setValueAtTime(target, this.audioCtx.currentTime);
    }
  }

  setMasterVolume(volume: number) {
    this.ensureAudioContext();
    this.masterVolume.set(volume);

    if (this.masterGain && this.audioCtx && !this.isMuted()) {
      this.masterGain.gain.setValueAtTime(volume / 100, this.audioCtx.currentTime);
    }
  }

  // --- Procedural Synthesis Generators ---

  private getOrCreateChannelGain(id: string): GainNode {
    let gain = this.channelGains.get(id);
    if (!gain && this.audioCtx && this.masterGain) {
      gain = this.audioCtx.createGain();
      gain.connect(this.masterGain);
      this.channelGains.set(id, gain);
    }
    return gain!;
  }

  private startTrackSound(id: string, initialGain: number) {
    if (!this.audioCtx) return;
    this.stopTrackSound(id);

    const gain = this.getOrCreateChannelGain(id);
    gain.gain.setValueAtTime(initialGain, this.audioCtx.currentTime);

    if (id === 'rain') {
      this.startRain(gain);
    } else if (id === 'lofi') {
      this.startLofi(gain);
    } else if (id === 'fire') {
      this.startFire(gain);
    } else if (id === 'library') {
      this.startLibrary(gain);
    }
  }

  private stopTrackSound(id: string) {
    const generator = this.activeGenerators.get(id);
    if (generator) {
      generator.stop();
      this.activeGenerators.delete(id);
    }
  }

  // 1. Rain Generator (Pink noise + Lowpass filter)
  private startRain(destination: GainNode) {
    if (!this.audioCtx) return;
    const bufferSize = this.audioCtx.sampleRate * 2;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.audioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(destination);
    whiteNoise.start();

    this.activeGenerators.set('rain', {
      stop: () => {
        try {
          whiteNoise.stop();
          whiteNoise.disconnect();
        } catch {}
      },
    });
  }

  // 2. Lofi Generator (Gentle warm ambient chord drone)
  private startLofi(destination: GainNode) {
    if (!this.audioCtx) return;
    const frequencies = [130.81, 164.81, 196.00, 246.94]; // C3, E3, G3, B3 (Cmaj7)
    const oscillators: OscillatorNode[] = [];

    const lofiFilter = this.audioCtx.createBiquadFilter();
    lofiFilter.type = 'lowpass';
    lofiFilter.frequency.setValueAtTime(450, this.audioCtx.currentTime);
    lofiFilter.connect(destination);

    frequencies.forEach((freq) => {
      const osc = this.audioCtx!.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx!.currentTime);

      const oscGain = this.audioCtx!.createGain();
      oscGain.gain.setValueAtTime(0.08, this.audioCtx!.currentTime);

      osc.connect(oscGain);
      oscGain.connect(lofiFilter);
      osc.start();
      oscillators.push(osc);
    });

    this.activeGenerators.set('lofi', {
      stop: () => {
        oscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
      },
    });
  }

  // 3. Fire Generator (Low rumbling noise + periodic pops)
  private startFire(destination: GainNode) {
    if (!this.audioCtx) return;
    const bufferSize = this.audioCtx.sampleRate * 2;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 1.8;
    }

    const brownNoise = this.audioCtx.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, this.audioCtx.currentTime);
    filter.Q.setValueAtTime(1.5, this.audioCtx.currentTime);

    brownNoise.connect(filter);
    filter.connect(destination);
    brownNoise.start();

    this.activeGenerators.set('fire', {
      stop: () => {
        try {
          brownNoise.stop();
          brownNoise.disconnect();
        } catch {}
      },
    });
  }

  // 4. Library Generator (Subtle air room tone)
  private startLibrary(destination: GainNode) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, this.audioCtx.currentTime); // 55Hz subtle room hum

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, this.audioCtx.currentTime);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(destination);
    osc.start();

    this.activeGenerators.set('library', {
      stop: () => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {}
      },
    });
  }
}
