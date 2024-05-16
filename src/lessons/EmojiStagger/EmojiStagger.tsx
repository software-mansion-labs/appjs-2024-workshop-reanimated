import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { useChat } from "@/components/ChatProvider";
import type { MessageType } from "@/lib/mock";
import { colors } from "@/lib/theme";

interface Props {
  message: MessageType;
}

const emojis = ["👍", "👎", "😂", "😢", "😡", "😲"];

export function EmojiStaggerLesson({ message }: Props) {
  const { currentPopupId, setCurrentPopupId } = useChat();

  return (
    <View>
      <Pressable
        style={[
          styles.message,
          message.from === "me" ? styles.messageMe : styles.messageThem,
        ]}
        onPress={() => setCurrentPopupId(message.id)}>
        <Text
          style={[
            styles.messageText,
            message.from === "me"
              ? styles.messageTextMe
              : styles.messageTextThem,
          ]}>
          {message.message}
        </Text>
      </Pressable>

      {currentPopupId === message.id && (
        <View style={styles.emojiPopupContainer}>
          <View style={[styles.emojiPopupWrapper, styles.shadow]}>
            <View style={styles.emojiPopup}>
              {emojis.map((emoji) => (
                <Text style={styles.emoji} key={emoji}>
                  {emoji}
                </Text>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    maxWidth: "80%",
    marginVertical: 8,
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextMe: {
    color: "white",
  },
  messageTextThem: {
    color: "black",
  },
  messageMe: {
    alignSelf: "flex-end",
    backgroundColor: colors.accent,
  },
  messageThem: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  emojiPopupContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  emojiPopupWrapper: {
    top: -45,
    height: 50,
    backgroundColor: colors.overlay,
    borderRadius: 999,
    paddingHorizontal: 16,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  emojiPopup: {
    flexDirection: "row",
    gap: 8,
  },
  emoji: {
    fontSize: 36,
    marginTop: Platform.OS === "ios" ? 2 : -1,
  },
});
