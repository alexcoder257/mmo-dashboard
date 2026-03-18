import React, { useState } from 'react';

import IconArrowDown from '@/assets/icons/header/IconArrowDown.svg';
import IconArrowUp from '@/assets/icons/header/IconArrowUp.svg';

interface ExpandableSectionProps {
  children: React.ReactNode;
  className?: string;
  initialExpanded?: boolean;
  title: string;
}

export default function ExpandableSection({
  children,
  className = '',
  initialExpanded = true,
  title,
}: ExpandableSectionProps) {
  const [expanded, setExpanded] = useState(initialExpanded);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`bg-white rounded-2xl p-4 ${className}`}>
      <div
        className="flex justify-between items-center mb-6 cursor-pointer"
        onClick={toggleExpanded}
      >
        <h3 className="text-[18px]/[23px] sm:text-[20px] font-semibold text-black">
          {title}
        </h3>
        {expanded ? (
          <IconArrowUp height={12} width={21} />
        ) : (
          <IconArrowDown height={12} width={21} />
        )}
      </div>

      {expanded && <div>{children}</div>}
    </div>
  );
}
