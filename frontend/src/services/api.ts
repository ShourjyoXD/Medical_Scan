import type { AnalysisResult, HealthResponse, ModelsResponse, Modality } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined ?? '';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function url(path: string): string {
  return `${BASE_URL}${path}`;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Server error: ${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.error) message = String(body.error);
      else if (body?.detail) message = String(body.detail);
      else if (body?.message) message = String(body.message);
    } catch {
      // keep default message
    }
    const err = new Error(message) as Error & { status: number };
    err.status = res.status;
    throw err;
  }

  try {
    return (await res.json()) as T;
  } catch {
    throw new Error('Unexpected response format from server.');
  }
}

// ─── Health ──────────────────────────────────────────────────────────────────

export async function healthCheck(): Promise<HealthResponse> {
  const res = await fetch(url('/health'));
  return handleResponse<HealthResponse>(res);
}

// ─── Models ──────────────────────────────────────────────────────────────────

export async function getModels(): Promise<ModelsResponse> {
  const res = await fetch(url('/api/v1/models'));
  return handleResponse<ModelsResponse>(res);
}

// ─── Analyse ─────────────────────────────────────────────────────────────────

export async function analyzeImage(
  modality: Modality,
  file: File,
): Promise<AnalysisResult> {
  const form = new FormData();
  form.append('modality', modality);
  form.append('file', file);

  let res: Response;
  try {
    res = await fetch(url('/api/v1/analyze'), {
      method: 'POST',
      body: form,
    });
  } catch (err) {
    // Network / CORS failures
    throw new Error(
      'Unable to reach the server. Please check that the backend is running and try again.',
    );
  }

  const result = await handleResponse<AnalysisResult>(res);

  // Basic shape validation
  if (!result.predicted_class || !result.scores || !result.modality) {
    throw new Error('Unexpected response format from server.');
  }

  return result;
}
