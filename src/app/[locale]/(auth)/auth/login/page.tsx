'use client';

export const runtime = 'edge';

import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocalStorage } from 'usehooks-ts';

import IconAuthPassword from '@/assets/icons/auth/IconAuthPassword.svg';
import IconAuthUser from '@/assets/icons/auth/IconAuthUser.svg';
import IconLogoWithColor from '@/assets/icons/auth/IconLogoWithColor.svg';
import { BaseButton } from '@/components/shared/BaseButton';
import { BaseCheckbox } from '@/components/shared/BaseCheckbox';
import { BaseInputFormItem } from '@/components/shared/BaseInputFormItem';
import { STORAGE_KEYS } from '@/constants/shared.const';
import { useAuthLoginMutation } from '@/hooks/auth/use-auth-mutations';
import { Link } from '@/i18n/navigation';
import { loginSchema } from '@/schemas/auth.schema';

export interface LoginFormData {
  identifier: string;
  password: string;
}

export default function LoginPage() {
  const loginMutation = useAuthLoginMutation();

  const handleSubmit = (data: LoginFormData & { rememberMe: boolean }) => {
    const payload = {
      password: data.password,
      username: data.identifier,
    };
    loginMutation.mutate(payload);
  };

  return (
    <div className="relative z-10 flex flex-col items-center w-full mx-auto sm:py-16 md:px-6">
      <div className="auth-wrapper w-full max-w-[1232px]">
        <LoginForm
          isLoading={loginMutation.isPending}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

const LoginForm = ({
  isLoading,
  onSubmit,
}: {
  isLoading: boolean;
  onSubmit: (data: LoginFormData & { rememberMe: boolean }) => void;
}) => {
  const t = useTranslations();
  const [savedUsername, setSavedUsername] = useLocalStorage(
    STORAGE_KEYS.REMEMBER_USERNAME,
    '',
  );
  const [rememberMe, setRememberMe] = useState(false);

  const methods = useForm<LoginFormData>({
    defaultValues: {
      identifier: '',
      password: '',
    },
    mode: 'onChange',
    resolver: yupResolver(loginSchema),
  });

  const {
    formState: { isValid },
    handleSubmit,
    setValue,
  } = methods;

  useEffect(() => {
    if (savedUsername) {
      setRememberMe(true);
      setValue('identifier', savedUsername);
    }
  }, [savedUsername, setValue]);

  const handleFormSubmit = (data: LoginFormData) => {
    if (rememberMe) {
      setSavedUsername(data.identifier);
    } else {
      setSavedUsername('');
    }
    onSubmit({ ...data, rememberMe });
  };

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
    if (!checked) {
      setSavedUsername('');
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col items-center gap-6">
        <IconLogoWithColor />
        <h1 className="text-primary_700 text-[13px]/[17px] sm:text-[16px]/[21px] font-medium text-center w-[578px]">
          {t('auth.welcome')}
          <br />
          <span className="text-neutrals_950">{t('auth.pleaseLogin')}</span>
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
              icon={<IconAuthUser />}
              label={t('auth.usernameOrEmail')}
              name="identifier"
            />
            <BaseInputFormItem
              icon={<IconAuthPassword />}
              label={t('auth.password')}
              name="password"
              type="password"
            />
          </div>
          <RememberForgotRow
            rememberMe={rememberMe}
            setRememberMe={handleRememberMeChange}
          />
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
            {t('auth.login')}
          </BaseButton>
          <div className="flex justify-center items-center w-full">
            <span className="text-[#7C7C7C] text-[13px]/[17px] sm:text-sm text-center">
              {t('auth.noAccount')}{' '}
              <Link
                className="text-primary_700 transition-colors hover:underline hover:!text-neutrals_950"
                href="/auth/register"
              >
                {t('auth.registerNow')}
              </Link>
            </span>
          </div>
        </div>
      </Form>
    </FormProvider>
  );
};

const RememberForgotRow = ({
  rememberMe,
  setRememberMe,
}: {
  rememberMe: boolean;
  setRememberMe: (checked: boolean) => void;
}) => {
  const t = useTranslations();
  return (
    <div className="flex items-center justify-between w-full gap-1.5">
      <div className="flex items-center gap-1.5">
        <BaseCheckbox
          checked={rememberMe}
          className="[&_.ant-checkbox-inner]:w-[14px] [&_.ant-checkbox-inner]:h-[14px]"
          onChange={(e: CheckboxChangeEvent) => setRememberMe(e.target.checked)}
        />
        <span
          className={`text-neutrals_950 text-[13px] font-medium cursor-pointer`}
          onClick={() => setRememberMe(!rememberMe)}
        >
          {t('auth.rememberMe')}
        </span>
      </div>
      <Link
        className="text-neutrals_300 text-[13px] font-medium hover:text-neutrals_950 transition-colors hover:underline"
        href="/auth/forgot-password"
      >
        {t('auth.forgotPassword')}
      </Link>
    </div>
  );
};
