'use client';

export const runtime = 'edge';

import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from 'antd';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';

import IconAuthEmail from '@/assets/icons/auth/IconAuthEmail.svg';
import IconLogoWithColor from '@/assets/icons/auth/IconLogoWithColor.svg';
import { BaseButton } from '@/components/shared/BaseButton';
import { BaseInputFormItem } from '@/components/shared/BaseInputFormItem';
import { Link } from '@/i18n/navigation';
import { forgotPasswordSchema } from '@/schemas/auth.schema';

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  const t = useTranslations();
  const methods = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
    resolver: yupResolver(forgotPasswordSchema),
  });

  const {
    formState: { isValid },
    handleSubmit,
  } = methods;

  const onSubmit = (data: ForgotPasswordFormData) => {
    const forgotPasswordData = { ...data };
    console.info('Forgot password data:', forgotPasswordData);
  };

  return (
    <div className="relative z-10 flex flex-col items-center sm:max-w-[1232px] w-full mx-auto sm:py-16">
      <div className="auth-wrapper">
        <FormProvider {...methods}>
          <div className="flex flex-col items-center gap-6">
            <IconLogoWithColor />
            <h1 className="text-neutrals_950 text-[13px]/[17px] sm:text-[16px]/[21px] font-medium text-center sm:w-[578px]">
              {t('auth.forgotPasswordInstruction1')}
              <br />
              <span>{t('auth.forgotPasswordInstruction2')}</span>
            </h1>
          </div>
          <Form
            className="w-full sm:w-[394px]"
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col w-full">
              <BaseInputFormItem
                icon={<IconAuthEmail />}
                label={t('auth.email')}
                name="email"
              />
            </div>
            <div className="flex flex-col justify-center items-center gap-4 w-full mt-8">
              <BaseButton
                className="w-full"
                disabled={!isValid}
                htmlType="submit"
                size="large"
                type="primary"
              >
                {t('auth.sendEmail')}
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
      </div>
    </div>
  );
}
