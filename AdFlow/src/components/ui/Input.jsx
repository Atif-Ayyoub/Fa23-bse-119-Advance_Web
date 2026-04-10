import { cn } from '../../lib/utils/cn'

export function Input({ label, className, ...props }) {
  return (
    <label className="form-field">
      {label ? <span className="form-field-label">{label}</span> : null}
      <input
        className={cn('input-control', className)}
        {...props}
      />
    </label>
  )
}
