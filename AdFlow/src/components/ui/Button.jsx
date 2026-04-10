import { cn } from '../../lib/utils/cn'

const variantMap = {
  primary: 'btn--primary',
  secondary: 'btn--secondary',
  ghost: 'btn--ghost',
}

export function Button({
  type = 'button',
  variant = 'primary',
  className,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'btn',
        variantMap[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
