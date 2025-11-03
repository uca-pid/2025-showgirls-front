import { View } from 'react-native'
import { Text } from '@/components/ui/text'
import React from 'react'
import Section from '@/components/Section'
import { ChevronRight } from 'lucide-react-native'

import SectionCard from '@/components/SectionCard'
import { Progress } from '@/components/ui/progress'
import { router } from 'expo-router'
import Container from '@/components/Container'

const Budget = () => {
  return (
    <Container>
      <Section title="Presupuesto Actual">
        <SectionCard onPress={() => router.push('/budget')}>
          <Progress value={50} />
        </SectionCard>
      </Section>
      <Section
        title="Historial"
        actionText="Añadir presupuesto"
        actionIcon={ChevronRight}
        onActionPress={() => router.push('/budget/modal/add')}
      >
        <SectionCard></SectionCard>
      </Section>
    </Container>
  )
}

export default Budget
