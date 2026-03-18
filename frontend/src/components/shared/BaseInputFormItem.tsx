import { clsx } from 'clsx';
import { FieldPath, FieldValues, useFormContext } from 'react-hook-form';

import { BaseFormItem } from '@/components/shared/BaseFormItem';
import { BaseInput } from '@/components/shared/BaseInput';

export const BaseInputFormItem = <T extends FieldValues>({
  className,
  icon,
  label,
  name,
  showLabel = false,
  type = 'text',
}: {
  className?: string;
  icon?: React.ReactNode;
  label: string;
  name: FieldPath<T>;
  showLabel?: boolean;
  type?: string;
}) => {
  const {
    formState: { errors },
    watch,
  } = useFormContext<T>();

  const value = watch(name) || '';
  const error = errors[name];
  const isShowLabel = showLabel || (label.length > 0 && value.length > 0);

  const getBorderClasses = (hasValue: boolean, hasError: boolean) => {
    if (hasError) {
      return '!border-[#FD3757] focus:!border-[#FD3757] hover:!border-[#FD3757] !border-2';
    }
    return hasValue
      ? '!border-neutrals_950 focus:!border-neutrals_950 hover:!border-neutrals_950'
      : '!border-neutrals_300 focus:!border-neutrals_950 hover:!border-neutrals_950';
  };

  return (
    <div className={clsx('flex flex-col mb-4', className)}>
      {isShowLabel && (
        <label className="text-[#7C7C7C] text-[10px]/[13px] font-normal mb-[6px]">
          {label}
        </label>
      )}
      <BaseFormItem name={name}>
        <BaseInput
          className={`h-[42px] px-4 py-3 text-sm border rounded-lg ${getBorderClasses(value.length > 0, !!error)}`}
          placeholder={label}
          prefix={icon ? icon : undefined}
          prefixGap={8}
          status={error ? 'error' : undefined}
          type={type}
        />
      </BaseFormItem>
      {error && (
        <div className="h-[14px] mt-1">
          <p className="text-[#FD3757] text-[10px]/[13px] font-normal">
            {String(error.message || error)}
          </p>
        </div>
      )}
    </div>
  );
};
