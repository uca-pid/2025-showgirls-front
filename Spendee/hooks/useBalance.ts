import balanceService from '@/services/balance.service'
import { useQuery } from '@tanstack/react-query'

export default function useBalance(userId: string) {
  const { data, refetch, ...rest } = useQuery({
    queryKey: ['balance'],
    queryFn: () => balanceService.findByUserId(userId),
  })

  return { balance: data?.data, refetch, ...rest }
}
