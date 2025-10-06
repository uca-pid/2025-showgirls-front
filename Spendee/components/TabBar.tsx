import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Home, LucideIcon, User } from 'lucide-react-native'
import { View, TouchableOpacity, Pressable } from 'react-native'
import { Text } from '@/components/ui/text'
import React from 'react'

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const icons: Record<string, LucideIcon> = {
    index: Home,
    'profile/index': User,
  }
  return (
    <View className="flex-row absolute justify-between items-center bg-black bottom-0 rounded-[30px] shadow-color: #000 shadow-offset: {width: 0, height: 10} py-[10px] m-10 ">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name
        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params)
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          })
        }

        return (
          <Pressable
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            className="flex-1 justify-center items-center gap-1"
          >
            {React.createElement(icons[route.name], {
              color: isFocused ? '#F9A8D4' : '#fff',
            })}
            <Text className={isFocused ? 'text-pink-300' : 'text-white'}>
              {label.toString()}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
