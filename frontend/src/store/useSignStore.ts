import { create } from "zustand";
import { PostureFeedback, TopPrediction } from "@/lib/api";

export interface SignState {
  currentSign: string | null;
  currentConfidence: number;
  englishLabel: string | null;
  hindiLabel: string | null;
  category: string | null;
  topPredictions: TopPrediction[];
  postureFeedback: PostureFeedback | null;
  sentenceBuffer: { sign_key: string; label: string }[];
  isStreaming: boolean;
  inferenceMs: number;

  setRecognitionResult: (result: {
    predicted_sign: string | null;
    confidence: number;
    english_label: string | null;
    hindi_label: string | null;
    category?: string | null;
    top_predictions?: TopPrediction[];
    posture_feedback?: PostureFeedback | null;
    inference_time_ms?: number;
  }) => void;

  addSignToSentence: (signKey: string, label: string) => void;
  removeLastSign: () => void;
  clearSentence: () => void;
  setStreaming: (isStreaming: boolean) => void;
}

export const useSignStore = create<SignState>((set, get) => ({
  currentSign: null,
  currentConfidence: 0,
  englishLabel: null,
  hindiLabel: null,
  category: null,
  topPredictions: [],
  postureFeedback: null,
  sentenceBuffer: [],
  isStreaming: false,
  inferenceMs: 0,

  setRecognitionResult: (result) => {
    set({
      currentSign: result.predicted_sign,
      currentConfidence: result.confidence,
      englishLabel: result.english_label,
      hindiLabel: result.hindi_label,
      category: result.category || null,
      topPredictions: result.top_predictions || [],
      postureFeedback: result.posture_feedback || null,
      inferenceMs: result.inference_time_ms || 0,
    });
  },

  addSignToSentence: (signKey, label) => {
    const current = get().sentenceBuffer;
    // Prevent immediate repeated duplicates if same sign held
    if (current.length > 0 && current[current.length - 1].sign_key === signKey) {
      return;
    }
    set({ sentenceBuffer: [...current, { sign_key: signKey, label }] });
  },

  removeLastSign: () => {
    const current = get().sentenceBuffer;
    if (current.length > 0) {
      set({ sentenceBuffer: current.slice(0, -1) });
    }
  },

  clearSentence: () => set({ sentenceBuffer: [] }),
  setStreaming: (isStreaming) => set({ isStreaming }),
}));

