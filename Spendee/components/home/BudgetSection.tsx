import { BudgetResponse } from '@/services/budget.service'
import { router } from 'expo-router'
import { ChevronRight } from 'lucide-react-native'
import React from 'react'
import BudgetCard from '../BudgetCard'
import Section from '../Section'
import { Text } from '../ui/text'

type BudgetSectionProps = {
  currentBudget?: BudgetResponse
}

const BudgetSection = ({ currentBudget }: BudgetSectionProps) => {
  return (
    <Section
      title="Presupuesto Actual"
      actionText="Ver más"
      actionIcon={ChevronRight}
      onActionPress={() => router.push('/budget/history')}
    >
      {currentBudget ? (
        <BudgetCard budget={currentBudget} />
      ) : (
        <Text className="text-center text-muted-foreground text-lg mt-4">
          No tenés un presupuesto activos
        </Text>
      )}
    </Section>
  )
}

export default BudgetSection
