import { useSearchParams } from 'next/navigation';

interface IQueryParams {
  [key: string]: null | string;
}

const useQueryParams = (keys: string[]): IQueryParams => {
  const searchParams = useSearchParams();
  const params: IQueryParams = {};

  keys.forEach((key) => {
    const value = searchParams.get(key);
    params[key] = value ? decodeURIComponent(value) : null;
  });

  return params;
};

export default useQueryParams;
