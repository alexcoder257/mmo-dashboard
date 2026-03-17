'use client';

export const runtime = 'edge';

import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from 'antd';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';

import IconAuthEmail from '@/assets/icons/auth/IconAuthEmail.svg';
// import IconAuthOTP from '@/assets/icons/auth/IconAuthOTP.svg';
import IconAuthPassword from '@/assets/icons/auth/IconAuthPassword.svg';
import IconAuthUser from '@/assets/icons/auth/IconAuthUser.svg';
import IconLogoWithColor from '@/assets/icons/auth/IconLogoWithColor.svg';
import { BaseButton } from '@/components/shared/BaseButton';
import { BaseInputFormItem } from '@/components/shared/BaseInputFormItem';
import { useAuthRegisterMutation } from '@/hooks/auth/use-auth-mutations';
import { Link } from '@/i18n/navigation';
import { IAuthRegister } from '@/models/interfaces/auth.interface';
import { registerSchema } from '@/schemas/auth.schema';

export interface RegisterFormData {
  confirm_password: string;
  email: string;
  otpCode?: string;
  password: string;
  referralCode?: string;
  username: string;
}

export default function RegisterPage() {
  const registerMutation = useAuthRegisterMutation();

  const handleSubmit = (data: IAuthRegister) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="relative z-10 flex flex-col items-center sm:max-w-[1232px] w-full mx-auto sm:py-16 md:px-6">
      <div className="auth-wrapper w-full max-w-[1232px]">
        <RegisterForm
          isLoading={registerMutation.isPending}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

const RegisterForm = ({
  isLoading = false,
  onSubmit,
}: {
  isLoading?: boolean;
  onSubmit: (data: IAuthRegister) => void;
}) => {
  const t = useTranslations();
  const methods = useForm<RegisterFormData>({
    defaultValues: {
      confirm_password: '',
      email: '',
      otpCode: '',
      password: '',
      referralCode: '',
      username: '',
    },
    mode: 'onChange',
    resolver: yupResolver(registerSchema),
  });

  const {
    formState: { isValid },
    handleSubmit,
    watch,
  } = methods;

  const password = watch('password');
  // const otpCode = watch('otpCode');
  const handleFormSubmit = (data: RegisterFormData) => {
    const payload = {
      customer: {
        email: data.email,
        firstname: data.username,
        lastname: data.username,
        ...(data.referralCode && {
          custom_attributes: [
            {
              attribute_code: 'referrer_id',
              value: data.referralCode,
            },
          ],
        }),
      },
      password: data.password,
    };
    onSubmit(payload);
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col items-center gap-6">
        <IconLogoWithColor />
        <h1 className="text-primary_700 text-[13px]/[17px] sm:text-[16px]/[21px] font-medium text-center sm:w-[578px]">
          {t('auth.welcome')}
          <br />
          <span className="text-neutrals_950">
            {t('auth.pleaseRegisterInfo')}
          </span>
        </h1>
      </div>
      <Form
        className="w-full sm:w-[394px]"
        layout="vertical"
        onFinish={handleSubmit(handleFormSubmit)}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col w-full">
            <BaseInputFormItem
              icon={<IconAuthEmail />}
              label={t('auth.email')}
              name="email"
            />
            {/* <div>
              <div className="flex gap-2 items-start">
                <BaseInputFormItem
                  className={clsx(
                    otpCode && otpCode.length > 0 && '!mb-1',
                    'flex-1',
                  )}
                  icon={<IconAuthOTP />}
                  label=""
                  name="otpCode"
                  type="text"
                />
                <BaseButton
                  className="!h-[42px] !w-[106px]"
                  disabled={false}
                  htmlType="submit"
                  type="primary"
                >
                  {t('auth.sendOTP')}
                </BaseButton>
              </div>
              {otpCode && otpCode.length > 0 && (
                <p className="text-neutrals_500 italic text-[10px] font-normal mb-4">
                  {t('auth.otpInstruction')}
                </p>
              )}
            </div> */}
            <BaseInputFormItem
              icon={<IconAuthUser />}
              label={t('auth.username')}
              name="username"
              type="text"
            />
            <div>
              <BaseInputFormItem
                className={clsx(password.length > 0 && '!mb-1')}
                icon={<IconAuthPassword />}
                label={t('auth.password')}
                name="password"
                type="password"
              />
              {password.length > 0 && (
                <p className="text-neutrals_500 italic text-[10px] font-normal mb-4">
                  {t('auth.passwordRequirement')}
                </p>
              )}
            </div>
            <BaseInputFormItem
              icon={<IconAuthPassword />}
              label={t('auth.passwordConfirm')}
              name="confirm_password"
              type="password"
            />
            <BaseInputFormItem
              label={t('auth.referralCode')}
              name="referralCode"
              type="text"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-4 w-full mt-8">
          <BaseButton
            className="w-full"
            disabled={!isValid || isLoading}
            htmlType="submit"
            loading={isLoading}
            size="large"
            type="primary"
          >
            {t('auth.register')}
          </BaseButton>
          <div className="flex justify-center items-center w-full">
            <span className="text-[#7C7C7C] text-[13px]/[17px] sm:text-sm text-center">
              {t('auth.hasAccount')}{' '}
              <Link
                className="text-primary_700 transition-colors hover:underline hover:!text-neutrals_950"
                href="/auth/login"
              >
                {t('auth.loginNow')}
              </Link>
            </span>
          </div>
        </div>
      </Form>
    </FormProvider>
  );
};
