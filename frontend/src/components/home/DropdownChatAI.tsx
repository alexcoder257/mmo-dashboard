// TODO: implement — stub for build compatibility
import React from 'react';

interface IProps {
  className?: string;
  onClose?: () => void;
  style?: React.CSSProperties;
}

const DropdownChatAI: React.FC<IProps> = ({ onClose }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 min-w-[200px]"
      onClick={onClose}
    >
      <p className="text-gray-400 text-sm text-center">{'AI Chat coming soon'}</p>
    </div>
  );
};

export default DropdownChatAI;
