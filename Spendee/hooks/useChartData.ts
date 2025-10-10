// hooks/useChartData.ts
import categoryService from '@/services/category.service'
import { useQuery } from '@tanstack/react-query'
import {
  BookOpen,
  Bus,
  Ellipsis,
  Gamepad2,
  Heart,
  House,
  LucideIcon,
  Paperclip,
  Popcorn,
  Shield,
  Shuffle,
  Sigma,
  Sprout,
  Sun,
  TestTube,
  TreePalm,
  Users,
  Utensils,
  Wine,
  Wrench,
} from 'lucide-react-native'

const iconNameToEmoji: Record<string, LucideIcon> = {
  bus: Bus,
  utensils: Utensils,
  home: House,
  heart: Heart,
  gamepad: Gamepad2,
  book: BookOpen,
  Wrench: Wrench,
  Wine: Wine,
  Sprout: Sprout,
  Users: Users,
  TreePalm: TreePalm,
  TestTube: TestTube,
  Sun: Sun,
  Sigma: Sigma,
  Popcorn: Popcorn,
  Shuffle: Shuffle,
  Shield: Shield,
  Paperclip: Paperclip,
  '': Ellipsis,
  'ellipsis-h': Ellipsis,
}

export interface ChartData {
  value: number
  segmentColor: string
  icon: LucideIcon
}

export default function useChartData() {
  const {
    data: chartData = [],
    isLoading,
    refetch,
    ...rest
  } = useQuery<ChartData[]>({
    queryKey: ['categoriesChart'],
    queryFn: async () => {
      const res = await categoryService.findMany()
      return res.data.map((item: any) => ({
        value: Number(item.totalGastos ?? 0),
        segmentColor: item.color ?? '#000000',
        icon: iconNameToEmoji[item.icono] || Ellipsis,
      }))
    },
    refetchOnMount: false,
  })

  return { chartData, isLoading, refetch, ...rest }
}
