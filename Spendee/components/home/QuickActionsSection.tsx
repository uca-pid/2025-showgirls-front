import { router } from 'expo-router'
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  PiggyBank,
} from 'lucide-react-native'
import React from 'react'
import { FlatList } from 'react-native'
import IconButton from '../IconButton'
import Section from '../Section'
import SectionCard from '../SectionCard'

const actions = [
  {
    text: 'Ingreso',
    icon: BanknoteArrowUp,
    onPress: () => {
      router.push('/income/modal/add')
    },
  },
  {
    text: 'Egreso',
    icon: BanknoteArrowDown,
    onPress: () => {
      router.push('/expense/modal/add')
    },
  },
  {
    text: 'Presupuesto',
    icon: PiggyBank,
    onPress: () => {
      router.push('/budget/modal/add')
    },
  },
]

export default function QuickActionsSection() {
  return (
    <Section
      title="Acciones Rápidas"
      /*actionIcon={Pencil}
        actionText="Editar"
        onActionPress={() => {}}*/
    >
      <SectionCard flex="row">
        <FlatList
          contentContainerStyle={{ justifyContent: 'space-between' }}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={actions}
          renderItem={({ item }) => (
            <IconButton
              text={item.text}
              icon={item.icon}
              onPress={item.onPress}
            />
          )}
        />
      </SectionCard>
    </Section>
  )
}
