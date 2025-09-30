import React, { createContext, useContext, useState, ReactNode } from 'react'
import AppToast, { AppToastProps } from '@/components/AppToast'
import { CircleAlert, CircleCheck } from 'lucide-react-native'

interface ToastContextType {
  showToast: (message: string, type?: 'error' | 'success') => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

let globalShowToast:
  | ((message: string, type?: 'error' | 'success') => void)
  | null = null

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<AppToastProps | null>(null)

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({
      message,
      icon: type === 'error' ? CircleAlert : CircleCheck,
      type: type,
    })

    setTimeout(() => setToast(null), 4000)
  }

  globalShowToast = showToast

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <AppToast {...toast} />}
    </ToastContext.Provider>
  )
}

export const toastService = {
  show: (message: string, type: 'error' | 'success' = 'error') => {
    globalShowToast?.(message, type)
  },
}
