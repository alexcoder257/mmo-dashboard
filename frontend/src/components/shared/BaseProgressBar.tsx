import React from 'react';

import { DEFAULT_THEME } from '@/constants/theme-colors.const';

interface BaseProgressBarProps {
  currentStep: number;
  data: {
    label: string;
    value: number | string;
  }[];
}

const POINT_SIZE = 54;
const HALF_POINT = POINT_SIZE / 2;

const BaseProgressBar: React.FC<BaseProgressBarProps> = ({
  currentStep,
  data,
}) => {
  const pointCount = data.length;
  const progressRatio = pointCount > 1 ? currentStep / (pointCount - 1) : 1;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-5xl flex flex-col items-center">
        <div
          className={`absolute top-[21px] h-[2px]  z-0`}
          style={{
            backgroundColor: `${DEFAULT_THEME.PRIMARY}20`,
            left: `${HALF_POINT}px`,
            width: `calc(100% - ${POINT_SIZE}px)`,
          }}
        />
        <div
          className="absolute top-[21px] h-[2px] bg-primary_700 z-10 transition-all duration-300"
          style={{
            left: `${HALF_POINT}px`,
            width: `calc(${progressRatio} * (100% - ${POINT_SIZE}px))`,
          }}
        />
        <div className="relative w-full flex justify-between items-start z-20 mt-4">
          {data.map((item, idx) => (
            <div
              className="flex flex-col items-center min-w-[40px]"
              key={item.label}
            >
              <div className="w-[14px] h-[14px] rounded-full border flex items-center justify-center border-primary_700 bg-primary_50">
                {idx <= currentStep ? (
                  <span className="w-2 h-2 bg-primary_700 rounded-full" />
                ) : null}
              </div>
              <span className="text-[10px]/[13px] sm:text-xs text-neutrals_600 text-center whitespace-nowrap font-medium mt-3">
                {item.label}
              </span>
              <span className="text-[10px]/[13px] sm:text-xs font-semibold text-primary_700 text-center whitespace-nowrap">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BaseProgressBar;
