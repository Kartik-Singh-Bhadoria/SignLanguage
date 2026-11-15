/**
 * SignConnect AI - API Client
 * Connects frontend directly to FastAPI backend services.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface LandmarkPoint {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface HandData {
  handedness: "Right" | "Left";
  landmarks: LandmarkPoint[];
}

export interface TopPrediction {
  sign_key: string;
  english_label: string;
  hindi_label: string;
  confidence: number;
  category: string;
}

export interface PostureFeedback {
  dominant_hand: string;
  palm_orientation: string;
  extended_fingers: string[];
  curled_fingers: string[];
  guidance?: string;
}

export interface RecognitionResult {
  is_detected: boolean;
  predicted_sign: string | null;
  english_label: string | null;
  hindi_label: string | null;
  confidence: number;
  top_predictions: TopPrediction[];
  posture_feedback: PostureFeedback | null;
  inference_time_ms: number;
}

export interface ISLSignItem {
  id: number;
  sign_key: string;
  english_label: string;
  hindi_label: string;
  category: string;
  description: string;
  hand_type: string;
  dominant_hand: string;
  difficulty_level: string;
  video_url?: string;
  animation_code?: string;
  tags: string;
  landmark_template?: any;
}

export interface SignSequenceItem {
  token: string;
  sign_key: string;
  english_label: string;
  hindi_label: string;
  category: string;
  is_fingerspelled: boolean;
  duration_seconds: number;
  description?: string;
  hand_type: string;
}

export interface TextToSignResult {
  original_text: string;
  source_language: string;
  isl_gloss_sequence: string[];
  sequence: SignSequenceItem[];
  total_duration_seconds: number;
  grammar_notes: string;
}

export interface PracticeEvaluationResult {
  sign_id: number;
  sign_key: string;
  english_label: string;
  hindi_label: string;
  accuracy_score: number;
  is_passed: boolean;
  status: string;
  posture_tips: string[];
  finger_evaluation: Record<string, string>;
}

export interface VideoRoomResult {
  id: number;
  room_code: string;
  title: string;
  host_user_id?: number;
  is_active: boolean;
  max_participants: number;
  isl_captioning_enabled: boolean;
  created_at: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("signconnect_token") : null;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(errorBody.detail || `HTTP Error ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Signs
  getSigns: (category?: string, search?: string, skip = 0, limit = 60) => {
    const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
    if (category && category !== "all") params.append("category", category);
    if (search) params.append("search", search);
    return request<{ total: number; items: ISLSignItem[] }>(`/signs?${params.toString()}`);
  },

  getSignDetail: (signKey: string) => request<ISLSignItem>(`/signs/${signKey}`),
  getCategories: () => request<{ category: string; count: number }[]>("/signs/categories"),

  // Recognition
  predictLandmarks: (hands: HandData[]) =>
    request<RecognitionResult>("/recognition/predict", {
      method: "POST",
      body: JSON.stringify({ hands }),
    }),

  // Translation
  textToSign: (text: string, sourceLang = "en", simplifyGrammar = true) =>
    request<TextToSignResult>("/translation/text-to-sign", {
      method: "POST",
      body: JSON.stringify({ text, source_language: sourceLang, simplify_grammar: simplifyGrammar }),
    }),

  signToText: (signKeys: string[], targetLang = "en") =>
    request<{ generated_text: string; target_language: string; detected_signs: string[]; confidence_average: number }>(
      "/translation/sign-to-text",
      {
        method: "POST",
        body: JSON.stringify({ sign_keys: signKeys, target_language: targetLang }),
      }
    ),

  getTranslationHistory: () => request<any[]>("/translation/history"),

  // Practice & Learning
  evaluatePractice: (signId: number, hands: HandData[]) =>
    request<PracticeEvaluationResult>("/practice/evaluate", {
      method: "POST",
      body: JSON.stringify({ sign_id: signId, frame: { hands } }),
    }),

  getPracticeHistory: () => request<any[]>("/practice/history"),

  // Video Rooms & WebRTC
  createRoom: (title: string, maxParticipants = 10, islCaptions = true) =>
    request<VideoRoomResult>("/video/rooms", {
      method: "POST",
      body: JSON.stringify({
        title,
        max_participants: maxParticipants,
        isl_captioning_enabled: islCaptions,
      }),
    }),

  getRoom: (roomCode: string) => request<VideoRoomResult>(`/video/rooms/${roomCode}`),
  getIceServers: () => request<{ ice_servers: any[] }>("/video/ice-servers"),

  // Auth
  login: (email: string, password: string) =>
    request<{ access_token: string; user_id: number; email: string; full_name: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, fullName: string, language = "en") =>
    request<{ access_token: string; user_id: number; email: string; full_name: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, full_name: fullName, preferred_language: language }),
    }),

  getProfile: () => request<any>("/auth/me"),
  updateAccessibility: (settings: any) =>
    request<any>("/auth/me/accessibility", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),
};
