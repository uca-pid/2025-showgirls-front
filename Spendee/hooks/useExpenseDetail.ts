import expenseService, { ExpenseResponse } from '@/services/expense.service'
import { useQuery } from '@tanstack/react-query'

const defaultExpense: ExpenseResponse = {
  id: 0,
  gasto: 0,
  montoAnterior: 0,
  fecha: new Date(),
  categoriaId: 0,
  usuarioId: '',
}

export default function useExpenseDetail(expenseId: number) {
  const {
    data: expenseDetailData = defaultExpense,
    refetch,
    isLoading,
    ...rest
  } = useQuery<ExpenseResponse>({
    queryKey: ['expenseDetail', expenseId],
    queryFn: async () => {
      const res = await expenseService.findByExpenseId(expenseId)
      return res.data
    },
    enabled: !!expenseId,
    refetchOnMount: false,
  })

  return { expenseDetailData, refetch, isLoading, ...rest }
}
