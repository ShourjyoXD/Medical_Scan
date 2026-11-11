/**
 * Mock API service – for development use only.
 *
 * This module simulates backend responses so the frontend can be developed
 * and tested without a running backend server.
 *
 * IMPORTANT:
 * - All results are FABRICATED and have no medical meaning.
 * - Grad-CAM heatmaps are NEVER generated here (explanation.available = false).
 * - The _isMock flag is set so the UI can display a clear mock warning.
 */

import type { AnalysisResult, HealthResponse, ModelsResponse, Modality } from '../types';

const MOCK_DELAY_MS = 1800; // simulate network + inference latency

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/** Build a normalised score map from a winning class + its confidence */
function buildScores(
  classes: string[],
  winnerIndex: number,
  winnerScore: number,
): Record<string, number> {
  const remaining = 1 - winnerScore;
  const otherCount = classes.length - 1;
  const scores: Record<string, number> = {};

  classes.forEach((cls, i) => {
    if (i === winnerIndex) {
      scores[cls] = parseFloat(winnerScore.toFixed(4));
    } else {
      // distribute remaining probability roughly evenly
      scores[cls] = parseFloat((remaining / otherCount).toFixed(4));
    }
  });

  return scores;
}

// ─── Health ──────────────────────────────────────────────────────────────────

export async function healthCheck(): Promise<HealthResponse> {
  await delay(200);
  console.info('[MOCK] healthCheck → ok');
  return { status: 'ok', version: 'mock-1.0.0' };
}

// ─── Models ──────────────────────────────────────────────────────────────────

export async function getModels(): Promise<ModelsResponse> {
  await delay(300);
  console.info('[MOCK] getModels');
  return {
    models: [
      {
        id: 'mock-xray',
        modality: 'xray',
        name: 'Mock X-ray Model',
        classes: ['NORMAL', 'PNEUMONIA'],
        supports_gradcam: false,
      },
      {
        id: 'mock-mri',
        modality: 'mri',
        name: 'Mock MRI Model',
        classes: ['NO_TUMOR', 'GLIOMA', 'MENINGIOMA', 'PITUITARY'],
        supports_gradcam: false,
      },
    ],
  };
}

// ─── Analyse ─────────────────────────────────────────────────────────────────

const XRAY_CLASSES = ['NORMAL', 'PNEUMONIA'];
const MRI_CLASSES = ['NO_TUMOR', 'GLIOMA', 'MENINGIOMA', 'PITUITARY'];

export async function analyzeImage(
  modality: Modality,
  file: File,
): Promise<AnalysisResult> {
  await delay(MOCK_DELAY_MS);

  const classes = modality === 'xray' ? XRAY_CLASSES : MRI_CLASSES;
  const winnerIndex = Math.floor(Math.random() * classes.length);
  const winnerScore = parseFloat(randomBetween(0.6, 0.97).toFixed(4));
  const scores = buildScores(classes, winnerIndex, winnerScore);

  const result: AnalysisResult = {
    modality,
    predicted_class: classes[winnerIndex],
    scores,
    model_name: modality === 'xray' ? 'mock-resnet18-xray' : 'mock-cnn-mri',
    explanation: {
      // Never return a fake Grad-CAM – the UI must not show fabricated heatmaps
      available: false,
    },
    _isMock: true,
  };

  console.info(`[MOCK] analyzeImage (${modality}) → `, result);
  console.warn(
    '[MOCK] These results are FABRICATED for development purposes only.',
    'They are NOT medical predictions. File analysed:', file.name,
  );

  return result;
}
