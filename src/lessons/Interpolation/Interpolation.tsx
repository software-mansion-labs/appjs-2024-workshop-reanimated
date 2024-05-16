import { Container } from "@/components/Container";
import { Text } from "react-native";

export function Interpolation() {
  return (
    <Container>
      <Text>Welcome to [index - 1, index, index + 1] problem</Text>
      {/* <FlatList data={} /> */}
    </Container>
  );
}
