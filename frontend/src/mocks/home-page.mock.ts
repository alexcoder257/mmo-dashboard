// TODO: implement — stub mock data
import { StaticImageData } from 'next/image';

import { PcSpecs } from '@/models/enums/product.enum';

export interface IHomeMockProduct {
  id: number;
  img?: StaticImageData;
  properties: { [key in PcSpecs]?: string };
  title: string;
}

export const products: IHomeMockProduct[] = [
  {
    id: 1,
    img: undefined,
    properties: {} as { [key in PcSpecs]?: string },
    title: 'Sample Product 1',
  },
  {
    id: 2,
    img: undefined,
    properties: {} as { [key in PcSpecs]?: string },
    title: 'Sample Product 2',
  },
  {
    id: 3,
    img: undefined,
    properties: {} as { [key in PcSpecs]?: string },
    title: 'Sample Product 3',
  },
  {
    id: 4,
    img: undefined,
    properties: {} as { [key in PcSpecs]?: string },
    title: 'Sample Product 4',
  },
  {
    id: 5,
    img: undefined,
    properties: {} as { [key in PcSpecs]?: string },
    title: 'Sample Product 5',
  },
  {
    id: 6,
    img: undefined,
    properties: {} as { [key in PcSpecs]?: string },
    title: 'Sample Product 6',
  },
];
