
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import type { ModalSize } from './modal.type'

interface DialogSkeletonProps {
  /** The size of the dialog skeleton, matching the modal size */
  size?: ModalSize
}

/**
 * DialogSkeleton Component
 *
 * A loading skeleton used within Suspense boundaries for modal dialogs.
 * Displays an animated placeholder that mimics a typical form layout.
 *
 * @param {ModalSize} size - The size of the dialog (sm, default, lg, xl, full)
 *
 * @example
 * ```tsx
 * <Suspense fallback={<DialogSkeleton size="lg" />}>
 *   <MyModalContent />
 * </Suspense>
 * ```
 */
export function DialogSkeleton({ size = 'default' }: DialogSkeletonProps) {
  const sizeClasses: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    default: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]',
  }

  return (
    <Dialog open={true}>
      <DialogContent className={sizeClasses[size]} showCloseButton={false}>
        <DialogTitle>Memuat...</DialogTitle>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
          </div>
          <div className="space-y-3 pt-4">
            <div className="h-10 w-full bg-muted animate-pulse rounded" />
            <div className="h-10 w-full bg-muted animate-pulse rounded" />
            <div className="h-20 w-full bg-muted animate-pulse rounded" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <div className="h-9 w-20 bg-muted animate-pulse rounded" />
            <div className="h-9 w-20 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
