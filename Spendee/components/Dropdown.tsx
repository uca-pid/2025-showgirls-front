import { Text } from '@/components/ui/text'
import { useFocusEffect } from '@react-navigation/native'
import { BlurView } from 'expo-blur'
import {
  ChevronDown,
  ChevronUp,
  CircleEllipsis,
  Ellipsis,
  LucideIcon,
} from 'lucide-react-native'
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { Icon } from './ui/icon'

type OptionItem = {
  value: string
  label: string
  icon?: LucideIcon
  onPress?: () => void
  destructive?: boolean
}

export interface DropdownRef {
  close: () => void
}

interface DropDownProps {
  data: OptionItem[]
  onChange: (item: OptionItem) => void
  placeholder?: string
  type?: 'button' | 'select'
  iconSize?: number
  width?: number | `${number}%`
  onClose?: () => void
}

const Dropdown = forwardRef<DropdownRef, DropDownProps>(
  (
    {
      data,
      onChange,
      placeholder = '',
      type = 'select',
      iconSize = 24,
      width,
      onClose,
    },
    ref,
  ) => {
    const [expanded, setExpanded] = useState(false)
    const [value, setValue] = useState('')
    const buttonRef = useRef<View>(null)

    const [position, setPosition] = useState({
      top: 0,
      left: 0,
      width: '100%' as number | `${number}%`,
    })

    useFocusEffect(
      useCallback(() => {
        return () => {
          if (expanded) closeDropdown()
        }
      }, [expanded]),
    )

    const scaleAnim = useRef(new Animated.Value(0.9)).current
    const opacityAnim = useRef(new Animated.Value(0)).current

    useImperativeHandle(ref, () => ({
      close: () => closeDropdown(),
    }))

    const openDropdown = () => {
      buttonRef.current?.measure((x, y, buttonWidth, height, pageX, pageY) => {
        const dropdownWidth = typeof width === 'number' ? width : buttonWidth
        const screenWidth = Dimensions.get('window').width
        let leftPos = pageX

        if (pageX + dropdownWidth > screenWidth) {
          leftPos = pageX + buttonWidth - dropdownWidth
        }

        setPosition({
          top: pageY + height + (Platform.OS === 'android' ? -32 : 4),
          left: leftPos,
          width: width ?? buttonWidth,
        })

        scaleAnim.setValue(0.9)
        opacityAnim.setValue(0)

        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 120,
            useNativeDriver: true,
          }),
        ]).start()
      })
      setExpanded(true)
    }

    const closeDropdown = () => {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setExpanded(false)
        onClose?.()
      })
    }

    const onSelect = useCallback(
      (item: OptionItem) => {
        setValue(item.label)
        onChange(item)
        closeDropdown()
      },
      [onChange],
    )

    return (
      <View ref={buttonRef} style={{ width: 20 }}>
        {type === 'select' ? (
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={expanded ? closeDropdown : openDropdown}
          >
            <Text style={styles.text}>{value || placeholder}</Text>
            {expanded ? (
              <ChevronUp size={20} color="gray" />
            ) : (
              <ChevronDown size={20} color="gray" />
            )}
          </TouchableOpacity>
        ) : (
          <CircleEllipsis
            onPress={expanded ? closeDropdown : openDropdown}
            size={iconSize}
            color="gray"
          />
        )}

        {expanded && (
          <Modal visible transparent animationType="none">
            <TouchableWithoutFeedback onPress={closeDropdown}>
              <View style={styles.backdrop}>
                <Animated.View
                  style={{
                    position: 'absolute',
                    top: position.top,
                    left: position.left,
                    width: position.width,
                    opacity: opacityAnim,
                    transform: [{ scale: scaleAnim }],
                  }}
                >
                  <FlatList
                    data={data}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item, index }) => (
                      <View
                        className={`${index === data.length - 1 ? '' : 'border-b-[0.3px]'} border-gray-600 ${index === 0 ? 'rounded-t-[8px]' : index === data.length - 1 ? 'rounded-b-[8px]' : ''} overflow-hidden`}
                      >
                        <BlurView
                          experimentalBlurMethod="dimezisBlurView"
                          intensity={100}
                          tint="default"
                          style={styles.options}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              type === 'select'
                                ? onSelect(item)
                                : item.onPress && item.onPress()
                            }}
                            className="flex-row gap-4 items-center content-center py-1 justify-between"
                          >
                            <Text
                              className={`font-light ${
                                item.destructive ? 'text-red-700' : ''
                              }`}
                            >
                              {item.label}
                            </Text>
                            <Icon
                              as={item.icon || Ellipsis}
                              size={18}
                              color={item.destructive ? '#b91c1c' : 'white'}
                            />
                          </TouchableOpacity>
                        </BlurView>
                      </View>
                    )}
                  />
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </View>
    )
  },
)

export default Dropdown

const styles = StyleSheet.create({
  button: {
    height: 48,
    backgroundColor: '#171717',
    borderRadius: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: { fontSize: 15, color: '#fff' },
  backdrop: { flex: 1 },
  options: { backgroundColor: 'transparent', padding: 10 },
})
