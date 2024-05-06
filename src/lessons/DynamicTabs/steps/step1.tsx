import { Container } from '@components/Container'
import { tabsList } from '@lib/mock'
import { hitSlop } from '@lib/reanimated'
import { colorShades, layout } from '@lib/theme'
import { memo, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import Animated, {
  measure,
  runOnJS,
  runOnUI,
  SharedValue,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import type { MeasuredDimensions } from 'react-native-reanimated/src/reanimated2/commonTypes'

type TabsProps = {
  name: string
  onActive: (measurements: MeasuredDimensions) => void
  isActiveTabIndex: boolean
}

const Tab = memo(({ onActive, name, isActiveTabIndex }: TabsProps) => {
  const tabRef = useAnimatedRef<View>()
  const sendMeasurements = () => {
    runOnUI(() => {
      'worklet'
      const measurements = measure(tabRef)
      runOnJS(onActive)(measurements)
    })()
  }

  useEffect(() => {
    // Send measurements when the active tab changes. This callback is necessary
    // because we need the tab measurements in order to animate the indicator
    // and the position of the scroll
    if (isActiveTabIndex) {
      sendMeasurements()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActiveTabIndex])

  return (
    <View
      style={styles.tab}
      ref={tabRef}
      onLayout={() => {
        // This is needed because we can't send the initial render measurements
        // without hooking into `onLayout`.
        if (isActiveTabIndex) {
          sendMeasurements()
        }
      }}
    >
      <TouchableOpacity
        onPress={sendMeasurements}
        hitSlop={hitSlop}
        style={{ marginHorizontal: layout.spacing }}
      >
        <Text>{name}</Text>
      </TouchableOpacity>
    </View>
  )
})

function Indicator({
  selectedTabMeasurements,
}: {
  selectedTabMeasurements: SharedValue<MeasuredDimensions | null>
}) {
  const stylez = useAnimatedStyle(() => {
    if (!selectedTabMeasurements?.value) {
      return {}
    }

    const { x, width } = selectedTabMeasurements.value

    return {
      left: withTiming(x),
      bottom: 0,
      width: withTiming(width),
    }
  })

  return <Animated.View style={[styles.indicator, stylez]} />
}
export function DynamicTabsLesson({
  selectedTabIndex = 0,
  onChangeTab,
}: {
  selectedTabIndex?: number
  onChangeTab?: (index: number) => void
}) {
  const tabMeasurements = useSharedValue<MeasuredDimensions | null>(null)

  return (
    <Container>
      <ScrollView
        horizontal
        style={{ flexGrow: 0 }}
        contentContainerStyle={styles.scrollViewContainer}
      >
        {tabsList.map((tab, index) => (
          <Tab
            key={`tab-${tab}-${index}`}
            name={tab}
            isActiveTabIndex={index === selectedTabIndex}
            onActive={(measurements) => {
              tabMeasurements.value = measurements
            }}
          />
        ))}
        <Indicator selectedTabMeasurements={tabMeasurements} />
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    backgroundColor: colorShades.purple.base,
    height: 4,
    borderRadius: 2,
  },
  tab: {
    marginHorizontal: layout.spacing,
  },
  scrollViewContainer: {
    paddingVertical: layout.spacing * 2,
  },
})
