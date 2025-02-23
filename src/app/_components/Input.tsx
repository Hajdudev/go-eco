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
  placeholder: string;
  name: string;
  className?: string;
} & VariantProps<typeof inputStyles>;

export function Input({
  placeholder,
  name,
  color,
  size,
  className,
}: InputProps) {
  return (
    <input
      className={inputStyles({ color, size, className })}
      type='text'
      placeholder={placeholder}
      name={name}
    />
  );
}

export default Input;
