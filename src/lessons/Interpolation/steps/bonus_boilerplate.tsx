import { AnimatedText } from "@/components/AnimatedText";
import { Container } from "@/components/Container";
import { items } from "@/lib/mock";
import { colors, layout } from "@/lib/theme";
import React from "react";
import {
  CellRendererProps,
  FlatList,
  FlatListProps,
  ListRenderItemInfo,
  StyleSheet,
  Text,
} from "react-native";
import Animated, {
  AnimatedSensor,
  Extrapolation,
  SharedValue,
  ValueRotation,
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
  const sensor = null;
  return (
    <Container style={styles.container}>
      <Text>Requires running on real device.</Text>
      <AnimatedFlatList
        data={items}
        horizontal
        CellRendererComponent={(props) => (
          <CellRenderer {...props} scrollX={scrollX} sensor={sensor} />
        )}
        contentContainerStyle={{
          gap: layout.spacing,
          paddingHorizontal: (layout.screenWidth - layout.itemSize) / 2,
          alignItems: "center",
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
type CellRendererItemProps = CellRendererProps<ItemType> & {
  scrollX: SharedValue<number>;
  sensor: AnimatedSensor<ValueRotation>;
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
            [0.9, 1, 0.9]
          ),
        },
      ],
    };
  });
  return (
    <Animated.View style={[styles.item, stylez]}>
      <Text>{item.label}</Text>
      <AnimatedText text={scrollX} label='offset: ' />
    </Animated.View>
  );
}

export function CellRenderer({
  children,
  style,
  index,
  scrollX,
  sensor,
  ...rest
}: CellRendererItemProps) {
  const stylez = useAnimatedStyle(() => {
    return {
      zIndex: interpolate(
        scrollX.value,
        [index - 1, index, index + 1],
        [0, 10000, 0]
      ),
      transform: [
        {
          perspective: layout.itemSize * 4,
        },
        {
          rotateZ: `${interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [15, 0, -15],
            Extrapolation.CLAMP
          )}deg`,
        },
      ],
    };
  });
  return (
    <Animated.View style={[style, stylez]} {...rest}>
      {children}
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
