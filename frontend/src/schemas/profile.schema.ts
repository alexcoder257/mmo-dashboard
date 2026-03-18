import { object as yupObject, ref as yupRef, string as yupString } from 'yup';

import { REGEXES } from '@/constants/shared.const';

export const changePasswordSchema = yupObject({
  confirmPassword: yupString()
    .required('Nhập lại mật khẩu là bắt buộc')
    .oneOf(
      [yupRef('newPassword')],
      'Mật khẩu mới và nhập lại mật khẩu không khớp',
    ),
  currentPassword: yupString()
    .required('Current password is required')
    .min(6, 'Current password must be at least 6 characters long'),
  newPassword: yupString()
    .required('Mật khẩu mới là bắt buộc')
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .matches(REGEXES.PASSWORD, 'Mật khẩu mới phải có ít nhất 1 chữ và 1 số'),
});
