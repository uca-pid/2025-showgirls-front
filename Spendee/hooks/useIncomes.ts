import incomeService from '@/services/income.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export default function useExpenses(userId: string) {
  const queryClient = useQueryClient()

  const { data, refetch, ...rest } = useQuery({
    queryKey: ['incomes'],
    queryFn: () => incomeService.findByUserId(userId),
  })

  const { mutateAsync: create } = useMutation({
    mutationFn: incomeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
    },
  })

  return { incomes: data?.data, refetch, create, ...rest }
}
