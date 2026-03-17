import { useCallback } from 'react';

import { ModalKey } from '@/models/types/shared.type';
import { useModalStore } from '@/stores/modal.store';

export const useModal = (modalKey: ModalKey) => {
  const closeModal = useModalStore((state) => state.closeModal);
  const getModalData = useModalStore((state) => state.getModalData);
  const hasModalOpen = useModalStore((state) => state.hasModalOpen);
  const openModal = useModalStore((state) => state.openModal);

  const open = useCallback(
    (data?: unknown) => {
      openModal(modalKey, data);
    },
    [modalKey, openModal],
  );

  const close = useCallback(() => {
    closeModal(modalKey);
  }, [modalKey, closeModal]);

  const isOpen = hasModalOpen(modalKey);
  const data = getModalData(modalKey);

  return {
    close,
    data,
    isOpen,
    open,
  };
};

export const useModalActions = () => {
  const closeAllModals = useModalStore((state) => state.closeAllModals);
  const closeModal = useModalStore((state) => state.closeModal);
  const getModalData = useModalStore((state) => state.getModalData);
  const hasModalOpen = useModalStore((state) => state.hasModalOpen);
  const openModal = useModalStore((state) => state.openModal);

  return {
    closeAllModals,
    closeModal,
    getModalData,
    hasModalOpen,
    openModal,
  };
};
