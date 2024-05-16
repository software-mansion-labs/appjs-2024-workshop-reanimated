import { FlatList, StyleSheet } from "react-native";

import { EmojiStaggerLesson as Message } from "@/lessons/EmojiStagger/EmojiStagger";
import { messages } from "@/lib/mock";

export function Chat() {
  return (
    <FlatList
      data={messages}
      inverted
      contentContainerStyle={styles.reverse}
      renderItem={({ item }) => <Message key={item.id} message={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}

const styles = StyleSheet.create({
  reverse: {
    flexDirection: "column-reverse",
  },
});
