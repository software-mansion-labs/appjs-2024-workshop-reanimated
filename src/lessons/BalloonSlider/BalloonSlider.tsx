import { Container } from "@/components/Container";
import { hitSlop } from "@/lib/reanimated";
import { colorShades, layout } from "@/lib/theme";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export function BalloonSliderLesson() {
  const x = useSharedValue(0);
  const knobScale = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .averageTouches(true)
    .onStart(() => {
      knobScale.value = withSpring(1);
    })
    .onChange((ev) => {
      x.value += ev.changeX;
    })
    .onEnd(() => {
      knobScale.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderWidth: interpolate(
        knobScale.value,
        [0, 1],
        [layout.knobSize / 2, 2],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          translateX: x.value,
        },
        {
          scale: knobScale.value + 1,
        },
      ],
    };
  });

  return (
    <Container>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.knob, animatedStyle]} hitSlop={hitSlop} />
      </GestureDetector>
    </Container>
  );
}

const styles = StyleSheet.create({
  knob: {
    width: layout.knobSize,
    height: layout.knobSize,
    borderRadius: layout.knobSize / 2,
    backgroundColor: "#fff",
    borderWidth: layout.knobSize / 2,
    borderColor: colorShades.purple.base,
    position: "absolute",
    left: -layout.knobSize / 2,
  },
});
