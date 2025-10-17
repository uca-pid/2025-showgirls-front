import incomeService, { IncomeResponse } from '@/services/income.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const defaultIncomes: IncomeResponse[] = []

export default function useIncomes(userId: string) {
  const queryClient = useQueryClient()

  const {
    data: incomesData = defaultIncomes,
    refetch,
    isLoading,
    ...rest
  } = useQuery<IncomeResponse[]>({
    queryKey: ['incomes', userId],
    queryFn: async () => {
      const res = await incomeService.findByUserId(userId)
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
