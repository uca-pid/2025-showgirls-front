import expenseService, { ExpenseResponse } from '@/services/expense.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const defaultExpenses: ExpenseResponse[] = []

export default function useExpenses(userId: string) {
  const queryClient = useQueryClient()

  const {
    data: expensesData = defaultExpenses,
    refetch,
    isLoading,
    ...rest
  } = useQuery<ExpenseResponse[]>({
    queryKey: ['expenses', userId],
    queryFn: async () => {
      const res = await expenseService.findByUserId(userId)
      return res.data
    },
    enabled: !!userId,
  })

  const { mutateAsync: create } = useMutation({
    mutationFn: expenseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', userId] })
    },
  })

  return { expensesData, refetch, create, isLoading, ...rest }
}
