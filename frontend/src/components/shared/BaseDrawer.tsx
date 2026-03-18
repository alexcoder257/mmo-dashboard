import React from 'react';

interface BaseDrawerProps {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
}

export default function BaseDrawer({
  children,
  onClose,
  open,
}: BaseDrawerProps) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-200"
        onClick={onClose}
      />
      <div className="fixed left-0 right-0 bottom-0 z-50 transition-transform duration-300">
        {children}
      </div>
    </>
  );
}
