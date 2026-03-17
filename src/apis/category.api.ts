import { CATEGORY_API } from '@/constants/route-apis.const';
import { get } from '@/libs/fetch/utils';
import { ICategory } from '@/models/interfaces/category.interface';
import { TObjectUnknown } from '@/models/types/shared.type';
import { cleanQueryString, formatQueryString } from '@/utils/shared.util';

export const categoryListApi = async (queryParams: TObjectUnknown) => {
  const url = formatQueryString(
    CATEGORY_API.LIST,
    cleanQueryString(queryParams),
  );
  return await get<ICategory>(url);
};
