import expenseService, { ExpenseResponse } from '@/services/expense.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const defaultExpenses: ExpenseResponse[] = []

export default function useExpenses(
  userId: string,
  limit?: number,
  order: 'asc' | 'desc' = 'asc',
) {
  const queryClient = useQueryClient()

  const {
    data: expensesData = defaultExpenses,
    refetch,
    isLoading,
    ...rest
  } = useQuery<ExpenseResponse[]>({
    queryKey: ['expenses', userId, limit, order],
    queryFn: async () => {
      const res = await expenseService.findByUserId(userId, limit, order)
      return res.data
    },
    enabled: !!userId,
  })

  const { mutateAsync: addExpense } = useMutation({
    mutationFn: (body: any): any => {
      expenseService.create(body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', userId] })
      queryClient.invalidateQueries({
        queryKey: ['expenses', userId, limit, order],
      })
      queryClient.invalidateQueries({
        queryKey: ['expensesByCategory', userId],
      })
      queryClient.invalidateQueries({ queryKey: ['balance', userId] })
      queryClient.invalidateQueries({ queryKey: ['categoriesChart'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const { mutateAsync: deleteExpense } = useMutation({
    mutationFn: (expenseId: number) => expenseService.deleteExpense(expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', userId] })
      queryClient.invalidateQueries({
        queryKey: ['expenses', userId, limit, order],
      })
      queryClient.invalidateQueries({
        queryKey: ['expensesByCategory', userId],
      })
      queryClient.invalidateQueries({ queryKey: ['balance', userId] })
      queryClient.invalidateQueries({ queryKey: ['categoriesChart'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  return {
    expensesData,
    refetch,
    addExpense,
    deleteExpense,
    isLoading,
    ...rest,
  }
}
