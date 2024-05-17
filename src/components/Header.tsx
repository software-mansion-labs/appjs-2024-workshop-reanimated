import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

interface Header {
  changeTheme: () => void;
}

export function Header({ changeTheme }) {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.row}>
      <Text
        style={[
          styles.header,
          colorScheme === "light" ? { color: "#0f172a" } : { color: "#f1f5f9" },
        ]}
      >
        Home
      </Text>
      <Pressable style={styles.themeSwitcher} onPress={changeTheme}>
        <Text
          style={
            colorScheme === "light"
              ? { color: "#0f172a" }
              : { color: "#f1f5f9" }
          }
        >
          Switch theme
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  themeSwitcher: {
    paddingBottom: 10,
    paddingRight: 4,
  },
  header: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
