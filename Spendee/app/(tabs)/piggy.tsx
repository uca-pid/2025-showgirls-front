import Container from '@/components/Container'
import ItemCard from '@/components/ItemCard'
import SectionCard from '@/components/SectionCard'
import { Badge } from '@/components/ui/badge'
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
import { AnimatedCircularProgress } from 'react-native-circular-progress'

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
  const xp = piggyData?.xp || 0
  const xpForNextLevel = (level + 1) * 5 - xp

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
      <View className="flex-1 items-center">
        <Pressable onPress={playAnimation}>
          <LottieView
            ref={animationRef}
            source={require('@/assets/lottie/Piggy Bank - Coins Out.json')}
            autoPlay={false}
            loop={false}
            style={{
              width: 250,
              height: 250,
              transform: [{ translateY: -50 }],
              position: 'relative',
              alignSelf: 'center',
            }}
            resizeMode="contain"
          />
        </Pressable>
        <View className="mt-6 mb-4 gap-2 absolute top-40 items-center">
          <PiggyNameDialog
            piggyName={piggyData?.nombre}
            changePiggyNameFn={changePiggyName}
          />
          <Badge variant="outline">
            <Text className="text-base" numberOfLines={1}>
              Nivel: {level}
            </Text>
          </Badge>
          <Text className="text-muted-foreground" numberOfLines={1}>
            {xpForNextLevel == 1
              ? 'Completá 1 objetivo para subir de nivel'
              : `Completá ${xpForNextLevel} objetivos para subir de nivel`}
          </Text>
        </View>
        <FlatList
          className="mt-6"
          scrollEnabled={false}
          data={piggyData?.objetivos || []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <SectionCard
              items="center"
              className="gap-[5px] p-3 mt-3"
              flex="row"
              justify="between"
            >
              <View className="flex-1 mr-4">
                <Text
                  className="text-lg text-muted-foreground ml-2"
                  numberOfLines={2}
                >
                  {item.objetivo.descripcion}
                </Text>
              </View>
              <View className="items-center gap-2">
                <AnimatedCircularProgress
                  fill={(item.progreso / item?.objetivo.maxProgreso) * 100}
                  size={60}
                  width={10}
                  rotation={270}
                  tintColor="#16a34a"
                  backgroundColor="#FFFFFF20"
                  lineCap="round"
                  children={() => (
                    <Text
                      className={'text-green-600 text-md'}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {(
                        (item.progreso / item?.objetivo.maxProgreso) *
                        100
                      ).toFixed(0)}
                      %
                    </Text>
                  )}
                />
              </View>
            </SectionCard>
          )}
        />
      </View>
    </Container>
  )
}

const PiggyNameDialog = ({
  piggyName,
  changePiggyNameFn,
}: PiggyNameDialogProps) => {
  const { colorHex } = useThemeColor()
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

export default Piggy
