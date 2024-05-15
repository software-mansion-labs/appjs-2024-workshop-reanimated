import { useChat } from "@/components/ChatProvider";
import { Pressable, StyleSheet } from "react-native";

export function Overlay() {
  const { currentPopupId, setCurrentPopupId } = useChat();

  return (
    currentPopupId && (
      <Pressable
        style={styles.overlay}
        onPress={() => {
          setCurrentPopupId(undefined);
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
