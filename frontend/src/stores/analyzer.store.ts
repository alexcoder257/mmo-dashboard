import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { IAnalyzerUploadResponse } from '@/models/interfaces/analyzer.interface';

interface IState {
  error: null | string;
  file: File | null;
  isAnalyzing: boolean;
  reset: () => void;
  result: IAnalyzerUploadResponse | null;
  setError: (error: null | string) => void;
  setFile: (file: File | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setResult: (result: IAnalyzerUploadResponse | null) => void;
}

export const useAnalyzerStore = create<IState>()(
  devtools((set) => ({
    error: null,
    file: null,
    isAnalyzing: false,
    reset: () => set({ error: null, file: null, isAnalyzing: false, result: null }),
    result: null,
    setError: (error: null | string) => set({ error }),
    setFile: (file: File | null) => set({ file }),
    setIsAnalyzing: (isAnalyzing: boolean) => set({ isAnalyzing }),
    setResult: (result: IAnalyzerUploadResponse | null) => set({ result }),
  })),
);
