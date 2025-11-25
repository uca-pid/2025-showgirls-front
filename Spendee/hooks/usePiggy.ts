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
  const updateAvatar = async (avatarId: number) => {
    await piggyService.updateAvatar(avatarId)
    await refetch()
  }
  const level = piggyData ? Math.floor(piggyData.xp / 5) : 1

  return { piggyData, level, refetch, isLoading, ...rest, updateAvatar }
}
