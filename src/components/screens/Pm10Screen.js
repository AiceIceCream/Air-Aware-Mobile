import { View } from "react-native";
import React from "react";
import Pm10 from "../forms/Pm10";

export default function Pm10Screen(props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pm10 {...props} />
    </View>
  );
}
