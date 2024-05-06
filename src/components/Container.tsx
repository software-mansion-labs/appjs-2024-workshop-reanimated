import type { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { layout } from "../lib/theme";

export function Container({
  children,
  style,
  centered = true,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  centered?: boolean;
}) {
  return (
    <SafeAreaView
      style={[
        {
          flex: 1,
          padding: layout.spacing,
        },
        centered && { justifyContent: "center", alignItems: "center" },
        style,
      ]}>
      {children}
    </SafeAreaView>
  );
}
