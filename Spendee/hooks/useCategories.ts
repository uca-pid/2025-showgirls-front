import categoryService from '@/services/category.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export default function useCategories() {
  const queryClient = useQueryClient()

  const { data, isLoading, ...rest } = useQuery({
    queryFn: () => categoryService.findMany(),
    queryKey: ['categories'],
  })

  const { mutateAsync: addCategoryMutation } = useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  return {
    ...rest,
    categories: data?.data,
    isLoading,
    addCategoryMutation,
  }
}
