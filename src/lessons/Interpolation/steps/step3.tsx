import { AnimatedText } from "@/components/AnimatedText";
import { Container } from "@/components/Container";
import { items } from "@/lib/mock";
import { colors, layout } from "@/lib/theme";
import React from "react";
import {
  FlatList,
  FlatListProps,
  ListRenderItemInfo,
  StyleSheet,
  Text,
} from "react-native";
import Animated, {
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type ItemType = (typeof items)[0];
const AnimatedFlatList =
  Animated.createAnimatedComponent<FlatListProps<ItemType>>(FlatList);

export function Interpolation() {
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x / (layout.itemSize + layout.spacing);
  });
  return (
    <Container style={styles.container}>
      <AnimatedFlatList
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
  const stylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollX.value,
        [index - 1, index, index + 1],
        [0.75, 1, 0.75]
      ),
      backgroundColor: interpolateColor(
        scrollX.value,
        [index - 1, index, index + 1],
        [colors.purple, colors.overlay, colors.green]
      ),
    };
  });
  return (
    <Animated.View style={[styles.item, stylez]}>
      <Text>{item.label}</Text>
      <AnimatedText text={scrollX} label='offset: ' />
    </Animated.View>
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
