import expenseService from '@/services/expense.service'
import { useSuspenseQuery } from '@tanstack/react-query'

export default function useExpensesByCategory(
  userId: string,
  categoryId: number,
) {
  const { data: expensesByCategory, ...rest } = useSuspenseQuery({
    queryKey: ['expenses', userId, 'category', categoryId],
    queryFn: async () => {
      if (!categoryId) return []
      const res = await expenseService.findByCategoryId(userId, categoryId)
      return res.data
    },
  })
  return { expensesByCategory, ...rest }
}
