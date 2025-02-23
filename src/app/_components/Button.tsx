import { cva, VariantProps } from 'class-variance-authority';

const ButtonStyles = cva('rounded-full outline-0 font-bold text-center', {
  variants: {
    color: {
      primary: 'bg-primary text-primary-text',
      secondary: 'bg-secondary text-secondary-text',
    },
    size: {
      sm: 'py-2 px-3',
      md: 'py-3 px-5 text-xl',
      lg: 'py-5 px-6 text-2xl',
    },
  },
  defaultVariants: {
    color: 'secondary',
    size: 'md',
  },
});

type ButtonProps = {
  onClick?: () => void;
  value: string | number;
  text: string;
  className?: string;
} & VariantProps<typeof ButtonStyles>;

export function Button({
  text,
  value,
  onClick,
  color,
  size,
  className,
}: ButtonProps) {
  return (
    <button
      className={ButtonStyles({ color, size, className })}
      onClick={onClick}
      value={value}
    >
      {text}
    </button>
  );
}

export default Button;
