// TODO: implement — stub for build compatibility
import React from 'react';

import { ITransformedMissionRewardHistory } from '@/models/interfaces/mission.interface';

interface IProps {
  className?: string;
  data: ITransformedMissionRewardHistory;
}

const HistoryExchangeItem: React.FC<IProps> = ({ data }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-sm">{data.title}</span>
        <span className="text-gray-500 text-xs">{data.description}</span>
        <span className="text-gray-400 text-xs">{data.date}</span>
      </div>
      <span className="text-primary_700 font-medium text-sm">
        {'-'}{data.point} {'pts'}
      </span>
    </div>
  );
};

export default HistoryExchangeItem;
