import { Suspense, useCallback, useState, useMemo, useRef, memo } from 'react'
import { X } from 'lucide-react'
import { ModalContext } from './modal.context'
import type { Modal, ModalConfig, ModalSize } from './modal.type'
import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { DialogSkeleton } from './dialog-skeleton'
import { Button } from '@/shared/ui/button';

interface ModalProviderProps {
  children: ReactNode
}

interface ModalRendererProps {
  modal: Modal
  zIndex: number
  onClose: () => void
}

// Extract constants outside component to prevent recreation
const MODAL_SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  default: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw]',
}

// Modal Provider Component
export function ModalProvider({ children }: ModalProviderProps) {
  const [modals, setModals] = useState<Array<Modal>>([])

  // Use ref for counter instead of Date.now() for better performance
  const modalIdRef = useRef(0)

  const openModal = useCallback((modalConfig: ModalConfig): string => {
    const id = `modal-${++modalIdRef.current}`
    setModals((prev) => [...prev, { ...modalConfig, id }])
    return id
  }, [])

  const closeModal = useCallback((id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id))
  }, [])

  const closeTopModal = useCallback(() => {
    setModals((prev) => prev.slice(0, -1))
  }, [])

  const closeAllModals = useCallback(() => {
    setModals([])
  }, [])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ openModal, closeModal, closeTopModal, closeAllModals }),
    [openModal, closeModal, closeTopModal, closeAllModals],
  )

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {modals.map((modal, index) => (
        <ModalRenderer
          key={modal.id}
          modal={modal}
          zIndex={1000 + index}
          onClose={() => closeModal(modal.id)}
        />
      ))}
    </ModalContext.Provider>
  )
}

// Memoize ModalRenderer to prevent unnecessary re-renders
const ModalRenderer = memo(function ModalRenderer({
  modal,
  zIndex,
  onClose,
}: ModalRendererProps) {
  const {
    title,
    description,
    content,
    footer,
    size = 'default',
    showClose = true,
    closeOnOverlay = true,
    closeOnEscape = true,
    onConfirm,
    onCancel,
    confirmText = 'Konfirmasi',
    cancelText = 'Batal',
    type = 'default',
    confirmIcon: ConfirmIcon,
    cancelIcon: CancelIcon,
  } = modal

  // Memoize callbacks to prevent recreation
  const handleConfirm = useCallback(() => {
    onConfirm?.()
    onClose()
  }, [onConfirm, onClose])

  const handleCancel = useCallback(() => {
    onCancel?.()
    onClose()
  }, [onCancel, onClose])

  const handleOpenChange = useCallback(
    (open: boolean, { reason }: { reason: string }) => {
      if (!open) {
        if (reason === 'escape-key' && !closeOnEscape) return
        onClose()
      }
    },
    [closeOnEscape, onClose],
  )

  // Memoize className to prevent string concatenation on every render
  const contentClassName = useMemo(
    () =>
      `${MODAL_SIZE_CLASSES[size]} ${type === 'alert' ? 'border-red-500' : ''} bg-card`,
    [size, type],
  )

  // Memoize style object
  const contentStyle = useMemo(() => ({ zIndex }), [zIndex])

  // Memoize title className
  const titleClassName = useMemo(
    () => (type === 'alert' ? 'text-red-600' : ''),
    [type],
  )

  // Determine if we should show footer
  const shouldShowFooter = footer !== null
  const hasDefaultFooter = !footer && (type === 'confirm' || type === 'alert')

  return (
    <Suspense fallback={<DialogSkeleton size={size} />}>
      <Dialog open={true} onOpenChange={handleOpenChange} disablePointerDismissal={!closeOnOverlay}>
        <DialogContent
          className={contentClassName}
          style={contentStyle}
          showCloseButton={false}
        >
          {showClose && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none cursor-pointer"
              type="button"
                aria-label="Tutup"
            >
              <X className="h-4 w-4" />
                <span className="sr-only">Tutup</span>
            </button>
          )}

          <DialogHeader>
            {title && (
              <DialogTitle className={titleClassName}>{title}</DialogTitle>
            )}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          <div className="py-2">{content}</div>

          {shouldShowFooter && (
            <DialogFooter>
              {footer ||
                (hasDefaultFooter && (
                  <>
                    <Button
                      className="cursor-pointer"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      {CancelIcon && <CancelIcon className="mr-2 h-4 w-4" />}
                      {cancelText}
                    </Button>
                    <Button
                      className="cursor-pointer"
                      variant={type === 'alert' ? 'destructive' : 'default'}
                      onClick={handleConfirm}
                    >
                      {ConfirmIcon && <ConfirmIcon className="mr-2 h-4 w-4" />}
                      {confirmText}
                    </Button>
                  </>
                ))}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </Suspense>
  )
})
