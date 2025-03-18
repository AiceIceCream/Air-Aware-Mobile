import React from "react";
import { Dimensions, View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function TemperatureHourlyLineChart({ data }) {
  if (!data || data.length === 0) {
    return <Text style={{ textAlign: "center"}}>No data available for the chart</Text>;
  }

  try {
    const groupedData = data.reduce((acc, item) => {
      const date = new Date(item.date);
      const hour = date.getHours();
      if (!acc[hour]) {
        acc[hour] = { total: 0, count: 0 };
      }
      acc[hour].total += item.temperature;
      acc[hour].count += 1;
      return acc;
    }, {});

    const labels = Object.keys(groupedData)
    .sort((a, b) => a - b)
    .map((hour) => {
        const hourInt = parseInt(hour, 10);
        const ampm = hourInt >= 12 ? "PM" : "AM";
        const hour12 = hourInt % 12 || 12;
        return `${hour12} ${ampm}`;
    });
    const temperatureValues = Object.keys(groupedData)
      .sort((a, b) => a - b)
      .map((hour) => groupedData[hour].total / groupedData[hour].count);

    const chartData = {
      labels,
      datasets: [
        {
          data: temperatureValues,
        },
      ],
      legend: false,
    };

    return (
      <View>
        <Text style={{ textAlign: "center", marginBottom: 5, fontSize: 12, color: 'white' }}>
          Temperature Hourly Avg
        </Text>

        <LineChart
          data={chartData}
          width={Dimensions.get("window").width - 30}
          height={200}
          yAxisSuffix="°C"
          segments={6}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#0078fe",
            backgroundGradientTo: "#32aefe",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, 254)`,
          }}
          style={{
            marginVertical: 8,
            marginHorizontal: 20,
            marginBottom: 10,
            borderRadius: 5,
            alignSelf: "center",
          }}
        />
      </View>
    );
  } catch (error) {
    console.error("Error rendering chart:", error);
    return <Text>Error rendering chart</Text>;
  }
}
