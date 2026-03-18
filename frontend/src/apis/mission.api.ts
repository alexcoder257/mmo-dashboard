import type {
  IMission,
  IMissionDailyCheckInResponse,
  IMissionDailyStatusResponse,
  IMissionReward,
  IMissionRewardExchangeRequest,
  IMissionRewardExchangeResponse,
  IMissionRewardHistory,
} from '@/models/interfaces/mission.interface';

import { MISSION_API } from '@/constants/route-apis.const';
import { get, post } from '@/libs/fetch/utils';

export const missionDailyCheckInApi = async () => {
  const url = MISSION_API.DAILY_CHECK_IN;
  return await post<IMissionDailyCheckInResponse>(url, undefined);
};

export const missionDailyStatusApi = async () => {
  const url = MISSION_API.DAILY_STATUS;
  return await get<IMissionDailyStatusResponse>(url);
};

export const missionListApi = async () => {
  const url = MISSION_API.LIST;
  return await get<IMission[]>(url);
};

export const missionRewardsAvailableApi = async () => {
  const url = MISSION_API.REWARDS_AVAILABLE;
  return await get<IMissionReward[]>(url);
};

export const missionRewardExchangeApi = async (
  data: IMissionRewardExchangeRequest,
) => {
  const url = MISSION_API.REWARDS_EXCHANGE;
  return await post<IMissionRewardExchangeResponse>(url, data);
};

export const missionRewardHistoryApi = async () => {
  const url = MISSION_API.REWARDS_HISTORY;
  return await get<IMissionRewardHistory[]>(url);
};
