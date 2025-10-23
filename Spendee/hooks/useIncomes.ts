import incomeService, { IncomeResponse } from '@/services/income.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const defaultIncomes: IncomeResponse[] = []

export interface IncomeFilters {
  limit?: number
  order?: 'asc' | 'desc'
  month?: number
  year?: number
}

export default function useIncomes(
  userId: string,
  filters: IncomeFilters = {},
) {
  const queryClient = useQueryClient()

  const {
    data: incomesData = defaultIncomes,
    refetch,
    isLoading,
    ...rest
  } = useQuery<IncomeResponse[]>({
    queryKey: ['incomes', userId, filters],
    queryFn: async () => {
      const res = await incomeService.findByUserId(userId, filters)
      return res.data
    },
    enabled: !!userId,
    refetchOnMount: false,
  })

  const { mutateAsync: addIncome } = useMutation({
    mutationFn: incomeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance', userId] })
    },
  })

  return { incomesData, refetch, addIncome, isLoading, ...rest }
}
