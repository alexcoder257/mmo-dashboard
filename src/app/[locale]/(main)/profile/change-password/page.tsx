'use client';

export const runtime = 'edge';

import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from 'antd';
import { useTranslations } from 'next-intl';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import IconLock from '@/assets/icons/shared/IconLock.svg';
import { BaseButton } from '@/components/shared/BaseButton';
import { BaseInputFormItem } from '@/components/shared/BaseInputFormItem';
import { PROFILE_PAGE } from '@/constants/route-pages.const';
import { DEFAULT_THEME } from '@/constants/theme-colors.const';
import { useChangePasswordMutation } from '@/hooks/profile/use-auth-mutations';
import { useRouter } from '@/i18n/navigation';
import { changePasswordSchema } from '@/schemas/profile.schema';

export interface ChangePasswordFormData {
  confirmPassword: string;
  currentPassword: string;
  newPassword: string;
}

const ChangePasswordPage: React.FC = () => {
  const changePassMutation = useChangePasswordMutation();

  const t = useTranslations();
  const changePasswordForm = useForm<ChangePasswordFormData>({
    defaultValues: {
      confirmPassword: '',
      currentPassword: '',
      newPassword: '',
    },
    mode: 'onChange',
    resolver: yupResolver(changePasswordSchema),
  });

  const { handleSubmit } = changePasswordForm;

  const onSubmit: SubmitHandler<ChangePasswordFormData> = (values) => {
    const payloadPassword = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    };
    changePassMutation.mutate(payloadPassword);
  };

  return (
    <>
      <div className="sm:w-[814px] bg-white rounded-2xl border sm:border-none mx-4 mt-6 sm:my-16 sm:mx-auto p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
        <div className="text-black text-xl font-semibold leading-[1.3]">
          {t('auth.changePassword')}
        </div>

        <FormProvider {...changePasswordForm}>
          <Form
            className="profile-form"
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
          >
            <BaseInputFormItem
              icon={<IconLock />}
              label={t('auth.currentPassword')}
              name="currentPassword"
              showLabel
              type="password"
            />
            <BaseInputFormItem
              icon={<IconLock />}
              label={t('auth.newPassword')}
              name="newPassword"
              showLabel
              type="password"
            />
            <BaseInputFormItem
              icon={<IconLock />}
              label={t('auth.confirmNewPassword')}
              name="confirmPassword"
              showLabel
              type="password"
            />
            <ButtonGroup handleSubmit={() => handleSubmit(onSubmit)} />
          </Form>
        </FormProvider>
      </div>

      <ButtonGroup handleSubmit={() => handleSubmit(onSubmit)} isMobile />
    </>
  );
};

const ButtonGroup: React.FC<{
  handleSubmit: () => void;
  isMobile?: boolean;
}> = ({ handleSubmit, isMobile = false }) => {
  const router = useRouter();
  const t = useTranslations();

  return (
    <div
      className={`flex justify-between gap-3 mt-6 ${isMobile ? 'sm:hidden mx-4' : 'hidden sm:flex'}`}
    >
      <BaseButton
        className={`!border !border-[${DEFAULT_THEME.NEUTRAL_950}] !w-full !rounded-lg`}
        colorText={DEFAULT_THEME.NEUTRAL_950}
        onClick={() => router.push(PROFILE_PAGE.ROOT)}
        size="middle"
        variant="outlined"
      >
        <span className="sm:text-base text-[13px] font-medium  !leading-[1.3]">
          {t('shared.button.back')}
        </span>
      </BaseButton>

      <BaseButton
        className="!w-full !rounded-lg"
        customColor="primary"
        htmlType="submit"
        onClick={handleSubmit}
        size="middle"
      >
        <span className="sm:text-base text-[13px] font-medium !leading-[1.3] ">
          {t('shared.button.confirm')}
        </span>
      </BaseButton>
    </div>
  );
};

export default ChangePasswordPage;
