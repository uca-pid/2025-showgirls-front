import React, { useState } from 'react'
import { Keyboard, TouchableWithoutFeedback, View, Pressable } from 'react-native'
import { Text } from '@/components/ui/text'
import { CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Toast from 'react-native-toast-message'
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { router } from 'expo-router'
import { ChevronRight } from 'lucide-react-native'

const ChangePasswordPage = () => {
	const [oldPassword, setOldPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loading, setLoading] = useState(false)

	const showErrorToast = (title: string, description?: string) => {
		Toast.show({ type: 'danger', text1: title, text2: description })
	}
	const showSuccessToast = (title: string, description?: string) => {
		Toast.show({ type: 'success', text1: title, text2: description })
	}

	async function onSubmit() {
		console.log('Changing password...')
		console.log({ oldPassword, newPassword, confirmPassword })	
		// Validaciones iniciales
		if (!oldPassword || !newPassword || !confirmPassword) {
			showErrorToast('Completá todos los campos')
			return
		}
		if (newPassword.length < 8) {
			showErrorToast('La contraseña debe tener al menos 8 caracteres')
			return
		}
		if (newPassword !== confirmPassword) {
			showErrorToast('Las contraseñas no coinciden')
			return
		}
		if (oldPassword === newPassword) {
			showErrorToast('La nueva contraseña no puede ser igual a la actual')
			return
		}

		const auth = getAuth()
		if (!auth.currentUser || !auth.currentUser.email) {
			showErrorToast('No hay un usuario autenticado')
			return
		}

		setLoading(true)
		try {
			// Reautenticación con la contraseña vieja
			const credential = EmailAuthProvider.credential(auth.currentUser.email, oldPassword)
			await reauthenticateWithCredential(auth.currentUser, credential)

			// Actualización de la contraseña
			await updatePassword(auth.currentUser, newPassword)

			showSuccessToast('Contraseña actualizada', 'Tu contraseña fue cambiada correctamente')
			router.replace('/edit-profile')
		} catch (err: any) {
			console.error('Error updating password', err)
			const code = err?.code || ''
			if (code.includes('wrong-password')) {
				showErrorToast('Contraseña actual incorrecta')
			} else if (code.includes('requires-recent-login')) {
				showErrorToast('Por seguridad, debés volver a iniciar sesión para cambiar la contraseña.')
			} else if (code.includes('user-mismatch')) {
				showErrorToast('El usuario autenticado no coincide. Probá cerrando sesión y volviendo a ingresar.')
			} else if (code.includes('user-disabled')) {
				showErrorToast('La cuenta está deshabilitada.')
			} else if (code.includes('weak-password')) {
				showErrorToast('La contraseña es demasiado débil.')
			} else {
				showErrorToast('Error al actualizar la contraseña', 'Intentá nuevamente en unos minutos')
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<View className="gap-6 w-full h-full justify-center bg-background">
				{/* Header con botón atrás */}
				<View className="flex-row items-center">
					<Pressable onPress={() => router.back()} className="p-2">
						<ChevronRight size={22} color="white" style={{ transform: [{ rotate: '180deg' }] }} />
					</Pressable>
					<Text className="text-lg font-semibold pl-2">Cambiar contraseña</Text>
				</View>

				{/* Formulario */}
				<View className="w-full px-1">
					<CardContent className="gap-4">
						<Label htmlFor="oldPassword">
							<Text>Contraseña actual</Text>
						</Label>
						<Input
							id="oldPassword"
							placeholder="Contraseña actual"
							secureTextEntry
							value={oldPassword}
							onChangeText={setOldPassword}
						/>

						<Label htmlFor="newPassword">
							<Text>Nueva contraseña</Text>
						</Label>
						<Input
							id="newPassword"
							placeholder="Nueva contraseña"
							secureTextEntry
							value={newPassword}
							onChangeText={setNewPassword}
						/>

						<Label htmlFor="confirmPassword">
							<Text>Confirmar contraseña</Text>
						</Label>
						<Input
							id="confirmPassword"
							placeholder="Confirmar contraseña"
							secureTextEntry
							value={confirmPassword}
							onChangeText={setConfirmPassword}
						/>

						<Button className="mt-[10px]" onPress={onSubmit} disabled={loading}>
							<Text>{loading ? 'Guardando...' : 'Cambiar contraseña'}</Text>
						</Button>
					</CardContent>
				</View>
			</View>
		</TouchableWithoutFeedback>
	)
}

export default ChangePasswordPage
