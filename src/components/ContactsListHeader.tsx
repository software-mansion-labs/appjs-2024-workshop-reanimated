import { layout } from '@lib/theme'
import { Text, View } from 'react-native'

export function ContactsListHeader({ title }: { title: string }) {
  return (
    <View style={{ height: layout.contactListSectionHeaderHeight }}>
      <Text
        style={{
          fontSize: 42,
          fontWeight: '900',
        }}
      >
        {title}
      </Text>
    </View>
  )
}
