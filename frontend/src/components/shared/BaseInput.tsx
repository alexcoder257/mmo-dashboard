import { Input, InputProps, InputRef } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import { forwardRef } from 'react';

interface IInputProps extends InputProps {
  prefixGap?: number;
}
interface ITextAreaProps extends TextAreaProps {}

export const BaseInput = forwardRef<InputRef, IInputProps>(
  ({ prefix, prefixGap = 8, type, ...otherProps }, ref) => {
    const wrappedPrefix = prefix ? (
      <span style={{ marginRight: `${prefixGap}px` }}>{prefix}</span>
    ) : undefined;

    if (type === 'password')
      return (
        <Input.Password prefix={wrappedPrefix} ref={ref} {...otherProps} />
      );
    if (type === 'search')
      return <Input.Search prefix={wrappedPrefix} ref={ref} {...otherProps} />;

    return <Input prefix={wrappedPrefix} ref={ref} {...otherProps} />;
  },
);

export const BaseInputArea = forwardRef<InputRef, ITextAreaProps>(
  ({ ...otherProps }, ref) => {
    return <Input.TextArea ref={ref} {...otherProps} />;
  },
);

BaseInput.displayName = 'BaseInput';
BaseInputArea.displayName = 'BaseInputArea';
