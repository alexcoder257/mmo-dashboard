'use client';

export const runtime = 'edge';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import HistoryExchangeItem from '@/components/daily-missions/HistoryExchangeItem';
import DailyMissions from '@/components/home/DailyMissions';
import MissionItem from '@/components/home/DailyMissions/MissionItem';
import { BaseButton } from '@/components/shared/BaseButton';
import { useMissionRewardExchangeMutation } from '@/hooks/mission/use-mission-mutations';
import {
  useMissionRewardHistoryQuery,
  useMissionRewardsAvailableQuery,
} from '@/hooks/mission/use-mission-queries';
import {
  IMissionReward,
  ITransformedMission,
  ITransformedMissionRewardHistory,
} from '@/models/interfaces/mission.interface';
import {
  transformMissionRewardHistory,
  transformRewards,
} from '@/utils/mission.util';

enum DailyMissionsTab {
  Daily = 'daily',
  History = 'history',
}
const DailyMissionsPage: React.FC = () => {
  const missionRewardsAvailableQuery = useMissionRewardsAvailableQuery();
  const missionRewardHistoryQuery = useMissionRewardHistoryQuery();
  const t = useTranslations();

  const [activeTab, setActiveTab] = useState<DailyMissionsTab>(
    DailyMissionsTab.Daily,
  );

  const transformedHistory = transformMissionRewardHistory(
    missionRewardHistoryQuery.data || [],
    missionRewardsAvailableQuery.data || [],
  );

  return (
    <div className="py-6 sm:py-[64px]">
      <DailyMissions isShowExchangeGift={false}>
        <div className="w-full flex flex-col gap-4 bg-white rounded-2xl p-4">
          <p className="text-[20px]/[26px] font-semibold text-neutrals_950">
            {t('dailyMissions.exchangeGift')}
          </p>
          <div className="w-full flex border border-neutrals_200 p-1 rounded-lg mb-8">
            <BaseButton
              className={`!border-none w-full flex-1 !h-[37px] ${
                activeTab === DailyMissionsTab.Daily
                  ? '!bg-primary_700'
                  : '!bg-transparent'
              }`}
              colorText={activeTab === DailyMissionsTab.Daily ? '#fff' : '#000'}
              onClick={() => setActiveTab(DailyMissionsTab.Daily)}
              variant="filled"
            >
              {t('dailyMissions.exchangeGift')}
            </BaseButton>
            <BaseButton
              className={`!border-none flex-1 !h-[37px] ${
                activeTab === DailyMissionsTab.History
                  ? '!bg-primary_700'
                  : '!bg-transparent'
              }`}
              colorText={
                activeTab === DailyMissionsTab.History ? '#fff' : '#000'
              }
              onClick={() => setActiveTab(DailyMissionsTab.History)}
              variant="filled"
            >
              {t('dailyMissions.exchangeHistory')}
            </BaseButton>
          </div>
          {activeTab === DailyMissionsTab.Daily ? (
            <GiftExchange
              missionRewards={missionRewardsAvailableQuery.data || []}
            />
          ) : (
            <GiftHistory history={transformedHistory} />
          )}
        </div>
      </DailyMissions>
    </div>
  );
};

const GiftExchange: React.FC<{ missionRewards: IMissionReward[] }> = ({
  missionRewards,
}) => {
  const missionRewardExchangeMutation = useMissionRewardExchangeMutation();

  const transformedRewards = transformRewards(missionRewards);

  const handleExchangeGift = (data: ITransformedMission) => {
    missionRewardExchangeMutation.mutate({
      rewardId: data.id,
    });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 gap-y-8">
      {transformedRewards.map((item) => (
        <MissionItem
          data={item}
          key={item.id}
          onStart={(data) => handleExchangeGift(data)}
          typeItem="reward"
        />
      ))}
    </div>
  );
};

const GiftHistory: React.FC<{
  history: ITransformedMissionRewardHistory[];
}> = ({ history }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 gap-y-8">
      {history.map((item) => (
        <HistoryExchangeItem data={item} key={item.id} />
      ))}
    </div>
  );
};

export default DailyMissionsPage;
