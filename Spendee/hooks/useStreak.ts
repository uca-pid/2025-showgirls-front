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
    queryFn: () => streakService.findByUserId(userId),
    enabled: !!userId,
  })
  return { streakData, refetch, isLoading, ...rest }
}
