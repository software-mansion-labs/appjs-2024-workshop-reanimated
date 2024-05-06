import type { ReactNode } from 'react'
import { SafeAreaView, StyleProp, ViewStyle } from 'react-native'

import { layout } from '../lib/theme'

export function Container({
  children,
  style,
  centered = true,
}: {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  centered?: boolean
}) {
  return (
    <SafeAreaView
      style={[
        {
          flex: 1,
          padding: layout.spacing,
        },
        centered && { justifyContent: 'center', alignItems: 'center' },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  )
}
