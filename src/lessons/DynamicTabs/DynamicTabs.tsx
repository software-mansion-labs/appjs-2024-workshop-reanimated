import { Container } from '@components/Container'
import { tabsList } from '@lib/mock'
import { hitSlop } from '@lib/reanimated'
import { colorShades, layout } from '@lib/theme'
import { memo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

type TabsProps = {
  name: string
  isActiveTabIndex: boolean
}

const Tab = memo(({ name, isActiveTabIndex }: TabsProps) => {
  return (
    <View style={styles.tab}>
      <TouchableOpacity
        hitSlop={hitSlop}
        style={{ marginHorizontal: layout.spacing }}
        onPress={() => {}}
      >
        <Text>{name}</Text>
      </TouchableOpacity>
    </View>
  )
})

// This component should receive the selected tab measurements as props
function Indicator() {
  return <Animated.View style={[styles.indicator]} />
}
export function DynamicTabsLesson({
  selectedTabIndex = 0,
  onChangeTab,
}: {
  selectedTabIndex?: number
  // Call this function when the tab changes
  // Don't forget to check if the function exists before calling it
  onChangeTab?: (index: number) => void
}) {
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
          />
        ))}
        <Indicator />
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
    bottom: 0,
    left: 0,
    width: 100,
  },
  tab: {
    marginHorizontal: layout.spacing,
  },
  scrollViewContainer: {
    paddingVertical: layout.spacing * 2,
  },
})
