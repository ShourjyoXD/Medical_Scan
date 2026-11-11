// ─── Modality ────────────────────────────────────────────────────────────────

export type Modality = 'xray' | 'mri';

export const MODALITY_LABELS: Record<Modality, string> = {
  xray: 'Chest X-ray',
  mri: 'Brain MRI',
};

// ─── API Request ─────────────────────────────────────────────────────────────

export interface AnalysisRequest {
  modality: Modality;
  file: File;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ExplanationInfo {
  available: boolean;
  type?: string;
  /** URL to the Grad-CAM heatmap image, if the backend provides one */
  heatmap_url?: string;
}

export interface AnalysisResult {
  modality: Modality;
  predicted_class: string;
  scores: Record<string, number>;
  model_name?: string;
  explanation?: ExplanationInfo;
  /** Internal flag set by the frontend when mock mode is active */
  _isMock?: boolean;
}

// ─── Health & Models ──────────────────────────────────────────────────────────

export interface HealthResponse {
  status: 'ok' | string;
  version?: string;
}

export interface ModelInfo {
  id: string;
  modality: Modality;
  name: string;
  classes: string[];
  supports_gradcam: boolean;
}

export interface ModelsResponse {
  models: ModelInfo[];
}

// ─── Error ───────────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export type AnalysisStatus =
  | 'idle'
  | 'validating'
  | 'uploading'
  | 'analysing'
  | 'success'
  | 'error';

export interface UploadState {
  file: File | null;
  previewUrl: string | null;
  validationError: string | null;
}

export interface AnalysisState {
  status: AnalysisStatus;
  result: AnalysisResult | null;
  error: string | null;
}
