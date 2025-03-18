import { View } from "react-native";
import React from "react";
import Oxygen from "../forms/Oxygen";

export default function OxygenScreen(props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Oxygen {...props} />
    </View>
  );
}
