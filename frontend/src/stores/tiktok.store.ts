import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { ITiktokDownloadResponse } from '@/models/interfaces/tiktok.interface';

interface IState {
  error: null | string;
  isDownloading: boolean;
  reset: () => void;
  result: ITiktokDownloadResponse | null;
  setError: (error: null | string) => void;
  setIsDownloading: (isDownloading: boolean) => void;
  setResult: (result: ITiktokDownloadResponse | null) => void;
  setUrl: (url: string) => void;
  url: string;
}

export const useTiktokStore = create<IState>()(
  devtools((set) => ({
    error: null,
    isDownloading: false,
    reset: () => set({ error: null, isDownloading: false, result: null, url: '' }),
    result: null,
    setError: (error: null | string) => set({ error }),
    setIsDownloading: (isDownloading: boolean) => set({ isDownloading }),
    setResult: (result: ITiktokDownloadResponse | null) => set({ result }),
    setUrl: (url: string) => set({ url }),
    url: '',
  })),
);
