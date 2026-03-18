import type { ITiktokDownloadRequest, ITiktokDownloadResponse } from '@/models/interfaces/tiktok.interface';

import { TIKTOK_API } from '@/constants/route-apis.const';
import { post } from '@/libs/fetch/utils';

export const tiktokDownloadApi = async (data: ITiktokDownloadRequest) => {
  return await post<ITiktokDownloadResponse>(TIKTOK_API.DOWNLOAD, data);
};
