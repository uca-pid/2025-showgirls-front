import piggyService from '@/services/piggy.service'
import { useQuery } from '@tanstack/react-query'

export default function usePiggy() {
  const {
    data: piggyData,
    refetch,
    isLoading,
    ...rest
  } = useQuery({
    queryKey: ['piggy'],
    queryFn: async () => {
      const res = await piggyService.findByUserId()
      return res.data
    },
  })

  return { piggyData, refetch, isLoading, ...rest }
}
