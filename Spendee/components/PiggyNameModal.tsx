import { toastService } from '@/context/ToastContext'
import piggyService from '@/services/piggy.service'
import useThemeColor from '@/theme/useThemeColor'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Pressable, View } from 'react-native'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Text } from './ui/text'
import usePiggy from '@/hooks/usePiggy'

type PiggyNameDialogProps = {
  piggyName?: string
  changePiggyNameFn: UseMutateAsyncFunction<any, Error, string, unknown>
}

const PiggyNameDialog = ({
  piggyName,
  changePiggyNameFn,
}: PiggyNameDialogProps) => {
  const { updateObjective } = usePiggy()
  const { colorHex } = useThemeColor()
  const [name, setName] = useState(piggyName || 'Piggy')
  const onSubmit = async () => {
    try {
      toastService.show('Cambiando nombre...', 'info')
      await changePiggyNameFn(name)
      await updateObjective('piggy_edit')
      toastService.show('Nombre cambiado con éxito', 'success')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Pressable className=" items-center justify-center">
          <Text className="text-xl font-semibold">{piggyName}</Text>
        </Pressable>
      </DialogTrigger>
      <DialogContent className="w-[80%]">
        <DialogHeader>
          <DialogTitle>Cambiar Nombre</DialogTitle>
          <DialogDescription>
            <View
              style={{ borderColor: colorHex }}
              className="items-center justify-center w-[100%] h-[64px] border-b-2"
            >
              <Input
                style={{
                  borderWidth: 0,
                  backgroundColor: 'transparent',
                  fontSize: 20,
                }}
                returnKeyType="next"
                onChangeText={setName}
                value={name}
              />
            </View>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onPress={() => {
                onSubmit()
              }}
            >
              <Text>Cambiar Nombre</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PiggyNameDialog
