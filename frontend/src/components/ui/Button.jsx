import { cn } from '../../utils/cn.js';

export default function Button({
  variant = 'primary',
  className,
  type = 'button',
  ...props
}) {
  const classes =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'secondary'
      ? 'btn-secondary'
      : variant === 'danger'
      ? 'btn-danger'
      : 'btn-ghost';

  return <button type={type} className={cn(classes, className)} {...props} />;
}
