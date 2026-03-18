// TODO: implement — stub for build compatibility
import { ICategory } from '@/models/interfaces/category.interface';
import { TCategoryFlatten } from '@/models/types/category.type';

export const flattenCategories = (categories: ICategory[]): TCategoryFlatten[] => {
  const result: TCategoryFlatten[] = [];
  const queue = [...categories];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    const { childrenData, ...flat } = current;
    result.push(flat);
    if (childrenData?.length) {
      queue.push(...childrenData);
    }
  }

  return result;
};

/**
 * Get categories by IDs from a flat list.
 * Supports two call signatures:
 *   - getCategoryByIds(ids: string[], flatCategories: TCategoryFlatten[])
 *   - getCategoryByIds(rootCategory: ICategory | null | undefined, ids: (number | string)[])
 */
export const getCategoryByIds = (
  idsOrRoot: (number | string)[] | ICategory | null | undefined,
  categoriesOrIds: (number | string)[] | TCategoryFlatten[],
): TCategoryFlatten[] => {
  // Overload 1: getCategoryByIds(ids, flatCategories)
  if (Array.isArray(idsOrRoot)) {
    const ids = idsOrRoot.map(Number);
    const flatCategories = categoriesOrIds as TCategoryFlatten[];
    return flatCategories.filter((cat) => ids.includes(cat.id));
  }

  // Overload 2: getCategoryByIds(rootCategory, ids)
  if (!idsOrRoot) return [];
  const all = flattenCategories([idsOrRoot as ICategory]);
  const numericIds = (categoriesOrIds as (number | string)[]).map(Number);
  return all.filter((cat) => numericIds.includes(cat.id));
};
