import { Tooltip, TooltipProps } from 'antd';
import { clsx } from 'clsx';
import { ReactNode } from 'react';

type IProps = Omit<TooltipProps, 'children'> & {
  children: ReactNode;
  className?: string;
  content?: ReactNode;
};

export const BaseTooltip = ({
  children,
  className,
  content,
  ...otherProps
}: IProps) => {
  return (
    <Tooltip title={content} {...otherProps}>
      <div className={clsx('inline-block', className)}>{children}</div>
    </Tooltip>
  );
};
