import { Button, ButtonProps } from 'antd';
import { clsx } from 'clsx';

import IconLoading from '@/assets/icons/shared/IconLoading.svg';

interface IProps extends Omit<ButtonProps, 'size'> {
  children?: React.ReactNode;
  className?: string;
  colorText?: string;
  customColor?: 'primary' | 'secondary' | 'transparent';
  disabled?: boolean;
  loading?: boolean;
  loadingPosition?: 'left' | 'right';
  size?: 'extra-small' | 'large' | 'middle' | 'middle-large' | 'small';
  variant?: 'filled' | 'outlined' | 'solid';
}

export const BaseButton: React.FC<IProps> = ({
  children,
  className,
  colorText = '#fff',
  customColor,
  disabled = false,
  loading = false,
  loadingPosition = 'right',
  size,
  variant = 'filled',
  ...otherProps
}) => {
  const buttonClass = clsx({
    '!bg-neutrals_400 !border-none': disabled,
    '!bg-primary_700 !border-none':
      customColor === 'primary' && variant === 'filled' && !disabled,
    '!bg-secondary_950 !border-none':
      customColor === 'secondary' && variant === 'filled' && !disabled,
    '!bg-transparent': customColor === 'transparent',
    '!border': variant === 'outlined',
    '!h-[25px]': size === 'extra-small',
    '!h-[30px]': size === 'small',
    '!h-[40px]': size === 'middle-large',
    '!h-[45px]': size === 'large',
    'sm:!h-[37px] !h-[33px]': size === 'middle',
  });

  return (
    <Button
      {...otherProps}
      className={clsx(
        '!flex-center px-[16px] rounded-xl !font-medium ',
        buttonClass,
        className,
      )}
      disabled={disabled || loading}
      style={{ color: colorText }}
    >
      {loading && loadingPosition === 'left' && (
        <IconLoading className="animate-spin" height={16} width={16} />
      )}
      {children}
      {loading && loadingPosition === 'right' && (
        <IconLoading className="animate-spin" height={16} width={16} />
      )}
    </Button>
  );
};
