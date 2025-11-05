import budgetService, { BudgetGroupResponse } from '@/services/budget.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export default function useBudgets(usuarioId: string) {
  const queryClient = useQueryClient()

  function onMutationSuccess() {
    queryClient.invalidateQueries({ queryKey: ['budgets', usuarioId] })
  }

  const {
    data: budgetsData,
    isLoading,
    refetch,
    ...rest
  } = useQuery<BudgetGroupResponse>({
    queryKey: ['budgets', usuarioId],
    queryFn: async () => {
      const res = await budgetService.getBudget(usuarioId)
      return res.data
    },
    refetchOnMount: false,
  })
  const { mutateAsync: addBudget } = useMutation({
    mutationFn: (body: any) => budgetService.createBudget(body),
    onSuccess: onMutationSuccess,
  })
  return {
    futureBudgets: budgetsData?.futureBudgets,
    currentBudget: budgetsData?.currentBudget,
    pastBudgets: budgetsData?.pastBudgets,
    isLoading,
    refetch,
    addBudget,
    ...rest,
  }
}
