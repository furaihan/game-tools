import { createContext } from 'react'
import type { ModalContextType } from './modal.type'

export const ModalContext = createContext<ModalContextType | null>(null)
