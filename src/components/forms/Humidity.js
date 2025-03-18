import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Image, Text, TouchableOpacity, FlatList, Button, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { fetchLocations, fetchSensorData } from "../Service/DataService";
import LocationModal from "../Service/LocationModal";
import AQIChart from "../Service/AQIChart";
import Footer from "../Service/Footer";
import HumidityHourlyLineChart from "../Charts/humidityline";
import HumidityHourlyBarChart from "../Charts/humiditybar";

export default function Humidity({ navigation }) {
  const settingsIcon = require('../../../assets/moreinfo.png');
  const [aqiValue, setAQIValue] = useState(0);
  const [datas, setData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('USTP-CDO');
  const [cache, setCache] = useState(new Map());
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLineChart, setShowLineChart] = useState(true);
  const [selectedRemark, setSelectedRemark] = useState(null);
  const [isLocationModalVisible, setLocationModalVisible] = useState(false);
  const [isRemarkModalVisible, setRemarkModalVisible] = useState(false);
  const displayedData = isExpanded ? datas.slice(0, 20) : datas.slice(0, 1);
  const toggleDropdown = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    fetchLocations().then(setLocations).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await fetchSensorData(selectedLocation, "humidity");

        if (newData.length) {
          const currentAQI = newData[0].humidity !== null ? newData[0].humidity : 0;
          setAQIValue(currentAQI);

          updateCache(selectedLocation, newData);
        }

        const newLocation = newData[0].location;
        if (newLocation && newLocation !== selectedLocation) {
          setSelectedLocation(newLocation);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId);
  }, [selectedLocation]);

  const updateCache = (location, newData) => {
    setCache((prevCache) => {
      const existingData = prevCache.get(location) || [];
      const updatedData = mergeData(existingData, newData);

      const newCache = new Map(prevCache);
      newCache.set(location, updatedData);

      if (location === selectedLocation) {
        setData(updatedData);
      }

      return newCache;
    });
  };

  const mergeData = (existingData, newData) => {
    const existingIds = new Set(existingData.map((item) => item.id));
    const filteredNewData = newData.filter((item) => !existingIds.has(item.id));
    return [...filteredNewData, ...existingData];
  };

  const HUMIDITY_RANGES = [
    { min: 0, max: 25, color: '#FF4500', label: "Poor", remark: "Excessively dry; potential for skin irritation and dehydration. Use humidifiers." },
    { min: 26, max: 30, color: '#e9cf00', label: "Fair", remark: "Dry conditions; monitor hydration levels and consider humidification." },
    { min: 31, max: 60, color: '#14bb00', label: "Good", remark: "Comfortable range; no action needed." },
    { min: 61, max: 70, color: '#e9cf00', label: "Fair", remark: "Slight discomfort; may feel sticky. Ventilation recommended." },
    { min: 71, max: Infinity, color: 'red', label: "Poor", remark: "Excessively humid; risk of mold growth and discomfort. Use dehumidifiers." },
  ];

  const getDynamicColor = (value) => {
    const range = HUMIDITY_RANGES.find((r) => value >= r.min && value <= r.max);
    return range ? range.color : '#000000'; // Default to black if no range is matched
  };

  const handleRowPress = (remark) => {
    setSelectedRemark(remark);
    setRemarkModalVisible(true);
  };

  const renderItem = ({ item }) => {
    const date = new Date(item.date);
    const formattedDate = date.toISOString().split("T")[0];
    const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    const dynamicColor = getDynamicColor(item.humidity);
    const remark = HUMIDITY_RANGES.find((r) => item.humidity >= r.min && item.humidity <= r.max)?.remark;

    return (
            <TouchableOpacity onPress={() => handleRowPress(remark)}>
      
      <View style={styles.dataRow}>
        <View style={styles.dateTimeContainer}>
          <Text style={[styles.dateText, {}]}>{formattedDate}</Text>
          <Text style={[styles.timeText, {}]}>{formattedTime}</Text>
        </View>
        <Text style={[styles.dataText, { color: dynamicColor }]}>{item.humidity}</Text>
        <Text style={[styles.dataText, { color: dynamicColor }]}>{item.humidityRemarks}</Text>
      </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      style={{ flex: 1, padding: 0, justifyContent: "center", width: "100%" }}
      colors={['#0078fe', '#32aefe', '#abeeff']}
    >
      <SafeAreaView style={styles.container}>
        <FlatList
          data={displayedData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.scrollContainer}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("Landing")}>
                  <Text style={styles.appTitle}>AirAware</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Setting")}>
                  <Image source={settingsIcon} style={styles.icon} />
                </TouchableOpacity>
              </View>

              <AQIChart value={aqiValue} label="Humidity" pollutantType="Humidity" unit="%" />

              <Text style={styles.location}>{selectedLocation}</Text>

              <TouchableOpacity onPress={() => setLocationModalVisible(true)}>
                <Text style={{ marginBottom: 10, fontSize: 15, textDecorationLine: "underline", textAlign: 'center' }}>
                  See More Locations
                </Text>
              </TouchableOpacity>

              <View style={styles.switchContainer}>
                <Button title="Line Chart" onPress={() => setShowLineChart(true)} color={showLineChart ? "blue" : "gray"} />
                <Button title="Bar Chart" onPress={() => setShowLineChart(false)} color={!showLineChart ? "blue" : "gray"} />
              </View>

              {showLineChart ? <HumidityHourlyLineChart data={datas} /> : <HumidityHourlyBarChart data={datas} />}

              <Text style={{ textAlign: "center", marginBottom: 10, fontSize: 12, color: 'white' }}>
                Data Table
              </Text>

              <View style={styles.valueRow}>
                <Text style={styles.valueRowText}>Date</Text>
                <Text style={styles.valueRowText}>Humidity</Text>
                <Text style={styles.valueRowText}>Remarks</Text>
              </View>

            </>
          }
          ListFooterComponent={
            <>
              <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
                <Text style={styles.dropdownButtonText}>{isExpanded ? "Show Less" : "Show More"}</Text>
              </TouchableOpacity>
            </>
          }
        />
         <LocationModal
                  visible={isLocationModalVisible}
                  locations={locations}
                  onSelect={setSelectedLocation}
                  onClose={() => setLocationModalVisible(false)}
                />
        <Footer navigation={navigation} activeScreen="Humidity" />
        {selectedRemark && (
                  <Modal transparent visible={isRemarkModalVisible} animationType="fade">
                    <View style={styles.modalContainer}>
                      <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Cautionary Statement</Text>
                        <Text style={styles.modalText}>{selectedRemark}</Text>
                        <Button title="Close" onPress={() => setRemarkModalVisible(false)} />
                      </View>
                    </View>
                  </Modal>
                )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 5,
    padding: 10
  },
  appTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: '#fff',
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: "2%",
    marginRight: "2%",
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F3EFEF',
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 5,
    width: '100%',
    maxWidth: 390,
    alignSelf: 'center',
  },
  valueRowText: {
    fontSize: 14,
    color: 'black',
    flex: 1,
    textAlign: 'center',
  },
  location: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'
  },
  seeMore: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  scrollContainer: {
    width: '100%',
    maxWidth: 350,
    marginTop: 10,
    bottom: 10,
    maxWidth: 390,
    alignSelf: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    width: "100%",
    alignSelf: 'center',
    borderRadius: 10,
  },
  dateTimeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  dataText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  dropdownButton: {
    alignSelf: "center",
    marginVertical: 5,
    padding: 10,
    backgroundColor: "#0078fe",
    borderRadius: 20,
  },
  dropdownButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textDecorationLine: "underline",
  }
});
