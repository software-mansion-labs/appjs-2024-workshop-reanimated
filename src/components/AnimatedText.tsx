import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
} from "react-native";
import Animated, {
  AnimatedStyle,
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";

Animated.addWhitelistedNativeProps({ text: true });

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export function AnimatedText({
  style,
  text,
  label = "",
}: {
  style?: StyleProp<AnimatedStyle<StyleProp<TextStyle>>>;
  label?: string;
  text: SharedValue<number>;
}): React.ReactElement {
  const animatedProps = useAnimatedProps(() => {
    return {
      text: `${label}${text.value.toFixed(1)}`,
    } as unknown as TextInputProps;
  });

  return (
    <AnimatedTextInput
      underlineColorAndroid='transparent'
      editable={false}
      value={`${label}${text.value.toFixed(1)}`}
      style={[styles.text, style]}
      animatedProps={animatedProps}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    color: "black",
  },
});
