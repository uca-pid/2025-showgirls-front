import { toastService } from '@/context/ToastContext'
import codeService from '@/services/code.service'
import { Linking } from 'react-native'

export async function redirectToEstaller() {
  try {
    const response = await codeService.getCode()

    const url = response.data.redirect
    Linking.openURL(url)
  } catch (error) {
    console.log(error)
    toastService.show('Error en la redirección')
  }
}
