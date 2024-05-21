import { ContactsListHeader } from "@/components/ContactsListHeader";
import { ContactsListItem } from "@/components/ContactsListItem";
import { Container } from "@/components/Container";
import { alphabet, contacts } from "@/lib/mock";
import { hitSlop } from "@/lib/reanimated";
import { colorShades, layout } from "@/lib/theme";
import { useMemo } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import sectionListGetItemLayout from "react-native-section-list-get-item-layout";

type AlphabetLetterProps = {
  index: number;
  letter: string;
};

const AlphabetLetter = ({ index, letter }: AlphabetLetterProps) => {
  return (
    <Animated.View
      style={[
        {
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        },
      ]}>
      <Animated.Text
        style={[
          {
            position: "absolute",
            fontFamily: "Menlo",
            left: -20,
            fontWeight: "900",
          },
        ]}>
        {letter.toUpperCase()}
      </Animated.Text>
    </Animated.View>
  );
};

export function ScrollAnimationLesson() {
  const y = useSharedValue(0);
  const isInteracting = useSharedValue(false);
  const knobScale = useDerivedValue(() => {
    return withSpring(isInteracting.value ? 1 : 0);
  });

  const getItemLayout = useMemo(() => {
    return sectionListGetItemLayout({
      getItemHeight: () => layout.contactListItemHeight,
      getSectionHeaderHeight: () => layout.contactListSectionHeaderHeight,
    });
  }, []);

  const panGesture = Gesture.Pan()
    .averageTouches(true)
    .onBegin(() => {
      isInteracting.value = true;
    })
    .onChange((ev) => {
      // take into account the knob size
      y.value += ev.changeY;
    })
    .onEnd(() => {
      y.value = withSpring(0);
    })
    .onFinalize(() => {
      isInteracting.value = false;
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
          translateY: y.value,
        },
        {
          scale: knobScale.value + 1,
        },
      ],
    };
  });

  return (
    <Container centered={false}>
      <View style={{ flex: 1 }}>
        <SectionList
          contentContainerStyle={{ paddingHorizontal: layout.spacing * 2 }}
          stickySectionHeadersEnabled={false}
          // @ts-ignore
          getItemLayout={getItemLayout}
          sections={contacts}
          renderSectionHeader={({ section: { title } }) => {
            return <ContactsListHeader title={title} />;
          }}
          renderItem={({ item }) => {
            return <ContactsListItem item={item} />;
          }}
        />
        <View
          style={{
            position: "absolute",
            right: 0,
            top: layout.indicatorSize,
            bottom: layout.indicatorSize,
          }}>
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[styles.knob, animatedStyle]}
              hitSlop={hitSlop}
            />
          </GestureDetector>
          <View
            style={{
              transform: [{ translateX: -layout.indicatorSize / 4 }],
              flex: 1,
              width: 20,
              justifyContent: "space-around",
            }}
            pointerEvents='box-none'>
            {[...Array(alphabet.length).keys()].map((i) => {
              return (
                <AlphabetLetter key={i} letter={alphabet.charAt(i)} index={i} />
              );
            })}
          </View>
        </View>
      </View>
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
