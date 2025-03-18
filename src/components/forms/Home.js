import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Image, Text, TouchableOpacity, FlatList, Button, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { fetchLocations, fetchSensorData } from "../Service/DataService";
import LocationModal from "../Service/LocationModal";
import AQIChart from "../Service/AQIChart";
import Footer from "../Service/Footer";
import PM25HourlyLineChart from "../Charts/pm25line";
import PM25HourlyBarChart from "../Charts/pm25bar";

export default function Home({ navigation }) {
  const settingsIcon = require("../../../assets/moreinfo.png");
  const [aqiValue, setAQIValue] = useState(0);
  const [datas, setData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("USTP-CDO");
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
        const newData = await fetchSensorData(selectedLocation, "pm25");

        if (newData.length) {
          const currentAQI = newData[0].pm25 !== null ? newData[0].pm25 : 0;
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
  const PM25_RANGES = [
    { min: 0, max: 25, color: '#14bb00', label: "Good", remark: "Safe air levels; no action needed." },
    { min: 26, max: 35, color: '#e9cf00', label: "Fair", remark: "Some pollutants may be a concern for sensitive individuals." },
    { min: 36, max: 45, color: '#e07a00', label: "Unhealthy", remark: "People with respiratory disease, such as asthma, should limit outdoor exertion." },
    { min: 46, max: 55, color: 'red', label: "Very Unhealthy", remark: "Pedestrians should avoid heavy traffic areas. People with heart or respiratory disease such as asthma should stay indoors and rest as much as possible. Unnecessary trips should be postponed. People should voluntarily restrict the use of vehicles." },
    { min: 56, max: 90, color: 'purple', label: "Acutely Unhealthy", remark: "Pedestrians should avoid heavy traffic areas. People with heart or respiratory disease such as asthma should stay indoors and rest as much as possible. Unnecessary trips should be postponed. Motor vehicle use may be restricted. Industrial activities may be curtailed." },
    { min: 91, max: Infinity, color: '#8B0000', label: "Emergency", remark: "Everyone should remain indoors (keeping windows and doors closed). Motor vehicle use should \nbe prohibited except for emergency situations. Industrial activities, except that which is vital for public safety and health, should be curtailed." },
  ];

  const getDynamicColor = (value) => {
    const range = PM25_RANGES.find((r) => value >= r.min && value <= r.max);
    return range ? range.color : '#000000';
  };

  const handleRowPress = (remark) => {
    setSelectedRemark(remark);
    setRemarkModalVisible(true);
  };

  const renderItem = ({ item }) => {
    const date = new Date(item.date);
    const formattedDate = date.toISOString().split("T")[0];
    const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    const dynamicColor = getDynamicColor(item.pm25);
    const remark = PM25_RANGES.find((r) => item.pm25 >= r.min && item.pm25 <= r.max)?.remark;

    return (
      <TouchableOpacity onPress={() => handleRowPress(remark)}>
        <View style={styles.dataRow}>
          <View style={styles.dateTimeContainer}>
            <Text style={[styles.dateText, {}]}>{formattedDate}</Text>
            <Text style={[styles.timeText, {}]}>{formattedTime}</Text>
          </View>
          <Text style={[styles.dataText, { color: dynamicColor }]}>{item.pm25}</Text>
          <Text style={[styles.dataText, { color: dynamicColor }]}>{item.pm25Remarks}</Text>
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <LinearGradient
      style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "auto"}}
      colors={["#0078fe", "#32aefe", "#abeeff"]}
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

              <AQIChart value={aqiValue} label="PM 2.5" pollutantType="PM2.5" unit="µg/m³" />

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

              {showLineChart ? <PM25HourlyLineChart data={datas} /> : <PM25HourlyBarChart data={datas} />}

              <Text style={{ textAlign: "center", marginBottom: 10, fontSize: 12, color: 'white' }}>
                Data Table
              </Text>

              <View style={styles.valueRow}>
                <Text style={styles.valueRowText}>Date</Text>
                <Text style={styles.valueRowText}>PM2.5</Text>
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
        <Footer navigation={navigation} activeScreen="Home" />

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
    textAlign: 'center',
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
    maxWidth: 390,
    marginTop: 10,
    bottom: 10,
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
    textAlign: 'justify'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textDecorationLine: "underline",
  },
  modalButton: {
    borderRadius: 50,
  }
});