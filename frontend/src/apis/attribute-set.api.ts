import { CATEGORY_API } from '@/constants/route-apis.const';
import { get } from '@/libs/fetch/utils';

export const fetchAttributeSetApi = async () => {
  const url = CATEGORY_API.ATTRIBUTE_SET;
  return await get(url);
};
