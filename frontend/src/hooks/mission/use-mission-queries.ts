// TODO: implement — stub for build compatibility
import { useQuery } from '@tanstack/react-query';

import {
  missionDailyStatusApi,
  missionRewardHistoryApi,
  missionRewardsAvailableApi,
} from '@/apis/mission.api';

export const MISSION_QUERY_KEYS = {
  dailyStatus: ['mission', 'daily-status'] as const,
  rewardHistory: ['mission', 'reward-history'] as const,
  rewardsAvailable: ['mission', 'rewards-available'] as const,
};

export const useMissionDailyStatusQuery = () => {
  return useQuery({
    queryFn: () => missionDailyStatusApi().then((res) => res.data),
    queryKey: MISSION_QUERY_KEYS.dailyStatus,
  });
};

export const useMissionRewardsAvailableQuery = () => {
  return useQuery({
    queryFn: () => missionRewardsAvailableApi().then((res) => res.data),
    queryKey: MISSION_QUERY_KEYS.rewardsAvailable,
  });
};

export const useMissionRewardHistoryQuery = () => {
  return useQuery({
    queryFn: () => missionRewardHistoryApi().then((res) => res.data),
    queryKey: MISSION_QUERY_KEYS.rewardHistory,
  });
};
