import React from "react";
import { Dimensions, View, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";

export default function PM25HourlyBarChart({ data }) {
  if (!data || data.length === 0) {
    return <Text style={{ textAlign: "center"}}>No data available for the chart</Text>;
  }

  try {
     // Extract last fetched date
     const lastFetchDate = new Date(
      Math.max(...data.map(item => new Date(item.date).getTime()))
    );

    // Filter data for the last fetched date
    const filteredData = data.filter(item => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getFullYear() === lastFetchDate.getFullYear() &&
        itemDate.getMonth() === lastFetchDate.getMonth() &&
        itemDate.getDate() === lastFetchDate.getDate()
      );
    });

    // Group data by hours
    const groupedData = filteredData.reduce((acc, item) => {
      const date = new Date(item.date);
      const hour = date.getHours();
      if (!acc[hour]) {
        acc[hour] = { total: 0, count: 0 };
      }
      acc[hour].total += item.pm25;
      acc[hour].count += 1;
      return acc;
    }, {});

    // Generate all 24 hours and fill missing data
    const fullDayData = Array.from({ length: 24 }, (_, hour) => {
      const avg = groupedData[hour]
        ? groupedData[hour].total / groupedData[hour].count
        : 0;
      return { hour, avg };
    });

    // Prepare chart data
    const labels = Object.keys(groupedData)
      .sort((a, b) => a - b)
      .map((hour) => {
        const hourInt = parseInt(hour, 10);
        const ampm = hourInt >= 12 ? "PM" : "AM";
        const hour12 = hourInt % 12 || 12;
        return `${hour12} ${ampm}`;
      });

    const pm25Values = Object.keys(groupedData)
      .sort((a, b) => a - b)
      .map((hour) => groupedData[hour].total / groupedData[hour].count);

    const chartData = {
      labels,
      datasets: [
        {
          data: pm25Values,
          color: (opacity = 1) => `rgba(20, 187, 0, ${opacity})`,
        },
      ],
      legend: false,
    };

    return (
      <View>
        <Text style={{ textAlign: "center", marginBottom: 5, fontSize: 12, color: 'white' }}>
          PM2.5 Hourly Avg
        </Text>

        <BarChart
          data={chartData}
          width={Dimensions.get("window").width - 30}
          height={200}
          yAxisSuffix=" µg/m³"
          yLabelsOffset= {1}
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
    console.error("Error rendering bar chart:", error);
    return <Text>Error rendering bar chart</Text>;
  }
}
