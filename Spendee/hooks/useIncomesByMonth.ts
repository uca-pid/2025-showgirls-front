import incomeService, {
  IncomesByMonthResponse,
} from '@/services/income.service'
import { useQuery } from '@tanstack/react-query'

export default function useIncomesByMonth(userId: string) {
  const { data, ...rest } = useQuery<IncomesByMonthResponse[]>({
    queryKey: ['incomesByMonth', userId],
    queryFn: async () => (await incomeService.findIncomesByMonth(userId)).data,
  })

  return { incomesByMonthData: data, ...rest }
}
