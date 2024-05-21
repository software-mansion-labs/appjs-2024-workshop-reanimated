import { AnimatedText } from "@/components/AnimatedText";
import { Container } from "@/components/Container";
import { items } from "@/lib/mock";
import { colors, layout } from "@/lib/theme";
import React from "react";
import { ListRenderItemInfo, StyleSheet, Text, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

type ItemType = (typeof items)[0];

export function Interpolation() {
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x / (layout.itemSize + layout.spacing);
  });
  return (
    <Container style={styles.container}>
      <Animated.FlatList
        data={items}
        horizontal
        contentContainerStyle={{
          gap: layout.spacing,
          paddingHorizontal: (layout.screenWidth - layout.itemSize) / 2,
        }}
        snapToInterval={layout.itemSize + layout.spacing}
        decelerationRate={"fast"}
        renderItem={(props) => <Item {...props} scrollX={scrollX} />}
        onScroll={onScroll}
        scrollEventThrottle={1000 / 60}
      />
    </Container>
  );
}

type ItemProps = ListRenderItemInfo<ItemType> & {
  scrollX: SharedValue<number>;
};

export function Item({ item, index, scrollX }: ItemProps) {
  return (
    <View style={styles.item}>
      <Text>{item.label}</Text>
      <AnimatedText text={scrollX} label='offset: ' />
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
