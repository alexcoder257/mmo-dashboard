// TODO: implement — stub for build compatibility
import React from 'react';

interface IProps {
  className?: string;
  onCloseDropdown?: () => void;
}

const DropdownCategory: React.FC<IProps> = ({ onCloseDropdown }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 min-w-[200px]"
      onClick={onCloseDropdown}
    >
      <p className="text-gray-400 text-sm text-center">{'Categories coming soon'}</p>
    </div>
  );
};

export default DropdownCategory;
