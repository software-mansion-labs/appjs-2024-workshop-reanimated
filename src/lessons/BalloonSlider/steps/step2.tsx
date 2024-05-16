import { Container } from "@/components/Container";
import { clamp, hitSlop } from "@/lib/reanimated";
import { colorShades, layout } from "@/lib/theme";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export function BalloonSliderLesson() {
  const x = useSharedValue(0);
  const knobScale = useSharedValue(1);

  const tapGesture = Gesture.Tap()
    .maxDuration(100000)
    .onStart(() => {
      knobScale.value = withSpring(1);
    })
    .onEnd(() => {
      knobScale.value = withSpring(0);
    });

  const aRef = useAnimatedRef<View>();

  const panGesture = Gesture.Pan()
    .averageTouches(true)
    .onChange((ev) => {
      const size = measure(aRef);
      x.value = clamp((x.value += ev.changeX), 0, size.width);
    })
    .onEnd(() => {
      knobScale.value = withSpring(1);
    });
  const gestures = Gesture.Simultaneous(tapGesture, panGesture);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderWidth: interpolate(
        knobScale.value,
        [0, 1],
        [layout.knobSize / 2, 2],
        Extrapolate.CLAMP
      ),
      transform: [
        {
          translateX: x.value,
        },
        {
          scale: knobScale.value,
        },
      ],
    };
  });

  return (
    <Container>
      <GestureDetector gesture={gestures}>
        <View ref={aRef} style={styles.slider} hitSlop={hitSlop}>
          <Animated.View style={[styles.progress, { width: x }]} />
          <Animated.View style={[styles.knob, animatedStyle]} />
        </View>
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
  slider: {
    width: "80%",
    backgroundColor: colorShades.purple.light,
    height: 5,
    justifyContent: "center",
  },
  textContainer: {
    width: 40,
    height: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorShades.purple.base,
    position: "absolute",
    top: -layout.knobSize,
  },
  balloon: {
    alignItems: "center",
    justifyContent: "center",
    width: 4,
    height: layout.indicatorSize,
    bottom: -layout.knobSize / 2,
    borderRadius: 2,
    backgroundColor: colorShades.purple.base,
    position: "absolute",
  },
  progress: {
    height: 5,
    backgroundColor: colorShades.purple.dark,
    position: "absolute",
  },
});
