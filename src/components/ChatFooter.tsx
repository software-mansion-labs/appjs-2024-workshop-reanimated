import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";


const MicrophoneIcon = () => (
  <Svg
    width={24}
    height={24}
    fill="none"
  >
    <Path
      stroke="#001A72"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M18 12a6 6 0 0 1-6 6m0 0a6 6 0 0 1-6-6m6 6v3m0 0h3m-3 0H9m6-15v6a3 3 0 1 1-6 0V6a3 3 0 1 1 6 0Z"
    />
  </Svg>
);

const SendIcon = () => (
  <Svg
    width={24}
    height={24}
    fill="none"
  >
    <Path
      stroke="#001A72"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20 4 3 11l7 3M20 4l-7 17-3-7M20 4 10 14"
    />
  </Svg>
);


export function Footer() {
  return (
    <SafeAreaView style={styles.footerContainer} edges={["bottom"]}>
      <View style={styles.wrapper}>
        <MicrophoneIcon />
        <Text style={styles.text}>Message</Text>
        <SendIcon />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  text: {
    color: "#001A72",
  },
  footerContainer: {
    backgroundColor: "white",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#C1C6E5",
  },
});
