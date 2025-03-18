import { View } from "react-native";
import React from "react";
import Settings from "../forms/Settings";

export default function SettingsScreen(props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Settings {...props} />
    </View>
  );
}
