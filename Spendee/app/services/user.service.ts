import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import Toast from 'react-native-toast-message'
import * as SecureStore from 'expo-secure-store'
import { router } from 'expo-router'

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
  private validateRegisterFields(
    email: string,
    password: string,
    passwordConfirmation: string,
    name: string,
  ) {
    let error = ''
    if (!email || !password || !passwordConfirmation || !name) {
      error = 'Completá todos los campos.'
    } else if (name.length < 4) {
      error = 'El nombre debe tener al menos 4 caracteres.'
    } else if (name.length > 20) {
      error = 'El nombre no puede tener más de 20 caracteres.'
    } else if (password !== passwordConfirmation) {
      error = 'Las contraseñas no coinciden.'
    } else if (password.length < 8) {
      error = 'La contraseña debe tener al menos 8 caracteres.'
    }
    if (error === '') return false
    showErrorToast(error)
    return true
  }

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

  public async register(
    auth: Auth,
    email: string,
    password: string,
    passwordConfirmation: string,
    name: string,
  ) {
    if (
      this.validateRegisterFields(email, password, passwordConfirmation, name)
    )
      return
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user
        await updateProfile(user, { displayName: name })
        const idToken = await user.getIdToken()
        await SecureStore.setItemAsync('jwt', idToken)
        const publicProfile = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL || null,
        }
        await AsyncStorage.setItem('userProfile', JSON.stringify(publicProfile))
        router.replace('/(tabs)')
      })
      .catch((firebaseRegisterError) => {
        const friendlyMessage = getFriendlyAuthMessage(firebaseRegisterError)
        showErrorToast(friendlyMessage)
      })
  }
}
const userService = new UserService()
export default userService
