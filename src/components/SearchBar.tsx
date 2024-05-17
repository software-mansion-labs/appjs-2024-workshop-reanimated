import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

export function SearchBar() {
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity
      style={[
        styles.container,
        styles.padding,
        colorScheme === "light"
          ? { backgroundColor: "#f1f5f9" }
          : { backgroundColor: "#1e293b" },
      ]}
    >
      <Text
        style={[
          styles.text,
          colorScheme === "light" ? { color: "#64748b" } : { color: "#f1f5f9" },
        ]}
      >
        Search
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    borderRadius: 20,
    borderCurve: "continuous",
    alignItems: "center",
    flexDirection: "row",
  },
  padding: {
    padding: 16,
  },
  text: {
    fontSize: 18,
    marginHorizontal: 8,
  },
});
