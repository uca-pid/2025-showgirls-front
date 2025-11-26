import categoryService, { CategoryResponse } from '@/services/category.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface CategoryFilters {
  month?: number
  year?: number
}

const defaultCategories: CategoryResponse[] = []

export default function useCategories(filters?: CategoryFilters) {
  const queryClient = useQueryClient()

  const {
    data: categoriesData = defaultCategories,
    isLoading,
    refetch,
    ...rest
  } = useQuery<CategoryResponse[]>({
    queryKey: ['categories', filters?.month, filters?.year],
    queryFn: async () => {
      const res = await categoryService.findMany(filters)
      return res.data
    },
    refetchOnMount: false,
  })

  const { mutateAsync: addCategory } = useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['expenseDetail'],
        exact: false,
      })
      queryClient.invalidateQueries({ queryKey: ['expenses'], exact: false })
      queryClient.invalidateQueries({
        queryKey: ['expensesByCategory'],
        exact: false,
      })
      queryClient.invalidateQueries({ queryKey: ['categories'], exact: false })
      queryClient.invalidateQueries({
        queryKey: ['categoriesChart'],
        exact: false,
      })
      queryClient.invalidateQueries({ queryKey: ['balance'], exact: false })
    },
  })
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['expenseDetail'], exact: false })
    queryClient.invalidateQueries({ queryKey: ['expenses'], exact: false })
    queryClient.invalidateQueries({ queryKey: ['expensesByCategory'], exact: false })
    queryClient.invalidateQueries({ queryKey: ['categories'], exact: false })
    queryClient.invalidateQueries({ queryKey: ['categoriesChart'], exact: false })
    queryClient.invalidateQueries({ queryKey: ['balance'], exact: false })
  }

  const { mutateAsync: deleteCategory } = useMutation({
    mutationFn: categoryService.delete,
    onSuccess: () => {
      invalidateAll()
    },
  })

  const { mutateAsync: updateCategory } = useMutation({
    mutationFn: (args: {
      id: number
      body: { categoria: string; descripcion: string; icono: string; color: string }
    }) => categoryService.update(args.id, args.body),
    onSuccess: () => {
      invalidateAll()
    },
  })

  return {
    categoriesData,
    isLoading,
    refetch,
    addCategory,
    deleteCategory,
    updateCategory,
    ...rest,
  }
}
