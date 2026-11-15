import { create } from "zustand";

export interface AccessibilityState {
  highContrast: boolean;
  fontScale: number; // 0.8 - 2.0
  signPlaybackSpeed: number; // 0.5 - 2.0
  captionSize: "small" | "medium" | "large" | "extra_large";
  reduceMotion: boolean;
  colorBlindMode: "none" | "protanopia" | "deuteranopia" | "tritanopia";
  ttsVoiceEnabled: boolean;
  screenReaderHints: boolean;

  setHighContrast: (enabled: boolean) => void;
  setFontScale: (scale: number) => void;
  setSignPlaybackSpeed: (speed: number) => void;
  setCaptionSize: (size: "small" | "medium" | "large" | "extra_large") => void;
  setReduceMotion: (enabled: boolean) => void;
  setColorBlindMode: (mode: "none" | "protanopia" | "deuteranopia" | "tritanopia") => void;
  setTtsVoiceEnabled: (enabled: boolean) => void;
  speakText: (text: string, lang?: string) => void;
  resetDefaults: () => void;
}

export const useAccessibilityStore = create<AccessibilityState>((set, get) => ({
  highContrast: false,
  fontScale: 1.0,
  signPlaybackSpeed: 1.0,
  captionSize: "medium",
  reduceMotion: false,
  colorBlindMode: "none",
  ttsVoiceEnabled: true,
  screenReaderHints: true,

  setHighContrast: (highContrast) => set({ highContrast }),
  setFontScale: (fontScale) => set({ fontScale }),
  setSignPlaybackSpeed: (signPlaybackSpeed) => set({ signPlaybackSpeed }),
  setCaptionSize: (captionSize) => set({ captionSize }),
  setReduceMotion: (reduceMotion) => set({ reduceMotion }),
  setColorBlindMode: (colorBlindMode) => set({ colorBlindMode }),
  setTtsVoiceEnabled: (ttsVoiceEnabled) => set({ ttsVoiceEnabled }),

  speakText: (text: string, lang = "en-IN") => {
    if (typeof window === "undefined" || !get().ttsVoiceEnabled) return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = get().signPlaybackSpeed;
      window.speechSynthesis.speak(utterance);
    }
  },

  resetDefaults: () =>
    set({
      highContrast: false,
      fontScale: 1.0,
      signPlaybackSpeed: 1.0,
      captionSize: "medium",
      reduceMotion: false,
      colorBlindMode: "none",
      ttsVoiceEnabled: true,
      screenReaderHints: true,
    }),
}));

