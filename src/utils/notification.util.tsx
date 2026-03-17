import { notification } from 'antd';
import clsx from 'clsx';
import React from 'react';

import IconError from '@/assets/icons/shared/IconError.svg';
import IconInfo from '@/assets/icons/shared/IconInfo.svg';
import IconSuccess from '@/assets/icons/shared/IconSuccess.svg';
import IconWarning from '@/assets/icons/shared/IconWarning.svg';
import styles from '@/assets/styles/components/shared/notification-util.module.scss';
import { EToast } from '@/models/enums/shared.enum';

const defaultIcons: Record<EToast, React.ReactElement> = {
  [EToast.Error]: <IconError />,
  [EToast.Info]: <IconInfo />,
  [EToast.Success]: <IconSuccess />,
  [EToast.Warning]: <IconWarning />,
};

const toastClassMap = {
  container: {
    [EToast.Error]: styles['container--error'],
    [EToast.Info]: styles['container--info'],
    [EToast.Success]: styles['container--success'],
    [EToast.Warning]: styles['container--warning'],
  },
  content: {
    [EToast.Error]: styles['description__content--error'],
    [EToast.Info]: styles['description__content--info'],
    [EToast.Success]: styles['description__content--success'],
    [EToast.Warning]: styles['description__content--warning'],
  },
  icon: {
    [EToast.Error]: styles['description__icon--error'],
    [EToast.Info]: styles['description__icon--info'],
    [EToast.Success]: styles['description__icon--success'],
    [EToast.Warning]: styles['description__icon--warning'],
  },
};

export const showToast = (
  description: React.ReactNode,
  type: EToast = EToast.Success,
) => {
  notification.destroy();

  notification.open({
    className: clsx(
      styles['container'],
      'toast-wrapper-global',
      toastClassMap.container[type],
    ),
    closeIcon: false,
    duration: 10,
    message: (
      <div className={styles['description']}>
        <div
          className={clsx(
            styles['description__icon'],
            toastClassMap.icon[type],
          )}
        >
          {defaultIcons[type]}
        </div>
        <div
          className={clsx(
            styles['description__content'],
            toastClassMap.content[type],
          )}
        >
          {description}
        </div>
      </div>
    ),
    style: { maxWidth: 505, width: '100%' },
  });
};
