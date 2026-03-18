// TODO: implement — stub for build compatibility
import { useQuery } from '@tanstack/react-query';

import { getProfileApi } from '@/apis/profile.api';

export const PROFILE_QUERY_KEYS = {
  profile: ['profile'] as const,
};

export const useGetProfileQuery = () => {
  return useQuery({
    queryFn: () => getProfileApi().then((res) => res.data),
    queryKey: PROFILE_QUERY_KEYS.profile,
  });
};
