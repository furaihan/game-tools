import { useContext } from 'react'
import { ModalContext } from './modal.context'
import type { ModalContextType } from './modal.type'

export function useModal(): ModalContextType {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within ModalProvider')
  }
  return context
}
