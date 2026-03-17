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
  depth?: number;
  rootCategoryId?: number | string;
}
