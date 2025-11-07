import React from 'react'
import { View } from 'react-native'

import { ChartLineIcon, LucideIcon } from 'lucide-react-native'
import Svg, { Circle, G } from 'react-native-svg'
import { Text } from './ui/text'

type DonutSegment = {
  value: number
  segmentColor?: string
  icon?: LucideIcon
  id?: number | string
}

type DonutChartProps = {
  size?: number
  strokeWidth?: number
  data: DonutSegment[]
  centerText?: string
  centerTextColor?: string
  showIcons?: boolean
  showWhen?: boolean
}

const DonutChart: React.FC<DonutChartProps> = ({
  size = 150,
  strokeWidth = 15,
  data,
  centerText = '',
  centerTextColor = 'black',
  showIcons = true,
  showWhen = true,
}) => {
  const radius = Math.max(0, (size - strokeWidth) / 2)
  const circumference = 2 * Math.PI * radius
  const total = data.reduce((acc, d) => acc + (d.value || 0), 0)

  let cumulative = 0

  return showWhen ? (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width={size} height={size}>
        <G>
          {data.map((segment, index) => {
            const value = segment.value || 0
            const dash = (value / total) * circumference
            const gap = Math.max(0, circumference - dash)
            const strokeDashoffset = circumference - cumulative

            const circle = (
              <Circle
                key={`seg-${index}`}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={segment.segmentColor}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
                fill="none"
              />
            )

            cumulative += dash
            return circle
          })}
        </G>
      </Svg>
      {centerText && (
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}
        >
          <Text style={{ fontSize: centerText.length > 9 ? 20 : 24 }}>
            {centerText}
          </Text>
        </View>
      )}
    </View>
  ) : (
    <View className="h-[200px] items-center justify-evenly">
      <ChartLineIcon size={24} color="white" />
      <Text>No hay suficientes datos para mostrar</Text>
    </View>
  )
}

export default DonutChart
