import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { ModalKey } from '@/models/types/shared.type';

interface ModalActions {
  closeAllModals: () => void;
  closeModal: (key: ModalKey) => void;
  getModalData: <T = unknown>(key: ModalKey) => T | undefined;
  hasModalOpen: (key: ModalKey) => boolean;
  openModal: (key: ModalKey, data?: unknown) => void;
}

interface ModalState {
  activeModals: Set<ModalKey>;
  modalData: Record<ModalKey, unknown>;
}

interface ModalStore extends ModalActions, ModalState {}

export const useModalStore = create<ModalStore>()(
  devtools((set, get) => ({
    activeModals: new Set<ModalKey>(),
    closeAllModals: () => {
      set({
        activeModals: new Set<ModalKey>(),
        modalData: {} as Record<ModalKey, unknown>,
      });
    },

    closeModal: (key: ModalKey) => {
      set((state) => {
        const newActiveModals = new Set(state.activeModals);
        newActiveModals.delete(key);
        const newModalData = { ...state.modalData };
        delete newModalData[key];
        return {
          activeModals: newActiveModals,
          modalData: newModalData,
        };
      });
    },

    getModalData: <T = unknown>(key: ModalKey): T | undefined => {
      return get().modalData[key] as T | undefined;
    },

    hasModalOpen: (key: ModalKey) => {
      return get().activeModals.has(key);
    },

    modalData: {} as Record<ModalKey, unknown>,

    openModal: (key: ModalKey, data?: unknown) => {
      set((state) => ({
        activeModals: new Set([key, ...state.activeModals]),
        modalData: data ? { ...state.modalData, [key]: data } : state.modalData,
      }));
    },
  })),
);
