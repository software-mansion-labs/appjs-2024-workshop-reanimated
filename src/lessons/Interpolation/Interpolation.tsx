import { Container } from "@/components/Container";
import { items } from "@/lib/mock";
import { colors, layout } from "@/lib/theme";
import React from "react";
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from "react-native";

type ItemType = (typeof items)[0];

export function Interpolation() {
  return (
    <Container style={styles.container}>
      <FlatList
        data={items}
        horizontal
        contentContainerStyle={{
          gap: layout.spacing,
          // We are creating horizontal spacing to align the list in the center
          // We don't subtract the spacing here because gap is not applied to the
          // first item on the left and last item on the right.
          paddingHorizontal: (layout.screenWidth - layout.itemSize) / 2,
        }}
        // We can't use pagingEnabled because the item is smaller than the viewport width
        // in our case itemSize and we add the spacing because we have the gap
        // added between the items in the contentContainerStyle
        snapToInterval={layout.itemSize + layout.spacing}
        // This is to snap faster to the closest item
        decelerationRate={"fast"}
        renderItem={(props) => <Item {...props} />}
      />
    </Container>
  );
}

type ItemProps = ListRenderItemInfo<ItemType> & {};

export function Item({ item, index }: ItemProps) {
  return (
    <View style={styles.item}>
      <Text>{item.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    width: layout.itemSize,
    height: layout.itemSize * 1.67,
    borderRadius: layout.radius,
    justifyContent: "flex-end",
    padding: layout.spacing,
    backgroundColor: colors.overlay,
  },
  container: {
    padding: 0,
  },
});
