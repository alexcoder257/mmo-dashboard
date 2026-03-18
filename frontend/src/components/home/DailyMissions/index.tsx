// TODO: implement — stub for build compatibility
'use client';

import React from 'react';

interface IProps {
  children?: React.ReactNode;
  className?: string;
  isShowExchangeGift?: boolean;
}

const DailyMissions: React.FC<IProps> = ({
  children,
  className,
  isShowExchangeGift: _isShowExchangeGift = true,
}) => {
  return (
    <div className={`w-full py-4 ${className ?? ''}`}>
      {children}
    </div>
  );
};

export default DailyMissions;
