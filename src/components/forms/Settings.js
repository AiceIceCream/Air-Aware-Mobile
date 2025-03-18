import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from '@expo/vector-icons';


const pollutantRanges = {
  "PM2.5": {
    ranges: [
      { min: 0, max: 25, color: '#14bb00', label: "Good", remark: "Safe air levels; no action needed." },
      { min: 26, max: 35, color: '#e9cf00', label: "Fair", remark: "Some pollutants may be a concern for sensitive individuals." },
      { min: 36, max: 45, color: '#e07a00', label: "Unhealthy", remark: "People with respiratory disease, such as asthma, should limit outdoor exertion." },
      { min: 46, max: 55, color: 'red', label: "Very Unhealthy", remark: "Pedestrians should avoid heavy traffic areas. People with heart or respiratory disease such as asthma should stay indoors and rest as much as possible. Unnecessary trips should be postponed. People should voluntarily restrict the use of vehicles." },
      { min: 56, max: 90, color: 'purple', label: "Acutely Unhealthy", remark: "Pedestrians should avoid heavy traffic areas. People with heart or respiratory disease such as asthma should stay indoors and rest as much as possible. Unnecessary trips should be postponed. Motor vehicle use may be restricted. Industrial activities may be curtailed." },
      { min: 91, max: Infinity, color: '#8B0000', label: "Emergency", remark: "Everyone should remain indoors (keeping windows and doors closed). Motor vehicle use should be prohibited except for emergency situations. Industrial activities, except that which is vital for public safety and health, should be curtailed." },
    ],
    source: "Department of Environment and Natural Resources(DENR)",
  },
  PM10: {
    ranges: [
      { min: 0, max: 54, color: '#14bb00', label: "Good", remark: "Safe air levels; no action needed." },
      { min: 55, max: 154, color: '#e9cf00', label: "Fair", remark: "Some pollutants may be a concern for sensitive individuals." },
      { min: 155, max: 254, color: '#e07a00', label: "Unhealthy", remark: "People with respiratory disease, such as asthma, should limit outdoor exertion." },
      { min: 255, max: 354, color: 'red', label: "Very Unhealthy", remark: "Pedestrians should avoid heavy traffic areas. People with heart or respiratory disease such as asthma should stay indoors and rest as much as possible. Unnecessary trips should be postponed. People should voluntarily restrict the use of vehicles." },
      { min: 355, max: 424, color: 'purple', label: "Acutely Unhealthy", remark: "Pedestrians should avoid heavy traffic areas. People with heart or respiratory disease such as asthma should stay indoors and rest as much as possible. Unnecessary trips should be postponed. Motor vehicle use may be restricted. Industrial activities may be curtailed." },
      { min: 425, max: Infinity, color: '#8B0000', label: "Emergency", remark: "Everyone should remain indoors (keeping windows and doors closed). Motor vehicle use should be prohibited except for emergency situations. Industrial activities, except that which is vital for public safety and health, should be curtailed." },
    ],
    source: "Department of Environment and Natural Resources(DENR)",
  },
  Humidity: {
    ranges: [
      { min: 0, max: 25, color: '#FF4500', label: "Poor", remark: "Excessively dry; potential for skin irritation and dehydration. Use humidifiers." },
      { min: 26, max: 30, color: '#e9cf00', label: "Fair", remark: "Dry conditions; monitor hydration levels and consider humidification." },
      { min: 31, max: 60, color: '#14bb00', label: "Good", remark: "Comfortable range; no action needed." },
      { min: 61, max: 70, color: '#e9cf00', label: "Fair", remark: "Slight discomfort; may feel sticky. Ventilation recommended." },
      { min: 71, max: Infinity, color: 'red', label: "Poor", remark: "Excessively humid; risk of mold growth and discomfort. Use dehumidifiers." },
    ],
    source: "World Health Organization & ASHRAE",
  },
  Temperature: {
    ranges: [
      { min: 0, max: 33, color: '#14bb00', label: "Good", remark: "Safe temperature levels; no action needed." },
      { min: 34, max: 41, color: '#f9c71d', label: "Caution", remark: "Reduce prolonged exposure and stay hydrated." },
      { min: 42, max: 54, color: '#fdb114', label: "Danger", remark: "Avoid outdoor activities; risk of heat-related illnesses." },
      { min: 55, max: Infinity, color: 'red', label: "Extreme", remark: "Severe risk: Stay indoors; heatstroke possible." },
    ],
    source: "World Health Organization & ASHRAE",
  },
  Oxygen: {
    ranges: [
      { min: 0, max: 19.4, color: 'red', label: "Low", remark: "Risk of hypoxia; ensure oxygen supply and ventilation." },
      { min: 19.5, max: Infinity, color: '#14bb00', label: "Good", remark: "Safe oxygen levels; no action needed." },
    ],
    source: "World Health Organization & ASHRAE",
  },
};

export default function Settings({ navigation }) {
  const [selectedPollutant, setSelectedPollutant] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (pollutant) => {
    setSelectedPollutant(pollutant);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPollutant(null);
  };

  return (
    <LinearGradient style={{ flex: 1 }} colors={['#0078fe', '#32aefe', '#abeeff']}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Air Quality Pollutants Info</Text>
        {Object.keys(pollutantRanges).map((pollutant, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.pollutantButton}
            onPress={() => openModal(pollutant)}
          >
            <Text style={styles.pollutantText}>{pollutant}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>{selectedPollutant}</Text>
            {selectedPollutant && (
              <ScrollView>
                <View style={styles.table}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.tableHeaderCell, { backgroundColor: "#0078fe" }]}>Remarks</Text>
                    <Text style={[styles.tableHeaderCell, { backgroundColor: "#0078fe" }]}>AQI</Text>
                    <Text style={[styles.tableHeaderCell, { flex: 1, backgroundColor: "#0078fe" }]}>Cautionary Statement</Text>
                  </View>
                  {pollutantRanges[selectedPollutant].ranges.map((range, idx) => (
                    <View key={idx} style={styles.tableRow}>
                      <Text style={[styles.cell, { backgroundColor: range.color, color: "#fff" }]}>{range.label}</Text>
                      <Text style={styles.cell}>{range.max === Infinity ? `> ${range.min}` : `${range.min} - ${range.max}`}</Text>
                      <Text style={styles.cell2}>{range.remark}</Text>
                    </View>
                  ))}
                  <Text style={{ textAlign: "center", marginVertical: 10, fontStyle: "italic", color: "#555" }}>
                    Source: {pollutantRanges[selectedPollutant].source}
                  </Text>
                </View>
              </ScrollView>
            )}

            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 5,
    left: 10,
    zIndex: 1,
    padding: 10,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#fff",
  },
  pollutantButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  pollutantText: {
    fontSize: 18,
    color: "black",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
    width: "100%",
    marginTop: 100,
    marginBottom: 100,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  table: {
    width: '100%',
  },
  tableHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#0078fe",
    backgroundColor: "#0078fe",
  },
  tableHeaderCell: {
    width: 100, // Fixed width for alignment
    fontSize: 12,
    textAlign: "center",
    padding: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  cell: {
    width: 100,  // Fixed width for consistent alignment
    padding: 10,
    fontSize: 12,
    textAlign: "center",
  },
  cell2: {
    flex: 1,
    padding: 10,
    fontSize: 12,
    textAlign: "justify",
    flexWrap: 'wrap',
  },
  closeButton: {
    marginBottom: 60,
    backgroundColor: "#0078fe",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
