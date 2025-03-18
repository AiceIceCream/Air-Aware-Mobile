import { View } from "react-native";
import React from "react";
import Landing from "../forms/Landing";

export default function LandingScreen(props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Landing {...props} />
    </View>
  );
}
