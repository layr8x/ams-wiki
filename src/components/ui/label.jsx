import { cn } from '@/lib/utils'

export const Label = ({
  className,
  ...props
}) => (
  <label
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
)

Label.displayName = 'Label'
