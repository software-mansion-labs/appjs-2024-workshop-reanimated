import type { Contact } from '@lib/mock'
import { layout } from '@lib/theme'
import { Image, Text, View } from 'react-native'

export function ContactsListItem({ item }: { item: Contact }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: layout.spacing,
        height: layout.contactListItemHeight,
      }}
    >
      <Image
        source={{ uri: item.avatar }}
        style={{
          marginRight: layout.spacing,
          width: layout.avatarSize,
          height: layout.avatarSize,
          borderRadius: layout.avatarSize / 2,
        }}
      />
      <Text>{item.name}</Text>
    </View>
  )
}
