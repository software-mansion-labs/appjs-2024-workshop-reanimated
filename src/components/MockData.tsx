import { friends } from "@/lib/mock";
import { colorShades } from "@/lib/theme";
import { Image, Text, TextStyle, View } from "react-native";

export function Creators() {
  return (
    <View style={{ flexDirection: "row", flex: 1 }}>
      {friends.map((avatar) => (
        <Image
          key={avatar}
          source={{ uri: avatar }}
          style={{
            width: 120,
            height: 120,
            marginRight: 10,
            borderRadius: 20,
            backgroundColor: colorShades.purple.base,
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      ))}
    </View>
  );
}

export function WorkshopTagLine({
  fontWeight = "500",
}: {
  fontWeight?: TextStyle["fontWeight"];
}) {
  return (
    <Text style={{ fontSize: 24, color: colorShades.purple.dark, fontWeight }}>
      App.js Reanimated Workshop 2023
    </Text>
  );
}
