import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border p-4',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        destructive: 'border-red-200 bg-red-50 text-red-900 [&>svg]:text-red-600',
        warning: 'border-yellow-200 bg-yellow-50 text-yellow-900 [&>svg]:text-yellow-600',
        success: 'border-green-200 bg-green-50 text-green-900 [&>svg]:text-green-600',
        info: 'border-blue-200 bg-blue-50 text-blue-900 [&>svg]:text-blue-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export const Alert = ({ className, variant, ...props }) => (
  <div className={cn(alertVariants({ variant }), className)} {...props} />
)

Alert.displayName = 'Alert'

export const AlertTitle = ({
  className,
  ...props
}) => (
  <h5 className={cn('mb-1 font-medium leading-tight', className)} {...props} />
)

AlertTitle.displayName = 'AlertTitle'

export const AlertDescription = ({
  className,
  ...props
}) => (
  <div className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
)

AlertDescription.displayName = 'AlertDescription'
