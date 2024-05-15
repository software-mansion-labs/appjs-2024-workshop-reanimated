import { useChat } from "@/components/ChatProvider";
import { Pressable, StyleSheet } from "react-native";

export function Overlay() {
  const { emojiPopupId, setEmojiPopupId } = useChat();

  return (
    emojiPopupId && (
      <Pressable
        style={styles.overlay}
        onPress={() => {
          setEmojiPopupId(undefined);
        }}
      />
    )
  );
}

const styles = StyleSheet.create({
  overlay: {
    // @ts-ignore its fine
    ...StyleSheet.absoluteFill,
  },
});
