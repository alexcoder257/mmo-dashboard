// TODO: implement — stub for build compatibility
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { missionRewardExchangeApi } from '@/apis/mission.api';
import { EToast } from '@/models/enums/shared.enum';
import { IMissionRewardExchangeRequest } from '@/models/interfaces/mission.interface';
import { showToast } from '@/utils/shared.util';

import { MISSION_QUERY_KEYS } from './use-mission-queries';

export const useMissionRewardExchangeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IMissionRewardExchangeRequest) =>
      missionRewardExchangeApi(data),
    onError: (error: Error) => {
      showToast(error?.message || 'Exchange failed', EToast.Error);
    },
    onSuccess: () => {
      showToast('Reward exchanged successfully', EToast.Success);
      queryClient.invalidateQueries({ queryKey: MISSION_QUERY_KEYS.rewardHistory });
      queryClient.invalidateQueries({ queryKey: MISSION_QUERY_KEYS.dailyStatus });
    },
  });
};
