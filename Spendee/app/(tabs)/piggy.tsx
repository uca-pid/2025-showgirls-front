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
import { Text } from '@/components/ui/text'
import usePiggy from '@/hooks/usePiggy'
import piggyService from '@/services/piggy.service'
import useThemeColor from '@/theme/useThemeColor'
import LottieView from 'lottie-react-native'
import { useColorScheme } from 'nativewind'
import React, { useRef, useState } from 'react'
import { FlatList, Pressable, TextInput, View } from 'react-native'

const Piggy = () => {
  const { colorHex } = useThemeColor()
  const { piggyData, refetch } = usePiggy()
  const animationRef = useRef<any>(null)
  const level = piggyData?.xp ? Math.floor(piggyData.xp / 5) : 0
  const [name, setName] = useState(
    piggyData ? (piggyData.nombre as string) : '',
  )
  const onSubmit = async () => {
    try {
      await piggyService.updatePiggyName(name)
      await piggyService.checkObjective('piggy_edit')
      refetch()
    } catch (error) {
      console.log(error)
    }
  }
  const playAnimation = () => {
    animationRef.current?.reset()
    animationRef.current?.play()
  }

  return (
    <View className="items-center">
      <Pressable onPress={playAnimation}>
        <LottieView
          ref={animationRef}
          source={require('@/assets/lottie/Piggy Bank - Coins Out.json')}
          autoPlay={false}
          loop={false}
          style={{ width: 250, height: 250 }}
        />
      </Pressable>
      <Dialog>
        <DialogTrigger asChild>
          <Pressable>
            <Text className="text-lg font-semibold">{piggyData?.nombre}</Text>
          </Pressable>
        </DialogTrigger>
        <DialogContent className="width-[90%] max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Nombre</DialogTitle>
            <DialogDescription>
              <View
                style={{ borderBottomColor: colorHex, borderBottomWidth: 2 }}
                className="items-center justify-center w-[250px] h-[64px]"
              >
                <TextInput
                  style={{
                    color:
                      useColorScheme().colorScheme === 'dark'
                        ? 'white'
                        : 'black',
                    fontSize: 20,
                    textAlign: 'center',
                  }}
                  returnKeyType="next"
                  onChangeText={setName}
                  value={name}
                  placeholder={piggyData?.nombre}
                  placeholderTextColor={
                    useColorScheme().colorScheme === 'dark' ? 'white' : 'black'
                  }
                />
              </View>
            </DialogDescription>
          </DialogHeader>
          <View className="grid gap-4">
            <View className="grid gap-3"></View>
            <View className="grid gap-3"></View>
          </View>
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

      <Text className="text-lg font-semibold">XP: {piggyData?.xp}</Text>
      <Text className="text-lg font-semibold">Nivel: {level}</Text>
      <FlatList
        data={piggyData?.objetivos || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ItemCard
            title={`Objetivo: ${item?.objetivo.descripcion}`}
            description={`Progreso: ${((item.progreso / item?.objetivo.maxProgreso) * 100).toFixed(2)}%`}
          />
        )}
      />
    </View>
  )
}

export default Piggy
