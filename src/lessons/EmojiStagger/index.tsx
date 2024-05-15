import React from "react";
import { StyleSheet } from "react-native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Chat } from "@/components/Chat";
import { Footer } from "@/components/ChatFooter";
import { Header } from "@/components/ChatHeader";
import { Overlay } from "@/components/ChatOverlay";
import { ChatProvider } from "@/components/ChatProvider";

export function EmojiStagger() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ChatProvider>
        <SafeAreaProvider>
          <Header />
          <Chat />
          <Footer />
        </SafeAreaProvider>
        <Overlay />
      </ChatProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },
});

