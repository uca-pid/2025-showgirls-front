import expenseService from '@/services/expense.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export default function useExpenses(userId: string) {
  const queryClient = useQueryClient()

  const { data, refetch, ...rest } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => expenseService.findByUserId(userId),
  })

  const { mutateAsync: create } = useMutation({
    mutationFn: expenseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
  })

  return { expenses: data?.data, refetch, create, ...rest }
}
