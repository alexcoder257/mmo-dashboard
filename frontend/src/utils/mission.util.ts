// TODO: implement — stub for build compatibility
import {
  IMissionReward,
  IMissionRewardHistory,
  ITransformedMission,
  ITransformedMissionRewardHistory,
} from '@/models/interfaces/mission.interface';

export const transformRewards = (rewards: IMissionReward[]): ITransformedMission[] => {
  if (!rewards?.length) return [];
  return rewards.map((reward) => ({
    code: String(reward.rewardId),
    description: reward.shortDescription,
    id: reward.rewardId,
    isCompleted: reward.exchanged,
    point: reward.exchangePoints,
    title: reward.title,
  }));
};

export const transformMissionRewardHistory = (
  history: IMissionRewardHistory[],
  rewards: IMissionReward[],
): ITransformedMissionRewardHistory[] => {
  if (!history?.length) return [];

  return history.map((item) => {
    const reward = rewards.find((r) => r.rewardId === item.rewardId);
    return {
      date: item.createdAt,
      description: reward?.shortDescription ?? '',
      id: item.exchangeId,
      point: item.pointsSpent,
      title: reward?.title ?? '',
    };
  });
};

export const transformMissions = (missions: ITransformedMission[]): ITransformedMission[] => {
  return missions ?? [];
};
