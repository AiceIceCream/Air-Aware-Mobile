import { View } from "react-native";
import React from "react";
import Humidity from "../forms/Humidity";

export default function HumidityScreen(props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Humidity {...props} />
    </View>
  );
}
