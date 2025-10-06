import React from 'react'
import { View, Text } from 'react-native'
import Svg, { G, Circle } from 'react-native-svg'

type IconType = React.ComponentType<{ size?: number; color?: string }>

type DonutSegment = {
  value: number
  categoryColor?: string
  icon?: IconType
}

type DonutChartProps = {
  size?: number
  strokeWidth?: number
  data: DonutSegment[]
  centerText?: string
  showIcons?: boolean
}

const DonutChart: React.FC<DonutChartProps> = ({
  size = 150,
  strokeWidth = 15,
  data,
  centerText = '',
  showIcons = true,
}) => {
  const radius = Math.max(0, (size - strokeWidth) / 2)
  const circumference = 2 * Math.PI * radius
  const total = data.reduce((acc, d) => acc + (d.value || 0), 0)
  if (total <= 0) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} />
        {centerText ? (
          <View
            style={{
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {centerText}
            </Text>
          </View>
        ) : null}
      </View>
    )
  }
  let cumulative = 0
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
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
                stroke={segment.categoryColor ?? '#000'}
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
      {centerText ? (
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{centerText}</Text>
        </View>
      ) : null}
    </View>
  )
}

export default DonutChart
