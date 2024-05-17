import { images } from "@/lib/mock";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const myImages = images.splice(0, 6)

export function Cards() {
  return (
    <View style={styles.container}>
      {myImages.map((image) => (
        <Card key={image.id} image={{ uri: image.originalUri }} />
      ))}
    </View>
  );
}
function Card({ image }) {
  return (
    <TouchableOpacity style={[styles.card, styles.round]}>
      <Image source={image} style={[styles.image, styles.round]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
    marginVertical: 16,
  },
  card: {
    position: "relative",
  },
  round: {
    borderRadius: 16,
  },
  image: {
    width: Dimensions.get("window").width / 2 - 24,
    height: 250,
  },
  blurContainer: {
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
  },
  iconWrapper: {
    position: "absolute",
    bottom: 16,
    right: 16,
    overflow: "hidden",
  },
});
