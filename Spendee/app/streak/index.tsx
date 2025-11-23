import Container from '@/components/Container'
import Section from '@/components/Section'
import SectionCard from '@/components/SectionCard'
import StreakButton from '@/components/StreakButton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Progress } from '@/components/ui/progress'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/context/AuthContext'
import useStreak from '@/hooks/useStreak'
import { streakAnims } from '@/lib/streakFiles'
import LottieView from 'lottie-react-native'
import { Info } from 'lucide-react-native'
import React from 'react'
import { View } from 'react-native'

const Streak = () => {
  const { user } = useAuth()
  const { streakData, isFetching } = useStreak(user?.uid ?? '')
  const currentStreak = streakData?.rachaActual ?? 0
  return (
    <Container activity={isFetching}>
      <Section className="items-center">
        <StreakButton
          streak={streakData}
          size={160}
          showStreak={false}
          speed={0.6}
        />
        <Text className="text-xl">Días de racha</Text>
        <Text className="text-4xl font-semibold">
          {streakData?.rachaActual}
        </Text>
      </Section>
      <Section>
        <SectionCard>
          <View className="flex-row items-center">
            {streakAnims.map(
              (streakAnim, index) =>
                index !== 0 && (
                  <View
                    key={index}
                    className="flex-row  items-center justify-between"
                  >
                    <View className="flex-col items-center">
                      <LottieView
                        renderMode="HARDWARE"
                        source={streakAnim.animation}
                        progress={0.39}
                        style={{ width: 45, height: 45 }}
                      />
                      <Text className="text-sm text-muted-foreground">
                        {streakAnim.days}
                      </Text>
                    </View>
                    {index !== streakAnims.length - 1 && (
                      <Progress
                        value={
                          currentStreak >= streakAnims[index + 1].days ? 100 : 0
                        }
                        className="w-6"
                        style={{ height: 4 }}
                        color={streakAnims[index + 1].color}
                        progressiveColors={false}
                      />
                    )}
                  </View>
                ),
            )}
          </View>
        </SectionCard>
        <SectionCard items="start">
          <View className="flex-row items-center gap-2">
            <Info color="gray" />
            <Text className="text-xl">Acerca de las rachas</Text>
          </View>
          <Accordion type="single" collapsible>
            <AccordionItem value="item1">
              <AccordionTrigger>
                <Text className="text-lg">¿Cómo funcionan las rachas?</Text>
              </AccordionTrigger>
              <AccordionContent className="gap-1">
                <Text className="text-base">
                  ¡Interactuá en Spendee cada día para incrementar tu racha!
                </Text>
                <Text>
                  Añadir un ingreso o un gasto por primera vez en el día
                  incrementará la racha en uno
                </Text>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <Text className="text-lg">¿Cómo consigo otras insignias?</Text>
              </AccordionTrigger>
              <AccordionContent className="gap-1">
                <Text className="text-base">
                  Las insignias de racha se actualizan al llegar a determinados
                  días consecutivos de racha
                </Text>
                <Text>¿Podrás llegar a la última?</Text>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </SectionCard>
      </Section>
    </Container>
  )
}

export default Streak
