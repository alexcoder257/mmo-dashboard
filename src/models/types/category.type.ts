import { ICategory } from '@/models/interfaces/category.interface';

export type TCategoryFlatten = Omit<ICategory, 'childrenData'>;
