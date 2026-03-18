// TODO: implement — stub for build compatibility
import { useMutation } from '@tanstack/react-query';

import { changePasswordApi } from '@/apis/profile.api';
import { EToast } from '@/models/enums/shared.enum';
import { IAuthChangePassword } from '@/models/interfaces/auth.interface';
import { showToast } from '@/utils/shared.util';

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (data: IAuthChangePassword) => changePasswordApi(data),
    onError: (error: Error) => {
      showToast(error?.message || 'Failed to change password', EToast.Error);
    },
    onSuccess: () => {
      showToast('Password changed successfully', EToast.Success);
    },
  });
};
