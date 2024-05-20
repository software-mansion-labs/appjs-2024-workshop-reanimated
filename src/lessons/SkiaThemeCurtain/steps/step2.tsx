import {
  Canvas,
  Image,
  makeImageFromView,
  type SkImage,
} from "@shopify/react-native-skia";
import { useEffect, useRef, useState } from "react";
import {
  Appearance,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";

import { Cards } from "@/components/Cards";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { Trending } from "@/components/Trending";

import { Transition, glsl } from "@/lib/shader";
import { StatusBar } from "expo-status-bar";

const TRANSITION_DURATION = 800;

const { width, height } = Dimensions.get("window");

const warpUp: Transition = glsl`
// Author: pschroen
// License: MIT

const vec2 direction = vec2(0.0, -1.0);

const float smoothness = 0.5;
const vec2 center = vec2(0.5, 0.5);

vec4 transition (vec2 uv) {
  vec2 v = normalize(direction);
  v /= abs(v.x) + abs(v.y);
  float d = v.x * center.x + v.y * center.y;
  float m = 1.0 - smoothstep(-smoothness, 0.0, v.x * uv.x + v.y * uv.y - (d - 0.5 + progress * (1.0 + smoothness)));
  return mix(getFromColor((uv - 0.5) * (1.0 - m) + 0.5), getToColor((uv - 0.5) * m + 0.5), m);
}
`;

const warpDown: Transition = glsl`
// Author: pschroen
// License: MIT

const vec2 direction = vec2(0.0, 1.0);

const float smoothness = 0.5;
const vec2 center = vec2(0.5, 0.5);

vec4 transition (vec2 uv) {
  vec2 v = normalize(direction);
  v /= abs(v.x) + abs(v.y);
  float d = v.x * center.x + v.y * center.y;
  float m = 1.0 - smoothstep(-smoothness, 0.0, v.x * uv.x + v.y * uv.y - (d - 0.5 + progress * (1.0 + smoothness)));
  return mix(getFromColor((uv - 0.5) * (1.0 - m) + 0.5), getToColor((uv - 0.5) * m + 0.5), m);
}
`;

export function SkiaThemeCurtain() {
  const colorScheme = useColorScheme();

  const ref = useRef<ScrollView>(null);
  const [firstSnapshot, setFirstSnapshot] = useState<SkImage | null>(null);
  const [secondSnapshot, setSecondSnapshot] = useState<SkImage | null>(null);

  const changeTheme = async () => {
    const snapshot = await makeImageFromView(ref);
    setFirstSnapshot(snapshot);
    Appearance.setColorScheme(colorScheme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    const listener = Appearance.addChangeListener(() => {
      setTimeout(async () => {
        const snapshot = await makeImageFromView(ref);
        setSecondSnapshot(snapshot);
      }, 30);
    });

    return () => {
      listener.remove();
    };
  }, []);

  const isTransitioning = firstSnapshot !== null && secondSnapshot !== null;
  if (isTransitioning) {
    return (
      <View style={styles.fill}>
        <Canvas style={{ height: height }}>
          <Image
            image={secondSnapshot}
            fit="cover"
            width={width}
            height={height}
          />
        </Canvas>
        <StatusBar translucent />
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      {firstSnapshot && (
        <Canvas style={styles.overlay}>
          <Image
            image={firstSnapshot}
            fit="cover"
            width={width}
            height={height}
          />
        </Canvas>
      )}
      <ScrollView
        ref={ref}
        style={[
          styles.container,
          { height: height },
          colorScheme === "light"
            ? { backgroundColor: "white" }
            : { backgroundColor: "#020617" },
        ]}
      >
        <View
          style={[
            { width: width },
            styles.padding,
            colorScheme === "light"
              ? { backgroundColor: "white" }
              : { backgroundColor: "#020617" },
          ]}
        >
          <Header changeTheme={changeTheme} />
          <SearchBar />
          <Trending />
          <Cards />
        </View>
      </ScrollView>
      <StatusBar translucent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "ios" ? 50 : 10,
  },
  fill: {
    flex: 1,
  },
  padding: {
    padding: 16,
  },
  overlay: {
    position: "absolute",
    height: height,
    width: width,
    zIndex: 1,
    elevation: 1,
  },
});
