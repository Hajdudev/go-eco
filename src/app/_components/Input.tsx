import { forwardRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

const inputStyles = cva('rounded-2xl outline-0 font-bold text-center', {
  variants: {
    color: {
      primary: 'bg-primary text-black',
      secondary: 'bg-secondary text-white',
    },
    size: {
      sm: 'py-4',
      md: 'py-5 text-xl',
      lg: 'py-8 text-2xl',
    },
  },
  defaultVariants: {
    color: 'secondary',
    size: 'md',
  },
});

type InputProps = {
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder: string;
  name: string;
  className?: string;
} & VariantProps<typeof inputStyles>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      onFocus,
      onBlur,
      onChange,
      value,
      placeholder,
      name,
      color,
      size,
      className,
    },
    ref,
  ) => {
    return (
      <input
        ref={ref}
        value={value}
        onChange={onChange}
        className={inputStyles({ color, size, className })}
        type='text'
        placeholder={placeholder}
        name={name}
        onFocus={onFocus}
        onBlur={onBlur}
        autoComplete='off'
      />
    );
  },
);

Input.displayName = 'Input';

export default Input;
