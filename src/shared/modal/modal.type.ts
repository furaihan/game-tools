import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

// Type definitions
export type ModalSize = 'sm' | 'default' | 'lg' | 'xl' | 'full'
export type ModalType = 'default' | 'confirm' | 'alert'

export interface ModalConfig {
  title?: string
  description?: string
  content?: ReactNode
  footer?: ReactNode | null
  size?: ModalSize
  type?: ModalType
  showClose?: boolean
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
  onConfirm?: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  confirmIcon?: LucideIcon
  cancelIcon?: LucideIcon
}

export interface Modal extends ModalConfig {
  id: string
}

export interface ModalContextType {
  openModal: (config: ModalConfig) => string
  closeModal: (id: string) => void
  closeTopModal: () => void
  closeAllModals: () => void
}
