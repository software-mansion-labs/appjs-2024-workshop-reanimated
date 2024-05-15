
import React from "react";

import { ArrowLeftIcon, SettingsIcon } from "@lib/icons";
import { colors } from "@lib/theme";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function Header() {
  return (
    <SafeAreaView style={styles.headerContainer} edges={["top"]}>
      <View style={styles.wrapper}>
        <Link href="/" asChild>
          <Pressable>
            <ArrowLeftIcon />
          </Pressable>
        </Link>
        <Text style={styles.title}>Casper</Text>
        <SettingsIcon />
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
  headerContainer: {
    backgroundColor: "white",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
});
