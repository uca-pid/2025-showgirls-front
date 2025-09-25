import { ForgotPasswordForm } from '@/components/forgot-password-form'
import { ScrollView } from 'react-native'

export default function ForgotPasswordScreen() {
  return (
    <ScrollView
      scrollEnabled={false}
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="sm:flex-1 items-center justify-center h-full w-full sm:py-4 sm:p-6"
      keyboardDismissMode="interactive"
    >
      <ForgotPasswordForm />
    </ScrollView>
  )
}
