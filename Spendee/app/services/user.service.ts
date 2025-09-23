import AsyncStorage from '@react-native-async-storage/async-storage'
import { Auth, signInWithEmailAndPassword } from 'firebase/auth'
import Toast from 'react-native-toast-message'
import * as SecureStore from 'expo-secure-store'
import { router } from 'expo-router'
import apiService from './api.service'

const showErrorToast = (title: string, description?: string) => {
  Toast.show({
    type: 'danger',
    text1: title,
    text2: description,
  })
}

function getFriendlyAuthMessage(err: any) {
  console.log('Firebase Auth Error:', err.code, err.message)
  const code = err?.code || ''
  if (code.includes('auth/invalid-credential'))
    return 'Email o contraseña incorrectos.'
  if (code.includes('auth/invalid-email'))
    return 'Email o contraseña incorrectos.'
  if (code.includes('auth/too-many-requests'))
    return 'Demasiados intentos. Intenta más tarde.'
  // fallback
  return err?.message || 'Error al iniciar sesión. Intenta de nuevo.'
}

export class UserService {
  public async login(auth: Auth, email: string, password: string) {
    if (!email || !password) {
      showErrorToast('Completá email y contraseña')
      return
    }
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user
        const idToken = await user.getIdToken().then()
        await SecureStore.setItemAsync('jwt', idToken)
        const publicProfile = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }
        await AsyncStorage.setItem('userProfile', JSON.stringify(publicProfile))
        router.replace('/(tabs)')
      })
      .catch((firebaseLoginError) => {
        const friendlyMessage = getFriendlyAuthMessage(firebaseLoginError)
        showErrorToast(friendlyMessage)
      })
  }
}

const userService = new UserService()
export default userService
