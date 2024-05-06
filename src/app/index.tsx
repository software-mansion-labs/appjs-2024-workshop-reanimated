import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Link, router } from "expo-router";
import { Container } from "@components/Container";
import { layout } from "@lib/theme";
import { routes } from "@navigation/Routes";

export default function HomeScreen() {
  return (
    <Container centered={false}>
      <ScrollView contentContainerStyle={{ padding: layout.spacing * 2 }}>
        {routes.map((route) => (
          <TouchableOpacity
            onPress={() => router.navigate(route.href)}
            key={route.href}
            style={styles.button}>
            <Text style={styles.title}>{route.title}</Text>
            <Text style={styles.subtitle}>{route.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    opacity: 0.6,
  },
  button: {
    paddingVertical: layout.spacing * 2,
    paddingHorizontal: layout.radius,
    marginBottom: layout.spacing,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.1)",
    borderStyle: "dashed",
    borderRadius: layout.radius,
  },
});
