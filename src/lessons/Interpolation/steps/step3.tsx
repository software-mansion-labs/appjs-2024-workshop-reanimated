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
    scrollX.value =
      Math.round(e.contentOffset.x) / (layout.itemSize + layout.spacing);
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
    // Next Position, Current Position, Previous Position
    // Slide from right to left, -, Slide from left to right
    // Right, Center, Left
    // Current item is moving to the left -> increasing the index (index + 1)
    // Current item is moving to the right -> decreasing the index (index -1)
    // This is the position of the current slide relative to the entire list of items and the
    // interval when the item might be visible on the screen, that's why
    // we target it. If, for example, that there are 5 possible items on the screen
    // and you want to apply a different style to the current item, you would target
    // the index+-2 as well and, in case you don't target index+-2, the interpolation
    // will estimate the value for this range (we call this Extrapolate.EXTEND)
    // v0 + t * (v1 - v0) where:
    // v0 - prev value (value at index -+ 1)
    // v1 - next value (value at index -+ 2)
    // t - scrollX value
    // If you are interested in just the current domain, even if the scrollX value or `t` moves
    // outside of it, you can Extrapolate.CLAMP the interpolation and this will stick with the last v0 value
    // making v1 = v0 so, in other words, v0 + t * (v1 - v0) = v0 + t * (v0 - v0) = v0 + 0 = v0
    // [index - 1, index, index + 1],
    return {
      opacity: interpolate(
        scrollX.value,
        [index - 1, index, index + 1],
        [0.75, 1, 0.75]
      ),
      backgroundColor: interpolateColor(
        scrollX.value,
        [index - 1, index, index + 1],
        [colors.blue, colors.overlay, colors.green]
      ),
    };
  });
  return (
    <Animated.View style={[styles.item, stylez]}>
      <Text>{item.label}</Text>
      <AnimatedText text={scrollX} />
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
