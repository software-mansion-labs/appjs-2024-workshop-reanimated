import { layout } from "@/lib/theme";
import { StyleSheet, Text } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

export function Content() {
  return (
    <Animated.View
      entering={FadeInDown.delay(200)}
      exiting={FadeOutDown}
      style={{
        padding: layout.spacing * 2,
      }}>
      <Text style={styles.paragraph}>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptas quasi
        et nostrum harum repudiandae dolorem voluptatum assumenda in facere!
        Cum, officia quas. Velit repellendus aspernatur reprehenderit aut,
        perspiciatis mollitia nisi!
      </Text>
      <Text style={styles.paragraph}>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptas quasi
        et nostrum harum repudiandae dolorem voluptatum assumenda in facere!
        Cum, officia quas. Velit repellendus aspernatur reprehenderit aut,
        perspiciatis mollitia nisi!
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    opacity: 0.7,
  },
});
