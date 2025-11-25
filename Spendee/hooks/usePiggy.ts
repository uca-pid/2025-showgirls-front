import piggyService from '@/services/piggy.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export default function usePiggy() {
  const queryClient = useQueryClient()
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

  const { mutateAsync: changePiggyName } = useMutation({
    mutationFn: async (body: any) => await piggyService.updatePiggyName(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['piggy'] }),
  })

  const updateAvatar = async (avatarId: number) => {
    await piggyService.updateAvatar(avatarId)
    await refetch()
  }
  const level = piggyData ? Math.floor(piggyData.xp / 5) : 1

  return {
    piggyData,
    level,
    refetch,
    isLoading,
    changePiggyName,
    updateAvatar,
    ...rest,
  }
}
