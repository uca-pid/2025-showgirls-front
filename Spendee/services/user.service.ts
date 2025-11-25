import { toastService } from '@/context/ToastContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import {
  Auth,
  createUserWithEmailAndPassword,
  deleteUser,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { Linking } from 'react-native'
import ApiService from './api.service'
import codeService from './code.service'

const showErrorToast = (title: string) => {
  toastService.show(title)
}

const showSuccessToast = (title: string) => {
  toastService.show(title, 'success')
}

function getFriendlyAuthMessage(err: any) {
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

  public async login(
    auth: Auth,
    email: string,
    password: string,
    isOAuthFlow?: boolean,
  ) {
    if (!email || !password) {
      showErrorToast('Completá email y contraseña')
      return
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      )
      const user = userCredential.user
      const idToken = await user.getIdToken()
      await SecureStore.setItemAsync('jwt', idToken)

      const publicProfile = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      }

      await AsyncStorage.setItem('userProfile', JSON.stringify(publicProfile))

      if (!isOAuthFlow) {
        router.replace('/(tabs)')
        return
      }

      const response = await codeService.getCode(user.uid || publicProfile.uid)
      if (response.status === 200) {
        const url = response.data.redirect
        Linking.openURL(url)
      }
    } catch (err) {
      const friendly = getFriendlyAuthMessage(err)
      showErrorToast(friendly)
    }
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
        showErrorToast('Por favor, ingresá un email válido')
      })
  }

  public async update(auth: Auth, newName: string) {
    if (auth.currentUser) {
      if (newName.length < 4) {
        showErrorToast('El nombre debe tener al menos 4 caracteres.')
        return
      }

      if (newName.length > 20) {
        showErrorToast('El nombre no puede tener más de 20 caracteres.')
        return
      }
      updateProfile(auth.currentUser, {
        displayName: newName,
      })
        .then(() => {
          showSuccessToast('Perfil actualizado')
          router.dismissAll()
          router.replace('/profile')
        })
        .catch((error) => {
          showErrorToast('Error al actualizar perfil')
        })
    }
  }

  public async delete(auth: Auth) {
    if (auth.currentUser) {
      deleteUser(auth.currentUser)
        .then(() => {
          showSuccessToast('Usuario eliminado')
          router.replace('/sign-in')
        })
        .catch((error) => {
          showErrorToast('Error al eliminar usuario')
        })
    }
  }

  public async signOut(auth: Auth) {
    await SecureStore.deleteItemAsync('jwt')
      .then(async () => await AsyncStorage.removeItem('userProfile'))
      .catch((error) => {
        showErrorToast('Error al cerrar sesión')
        return
      })
      .then(async () => await auth.signOut())
      .catch((error) => {
        showErrorToast('Error al cerrar sesión')
        return
      })
    router.replace('/sign-in')
  }

  public async loginWithGoogle(
    auth: Auth,
    idToken: string | undefined,
    accessToken?: string,
  ) {
    if (!idToken) {
      showErrorToast('No se pudo obtener token de Google')
      return
    }
    try {
      const credential = GoogleAuthProvider.credential(idToken, accessToken)
      const userCredential = await signInWithCredential(auth, credential)
      const user = userCredential.user
      const idTok = await user.getIdToken()
      await SecureStore.setItemAsync('jwt', idTok)
      const publicProfile = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      }
      await AsyncStorage.setItem('userProfile', JSON.stringify(publicProfile))
      router.replace('/(tabs)')
    } catch (err: any) {
      const friendly = getFriendlyAuthMessage(err)
      showErrorToast(friendly)
    }
  }

  public async generateApiSecret(auth: Auth) {
    if (!auth.currentUser) {
      throw new Error('Usuario no autenticado')
    }
    return await ApiService.post<string>('/generateApiSecret')
  }

  public async deleteApiSecret(auth: Auth) {
    if (!auth.currentUser) {
      throw new Error('Usuario no autenticado')
    }
    return await ApiService.delete('/deleteApiSecret')
  }

  //hasApiSecret
  public async hasApiSecret(auth: Auth) {
    if (!auth.currentUser) {
      throw new Error('Usuario no autenticado')
    }
    return await ApiService.get<{ hasSecret: boolean }>('/hasApiSecret')
  }

  public async getAPIId(auth: Auth) {
    if (!auth.currentUser) {
      throw new Error('Usuario no autenticado')
    }
    return await ApiService.get<{ apiId: string }>('/getApiId')
  }
}
const userService = new UserService()
export default userService
