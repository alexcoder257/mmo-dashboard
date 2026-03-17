'use client';

export const runtime = 'edge';

import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from 'antd';
import { useTranslations } from 'next-intl';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import IconAuthPassword from '@/assets/icons/auth/IconAuthPassword.svg';
import IconLogoWithColor from '@/assets/icons/auth/IconLogoWithColor.svg';
import { BaseButton } from '@/components/shared/BaseButton';
import { BaseInputFormItem } from '@/components/shared/BaseInputFormItem';
import { newPasswordSchema } from '@/schemas/auth.schema';

export interface NewPasswordFormData {
  confirmPassword: string;
  newPassword: string;
}

export default function NewPasswordPage() {
  const handleSubmit = (data: NewPasswordFormData) => {
    console.info('Change password data:', data);
  };

  return (
    <div className="relative z-10 flex flex-col items-center sm:max-w-[1232px] w-full mx-auto sm:py-16">
      <div className="auth-wrapper">
        <NewPasswordForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

const NewPasswordForm = ({
  onSubmit,
}: {
  onSubmit: (data: NewPasswordFormData) => void;
}) => {
  const t = useTranslations();
  const methods = useForm<NewPasswordFormData>({
    defaultValues: {
      confirmPassword: '',
      newPassword: '',
    },
    mode: 'onChange',
    resolver: yupResolver(newPasswordSchema),
  });

  const {
    formState: { isValid },
    handleSubmit,
  } = methods;

  const handleFormSubmit: SubmitHandler<NewPasswordFormData> = (data) => {
    onSubmit({ ...data });
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col items-center gap-6">
        <IconLogoWithColor />
        <h1 className="text-neutrals_950 text-[13px]/[17px] sm:text-[16px]/[21px] font-medium text-center sm:w-[578px]">
          {t('auth.createNewPassword')}
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
              icon={<IconAuthPassword />}
              label={t('auth.newPassword')}
              name="newPassword"
              type="password"
            />
            <BaseInputFormItem
              icon={<IconAuthPassword />}
              label={t('auth.confirmNewPassword')}
              name="confirmPassword"
              type="password"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-4 w-full mt-8">
          <BaseButton
            className="w-full"
            disabled={!isValid}
            htmlType="submit"
            size="large"
            type="primary"
          >
            {t('auth.createPassword')}
          </BaseButton>
        </div>
      </Form>
    </FormProvider>
  );
};
