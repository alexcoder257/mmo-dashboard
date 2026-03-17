import { object as yupObject, ref as yupRef, string as yupString } from 'yup';

import { REGEXES } from '@/constants/shared.const';

export const loginSchema = yupObject({
  identifier: yupString()
    .required('Tên đăng nhập/Email là bắt buộc')
    .min(3, 'Tên đăng nhập/Email phải có ít nhất 3 ký tự'),
  password: yupString()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .matches(REGEXES.PASSWORD, 'Mật khẩu phải có ít nhất 1 chữ và 1 số'),
});

export const forgotPasswordSchema = yupObject({
  email: yupString().required('Email là bắt buộc').email('Email không hợp lệ'),
});

export const newPasswordSchema = yupObject({
  confirmPassword: yupString()
    .required('Nhập lại mật khẩu là bắt buộc')
    .oneOf(
      [yupRef('newPassword')],
      'Mật khẩu mới và nhập lại mật khẩu không khớp',
    ),
  newPassword: yupString()
    .required('Mật khẩu mới là bắt buộc')
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .matches(REGEXES.PASSWORD, 'Mật khẩu mới phải có ít nhất 1 chữ và 1 số'),
});

export const registerSchema = yupObject({
  confirm_password: yupString()
    .required('Nhập lại mật khẩu là bắt buộc')
    .oneOf([yupRef('password')], 'Mật khẩu không khớp'),
  email: yupString()
    .required('Email là bắt buộc')
    .email('Vui lòng kiểm tra lại email'),
  otpCode: yupString(),
  password: yupString()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .matches(REGEXES.PASSWORD, 'Mật khẩu phải có ít nhất 1 chữ và 1 số'),
  referralCode: yupString(),
  username: yupString().required('Tên đăng nhập là bắt buộc'),
});
