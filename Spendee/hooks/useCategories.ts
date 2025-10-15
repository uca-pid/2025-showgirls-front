import categoryService, { CategoryResponse } from '@/services/category.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const defaultCategories: CategoryResponse[] = []

export default function useCategories() {
  const queryClient = useQueryClient()

  const {
    data: categoriesData = defaultCategories,
    isLoading,
    refetch,
    ...rest
  } = useQuery<CategoryResponse[]>({
    queryFn: async () => {
      const res = await categoryService.findMany()
      return res.data
    },
    queryKey: ['categories'],
    refetchOnMount: false,
  })

  const { mutateAsync: create } = useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categoriesChart'] })
    },
  })

  return { categoriesData, isLoading, refetch, create, ...rest }
}
