export interface ICategory {
  catImage: string;
  childrenData: ICategory[];
  id: number;
  isActive: boolean;
  level: number;
  name: string;
  parentId: number;
  position: number;
  productCount: number;
}

export interface ICategoryListParams {
  [key: string]: unknown;
  depth?: number;
  rootCategoryId?: number | string;
}
