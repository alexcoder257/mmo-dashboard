import { TRAVEL_API } from '@/constants/route-apis.const';
import { post } from '@/libs/fetch/utils';

export const travelAnalyzeApi = async (data: { tiktokUrl: string }) => {
  return await post<{ jobId: string }>(TRAVEL_API.ANALYZE, data);
};
