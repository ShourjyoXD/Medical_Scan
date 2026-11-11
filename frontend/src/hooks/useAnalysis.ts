import { useState, useCallback, useRef } from 'react';
import { analyzeImage } from '../services';
import type { Modality, AnalysisResult, AnalysisStatus } from '../types';

export interface UseAnalysisReturn {
  status: AnalysisStatus;
  result: AnalysisResult | null;
  error: string | null;
  analyse: (modality: Modality, file: File) => Promise<AnalysisResult | null>;
  reset: () => void;
}

/**
 * Encapsulates the full analysis state machine:
 *   idle → analysing → success | error
 *
 * Prevents duplicate submissions via an in-flight ref guard.
 */
export function useAnalysis(): UseAnalysisReturn {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const analyse = useCallback(
    async (modality: Modality, file: File): Promise<AnalysisResult | null> => {
      if (inFlight.current) return null; // prevent duplicate submissions
      inFlight.current = true;

      setStatus('analysing');
      setError(null);
      setResult(null);

      try {
        const data = await analyzeImage(modality, file);
        setResult(data);
        setStatus('success');
        return data;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred. Please try again.';
        setError(message);
        setStatus('error');
        return null;
      } finally {
        inFlight.current = false;
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
    inFlight.current = false;
  }, []);

  return { status, result, error, analyse, reset };
}
