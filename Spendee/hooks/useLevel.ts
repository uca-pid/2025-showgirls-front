import levelService from '@/services/level.service'
import { useQuery } from '@tanstack/react-query'

export default function useLevel(userId: string) {
  const {
    data: levelData,
    refetch,
    isLoading,
    ...rest
  } = useQuery({
    queryKey: ['level', userId],
    queryFn: async () => {
      const res = await levelService.findByUserId(userId)
      return res.data
    },
    enabled: !!userId,
  })
  const { data: objectiveData } = useQuery({
    queryKey: ['levelObjective', levelData?.level],
    queryFn: async () => {
      const res = await levelService.findObjectiveByLevelId(
        levelData?.level.toString() || '',
      )
      return res.data
    },
    enabled: levelData?.level !== undefined,
  })
  return { levelData, objectiveData, refetch, isLoading, ...rest }
}
