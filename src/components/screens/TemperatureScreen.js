import { View } from "react-native";
import React from "react";
import Temperature from "../forms/Temperature";

export default function TemperatureScreen(props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Temperature {...props} />
    </View>
  );
}
