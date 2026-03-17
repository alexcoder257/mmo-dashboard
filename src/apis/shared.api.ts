import { HEALTH_CHECK_API } from '@/constants/route-apis.const';
import { SELECTORS } from '@/constants/shared.const';
import { get } from '@/libs/fetch/utils';

export const healthCheckApi = async () => {
  const url = HEALTH_CHECK_API;
  return await get<unknown>(
    url,
    undefined,
    SELECTORS.APIS_SECTION,
    'All systems are go! Health check successful',
  );
};
