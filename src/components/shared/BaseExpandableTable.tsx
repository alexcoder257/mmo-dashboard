import React, { useState } from 'react';

import IconArrowDown from '@/assets/icons/header/IconArrowDown.svg';
import IconArrowUp from '@/assets/icons/header/IconArrowUp.svg';
import { DEFAULT_THEME } from '@/constants/theme-colors.const';

export interface TableItem {
  icon?: boolean | React.ReactNode;
  label: string;
  value: string;
}

interface BaseExpandableTableProps {
  className?: string;
  initialExpanded?: boolean;
  items: TableItem[];
  renderIcon?: (item: TableItem) => React.ReactNode;
  title: string;
}

export default function BaseExpandableTable({
  className = '',
  initialExpanded = true,
  items,
  renderIcon,
  title,
}: BaseExpandableTableProps) {
  const [expanded, setExpanded] = useState(initialExpanded);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  if (expanded && items.length === 0) return null;
  return (
    <div className={`bg-white rounded-2xl p-4 ${className}`}>
      <div
        className="flex justify-between items-center mb-6 cursor-pointer"
        onClick={toggleExpanded}
      >
        <h3
          className={`text-[18px]/[23px] sm:text-[20px] font-semibold text-[${DEFAULT_THEME.NEUTRAL_950}]`}
        >
          {title}
        </h3>
        {expanded ? (
          <IconArrowUp height={12} width={21} />
        ) : (
          <IconArrowDown height={12} width={21} />
        )}
      </div>

      {expanded && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="w-48 p-3 border border-[#DCDCDC] bg-white">
                    <span
                      className={`text-[14px] font-medium text-[${DEFAULT_THEME.NEUTRAL_950}]`}
                    >
                      {item.label}
                    </span>
                  </td>
                  <td className="p-3 border border-[#DCDCDC] bg-white">
                    {item.icon ? (
                      <div className="flex items-center">
                        {typeof item.icon === 'boolean' && renderIcon
                          ? renderIcon(item)
                          : item.icon}
                      </div>
                    ) : (
                      <span
                        className={`text-[14px] text-[${DEFAULT_THEME.NEUTRAL_950}] whitespace-pre-line`}
                      >
                        {item.value}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
