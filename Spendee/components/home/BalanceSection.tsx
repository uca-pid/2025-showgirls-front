import { Text } from '@/components/ui/text'
import { formatCurrency } from '@/lib/helpers/formatCurency'
import { BalanceResponse } from '@/services/balance.service'
import { router } from 'expo-router'
import React from 'react'
import { Pressable, View } from 'react-native'
import AvatarPic from '../AvatarPic'
import Section from '../Section'
import SectionCard from '../SectionCard'
import { Skeleton } from '../ui/skeleton'

type BalanceSectionProps = {
  balanceData: BalanceResponse
}

export default function BalanceSection({ balanceData }: BalanceSectionProps) {
  if (balanceData === undefined) {
    return (
      <Section>
        <SectionCard>
          <View>
            <Skeleton />
            <Skeleton />
          </View>

          <Skeleton />
        </SectionCard>
      </Section>
    )
  } else {
    return (
      <Section>
        <SectionCard justify="between" flex="row">
          <View>
            <Pressable onPress={() => router.push('/movements')}>
              <Text className="text-muted-foreground">Tu balance</Text>
              <Text
                className={
                  balanceData.balance.toString().length > 6
                    ? 'text-3xl'
                    : balanceData.balance.toString.length > 8
                      ? 'text-2xl'
                      : 'text-4xl'
                }
                numberOfLines={1}
              >
                $ {formatCurrency(balanceData.balance, 0, 2)}
              </Text>
            </Pressable>
          </View>
          <AvatarPic />
        </SectionCard>
      </Section>
    )
  }
}
