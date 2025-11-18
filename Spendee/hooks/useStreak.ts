import streakService from '@/services/streak.service'
import { useQuery } from '@tanstack/react-query'

export default function useStreak(userId: string) {
  const {
    data: streakData,
    refetch,
    isLoading,
    ...rest
  } = useQuery({
    queryKey: ['streak', userId],
    queryFn: async () => {
      const res = await streakService.findByUserId(userId)
      return res.data
    },
    enabled: !!userId,
  })
  return { streakData, refetch, isLoading, ...rest }
}
