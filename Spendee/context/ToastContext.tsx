import AppToast, { AppToastProps } from '@/components/AppToast'
import { CircleAlert, CircleCheck, Info } from 'lucide-react-native'
import React, { createContext, ReactNode, useState } from 'react'

interface ToastContextType {
  showToast: (message: string, type?: 'error' | 'success' | 'info') => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

let globalShowToast:
  | ((message: string, type?: 'error' | 'success' | 'info') => void)
  | null = null

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<AppToastProps | null>(null)

  const showToast = (
    message: string,
    type: 'error' | 'success' | 'info' = 'error',
  ) => {
    setToast({
      message,
      icon:
        type === 'error'
          ? CircleAlert
          : type === 'success'
            ? CircleCheck
            : Info,
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
  show: (message: string, type: 'error' | 'success' | 'info' = 'error') => {
    globalShowToast?.(message, type)
  },
}
