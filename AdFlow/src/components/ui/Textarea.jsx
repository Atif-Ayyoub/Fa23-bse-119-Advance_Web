import { cn } from '../../lib/utils/cn'

export function Textarea({ label, className, ...props }) {
  return (
    <label className="form-field">
      {label ? <span className="form-field-label">{label}</span> : null}
      <textarea className={cn('textarea-control', className)} {...props} />
    </label>
  )
}
