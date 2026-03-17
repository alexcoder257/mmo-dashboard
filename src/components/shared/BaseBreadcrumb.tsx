import { Breadcrumb } from 'antd';
import React from 'react';

import IconArrowRight from '@/assets/icons/header/IconArrowRight.svg';
import { DEFAULT_THEME } from '@/constants/theme-colors.const';
import { Link } from '@/i18n/navigation';

export interface BaseBreadcrumbItem {
  href?: string;
  label: string;
}

export interface BaseBreadcrumbProps {
  className?: string;
  items: BaseBreadcrumbItem[];
}

const BaseBreadcrumb: React.FC<BaseBreadcrumbProps> = ({
  className,
  items,
}) => {
  return (
    <Breadcrumb
      className={`${className} flex items-center`}
      separator={<IconArrowRight className="mt-1" height={8} width={5} />}
    >
      {items.map((item, idx) => (
        <Breadcrumb.Item
          className="flex items-center justify-center text-xs"
          key={idx}
        >
          {item.href ? (
            <Link
              className={
                idx === 0
                  ? 'font-bold hover:underline flex items-center'
                  : 'text-[#0094FA] hover:underline flex items-center'
              }
              href={item.href}
              style={idx === 0 ? { color: 'var(--secondary_500)' } : undefined}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={`text-[${DEFAULT_THEME.NEUTRAL_950}] flex items-center`}
            >
              {item.label}
            </span>
          )}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default BaseBreadcrumb;
