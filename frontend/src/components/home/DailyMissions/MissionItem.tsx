// TODO: implement — stub for build compatibility
import React from 'react';

import {
  IMissionReward,
  ITransformedMission,
} from '@/models/interfaces/mission.interface';

interface IProps {
  className?: string;
  data: IMissionReward | ITransformedMission;
  onExchange?: (reward: IMissionReward) => void;
  onStart?: (data: ITransformedMission) => void;
  typeItem?: string;
}

const MissionItem: React.FC<IProps> = ({
  data,
  onExchange,
  onStart,
  typeItem: _typeItem,
}) => {
  const isMissionReward = 'exchangePoints' in data;
  const title = data.title;
  const description = isMissionReward
    ? (data as IMissionReward).shortDescription
    : (data as ITransformedMission).description;
  const points = isMissionReward
    ? (data as IMissionReward).exchangePoints
    : (data as ITransformedMission).point;
  const isExchanged = isMissionReward ? (data as IMissionReward).exchanged : (data as ITransformedMission).isCompleted;

  const handleClick = () => {
    if (isMissionReward && onExchange) {
      onExchange(data as IMissionReward);
    } else if (!isMissionReward && onStart) {
      onStart(data as ITransformedMission);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-sm">{title}</span>
        <span className="text-gray-500 text-xs">{description}</span>
        <span className="text-primary_700 text-xs font-medium">{points} {'points'}</span>
      </div>
      {!isExchanged ? (
        <button
          className="px-4 py-2 bg-primary_700 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          onClick={handleClick}
          type="button"
        >
          {'Exchange'}
        </button>
      ) : (
        <span className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm">
          {'Exchanged'}
        </span>
      )}
    </div>
  );
};

export default MissionItem;
