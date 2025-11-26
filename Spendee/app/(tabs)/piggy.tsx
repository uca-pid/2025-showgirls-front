import Container from '@/components/Container'
import ItemCard from '@/components/ItemCard'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { toastService } from '@/context/ToastContext'
import usePiggy from '@/hooks/usePiggy'
import piggyService from '@/services/piggy.service'
import useThemeColor from '@/theme/useThemeColor'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import LottieView from 'lottie-react-native'
import React, { useRef, useState } from 'react'
import {
  FlatList,
  Pressable,
  RefreshControl,
  useColorScheme,
  View,
} from 'react-native'

type PiggyNameDialogProps = {
  piggyName?: string
  changePiggyNameFn: UseMutateAsyncFunction<any, Error, string, unknown>
}

const Piggy = () => {
  const {
    piggyData,
    level,
    isFetching,
    isRefetching,
    changePiggyName,
    refetch,
  } = usePiggy()
  const { colorHex } = useThemeColor()
  const animationRef = useRef<any>(null)

  const playAnimation = () => {
    animationRef.current?.reset()
    animationRef.current?.play()
  }

  return (
    <Container
      activity={isFetching}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={!isRefetching ? 'gray' : 'black'}
        />
      }
    >
      <Pressable onPress={playAnimation}>
        <LottieView
          ref={animationRef}
          source={require('@/assets/lottie/Piggy Bank - Coins Out.json')}
          autoPlay={false}
          loop={false}
          style={{
            width: 250,
            height: 250,
            transform: [{ translateY: -60 }],
            borderColor: 'red',
            borderWidth: 1,
          }}
          resizeMode="contain"
        />
      </Pressable>

      <PiggyNameDialog
        piggyName={piggyData?.nombre}
        changePiggyNameFn={changePiggyName}
      />

      <Text className="text-lg font-semibold">XP: {piggyData?.xp}</Text>
      <Text className="text-lg font-semibold">Nivel: {level}</Text>
      <FlatList
        scrollEnabled={false}
        data={piggyData?.objetivos || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ItemCard
            title={`Objetivo: ${item?.objetivo.descripcion}`}
            description={`Progreso: ${((item.progreso / item?.objetivo.maxProgreso) * 100).toFixed(2)}%`}
          />
        )}
      />
    </Container>
  )
}

const PiggyNameDialog = ({
  piggyName,
  changePiggyNameFn,
}: PiggyNameDialogProps) => {
  const colorScheme = useColorScheme()
  const [name, setName] = useState(piggyName || 'Piggy')
  const onSubmit = async () => {
    try {
      toastService.show('Cambiando nombre...', 'info')
      await changePiggyNameFn(name)
      await piggyService.checkObjective('piggy_edit')
      toastService.show('Nombre cambiado con éxito', 'success')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Pressable>
          <Text className="text-lg font-semibold">{piggyName}</Text>
        </Pressable>
      </DialogTrigger>
      <DialogContent className="w-[80%]">
        <DialogHeader>
          <DialogTitle>Cambiar Nombre</DialogTitle>
          <DialogDescription>
            <View className="items-center justify-center w-[100%] h-[64px] border-b-2 border-b-pink-300">
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

export default Piggy
