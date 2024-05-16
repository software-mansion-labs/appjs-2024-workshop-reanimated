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
          paddingHorizontal: (layout.screenWidth - layout.itemSize) / 2,
        }}
        snapToInterval={layout.itemSize + layout.spacing}
        decelerationRate={"fast"}
        renderItem={(props) => <Item {...props} />}
      />
    </Container>
  );
}

export function Item({ item, index }: ListRenderItemInfo<ItemType>) {
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
