import { Popover, PopoverProps } from 'antd';
import React from 'react';

interface IProps extends PopoverProps {}

export const BasePopover: React.FC<IProps> = ({ ...otherProps }) => {
  return <Popover {...otherProps} />;
};
