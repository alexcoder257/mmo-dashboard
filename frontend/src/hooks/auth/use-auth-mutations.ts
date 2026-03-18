// TODO: implement — stub for build compatibility
import { useMutation } from '@tanstack/react-query';

import type { IAuthLoginRequest, IAuthRegister } from '@/models/interfaces/auth.interface';

import { authLoginApi, authRegisterApi } from '@/apis/auth.api';
import { EToast } from '@/models/enums/shared.enum';
import { useAuthStore } from '@/stores/auth.store';
import { showToast } from '@/utils/shared.util';

export const useAuthLoginMutation = () => {
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: (data: IAuthLoginRequest) => authLoginApi(data),
    onError: (error: Error) => {
      showToast(error?.message || 'Login failed', EToast.Error);
    },
    onSuccess: (response) => {
      if (response.data) {
        setToken(response.data);
      }
    },
  });
};

export const useAuthRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: IAuthRegister) => authRegisterApi(data),
    onError: (error: Error) => {
      showToast(error?.message || 'Registration failed', EToast.Error);
    },
  });
};
