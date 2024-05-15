import { MicrophoneIcon, SendIcon } from "@lib/icons";
import { colors } from "@lib/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function Footer() {
  return (
    <SafeAreaView style={styles.footerContainer} edges={["bottom"]}>
      <View style={styles.wrapper}>
        <MicrophoneIcon />
        <Text style={styles.text}>Message</Text>
        <SendIcon />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  text: {
    color: colors.primary,
  },
  footerContainer: {
    backgroundColor: "white",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
