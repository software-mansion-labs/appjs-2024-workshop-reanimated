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
    return {
      backgroundColor: interpolateColor(
        scrollX.value,
        [index - 1, index, index + 1],
        [colors.purple, colors.overlay, colors.green]
      ),
      transform: [
        {
          scale: interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            // targeting more on when the items moves more by index on the left
            // [index - 1, index, index + 1, index + 2],
            // targeting more on when the items moves more by index on the right
            // [index + 2, index - 1, index, index + 1],
            [0.9, 1, 0.9]
            // For this example, the next index+-2 will be 0.9-1 = -0.1 smaller than the current index
            // Clamp to 1 on left
            // [0.9, 1, 1],
            // Clamp to 1 on right
            // [1, 1, 0.9],
            // This is because v1 === v0 and the lerp will return the same value, this is equivalent to clamp
            // but we control more, because we can revert this for `index-3` for example.
          ),
        },
      ],
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
