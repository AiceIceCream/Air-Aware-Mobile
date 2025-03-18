import React, { useState } from 'react';
import { Modal, Text, View, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SVGLinearGradient, Stop } from 'react-native-svg';

export default function AQIChart({ value, label, pollutantType, unit }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [remark, setRemark] = useState('');

  const pollutantRanges = {
    'PM2.5': [
      { min: 0, max: 25, color: '#14bb00', label: "Good", remark: "Safe air levels; no action needed." },
      { min: 26, max: 35, color: '#e9cf00', label: "Fair", remark: "Some pollutants may be a concern for sensitive individuals." },
      { min: 36, max: 45, color: '#e07a00', label: "Unhealthy", remark: "People with respiratory disease, such as asthma, should limit outdoor exertion." },
      { min: 46, max: 55, color: 'red', label: "Very Unhealthy", remark: "Pedestrians should avoid heavy traffic areas. People with heart or respiratory disease such as asthma should stay indoors and rest as much as possible. Unnecessary trips should be postponed. People should voluntarily restrict the use of vehicles." },
      { min: 56, max: 90, color: 'purple', label: "Acutely Unhealthy", remark: "Pedestrians should avoid heavy traffic areas. People with heart or respiratory disease such as asthma should stay indoors and rest as much as possible. Unnecessary trips should be postponed. Motor vehicle use may be restricted. Industrial activities may be curtailed." },
      { min: 91, max: Infinity, color: '#8B0000', label: "Emergency", remark: "Everyone should remain indoors (keeping windows and doors closed). Motor vehicle use should be prohibited except for emergency situations. Industrial activities, except that which is vital for public safety and health, should be curtailed." },
    ],
    PM10: [
      { min: 0, max: 54, color: '#14bb00', label: "Good", remark: "Safe air levels; no action needed." },
      { min: 55, max: 154, color: '#e9cf00', label: "Fair", remark: "Some pollutants may be a concern for sensitive individuals." },
      { min: 155, max: 254, color: '#e07a00', label: "Unhealthy", remark: "People with respiratory disease, such as asthma, should limit outdoor exertion." },
      { min: 255, max: 354, color: 'red', label: "Very Unhealthy", remark: "Pedestrians should avoid heavy traffic areas. People with heart or respiratory disease such as asthma should stay indoors and rest as much as possible. Unnecessary trips should be postponed. People should voluntarily restrict the use of vehicles." },
      { min: 355, max: 424, color: 'purple', label: "Acutely Unhealthy", remark: "Pedestrians should avoid heavy traffic areas. People with heart or respiratory disease such as asthma should stay indoors and rest as much as possible. Unnecessary trips should be postponed. Motor vehicle use may be restricted. Industrial activities may be curtailed." },
      { min: 425, max: Infinity, color: '#8B0000', label: "Emergency", remark: "Everyone should remain indoors (keeping windows and doors closed). Motor vehicle use should be prohibited except for emergency situations. Industrial activities, except that which is vital for public safety and health, should be curtailed." },
    ],
    Humidity: [
      { min: 0, max: 25, color: '#FF4500', label: "Poor", remark: "Excessively dry; potential for skin irritation and dehydration. Use humidifiers." },
      { min: 26, max: 30, color: '#e9cf00', label: "Fair", remark: "Dry conditions; monitor hydration levels and consider humidification." },
      { min: 31, max: 60, color: '#14bb00', label: "Good", remark: "Comfortable range; no action needed." },
      { min: 61, max: 70, color: '#e9cf00', label: "Fair", remark: "Slight discomfort; may feel sticky. Ventilation recommended." },
      { min: 71, max: Infinity, color: 'red', label: "Poor", remark: "Excessively humid; risk of mold growth and discomfort. Use dehumidifiers." },
    ],
    Temperature: [
      { min: 0, max: 33, color: '#14bb00', label: "Good", remark: "Safe temperature levels; no action needed." },
      { min: 34, max: 41, color: '#f9c71d', label: "Caution", remark: "Reduce prolonged exposure and stay hydrated." },
      { min: 42, max: 54, color: '#fdb114', label: "Danger", remark: "Avoid outdoor activities; risk of heat-related illnesses." },
      { min: 55, max: Infinity, color: 'red', label: "Extreme", remark: "Severe risk: Stay indoors; heatstroke possible." },
    ],
    Oxygen: [
      { min: 0, max: 19.4, color: 'red', label: "Low", remark: "Risk of hypoxia; ensure oxygen supply and ventilation." },
      { min: 19.5, max: Infinity, color: '#14bb00', label: "Good", remark: "Safe oxygen levels; no action needed." },
    ],

  };

  const getColorForValue = () => {
    const ranges = pollutantRanges[pollutantType] || [];
    for (const range of ranges) {
      if (value <= range.max) {
        return range.color; // Return color based on value
      }
    }
    return 'grey'; // Default color if no range is found
  };

  const getRemarkForValue = () => {
    const ranges = pollutantRanges[pollutantType] || [];
    for (const range of ranges) {
      if (value <= range.max) {
        return range.remark; // Return remark based on value
      }
    }
    return 'No data available';
  };

  const getLabelForValue = () => {
    const ranges = pollutantRanges[pollutantType] || [];
    for (const range of ranges) {
      if (value <= range.max) {
        return range.label;
      }
    }
    return 'No data';
  };

  const strokeColor = getColorForValue();

  const handlePress = () => {
    setRemark(getRemarkForValue());
    setModalVisible(true);
  };

  return (
    <View style={styles.aqiContainer}>
      <Svg height="180" width="180" viewBox="0 0 200 200">
        <Defs>
          <SVGLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={strokeColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={strokeColor} stopOpacity="1" />
          </SVGLinearGradient>
        </Defs>

        <Circle
          cx="100"
          cy="100"
          r="90"
          stroke="url(#grad)"
          strokeWidth="15"
          fill="white"
          strokeLinecap="round"
        />
      </Svg>

      {/* Centered Text Container */}
      <Pressable style={styles.textContainer} onPress={handlePress}>
        <Text style={styles.aqiValue}>{value}</Text>
        <Text style={styles.aqiUnit}>{unit}</Text>
        <Text style={styles.aqiRemark}>{getLabelForValue()}</Text>
        <Text style={styles.aqiLabel}>{label}</Text>
      </Pressable>

      {/* Modal for Remarks */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cautionary Statement</Text>
            <Text style={styles.modalText}>{getRemarkForValue()}</Text>
            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  aqiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    position: 'relative',
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aqiValue: {
    fontSize: 35,
    fontWeight: 'bold',
    color: 'black',
  },
  aqiLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  aqiRemark: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
  },
  aqiUnit: {
    marginBottom: 3,
    fontSize: 10,
    color: 'black',
    position: 'relative',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textDecorationLine: "underline",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'justify',
  },
  closeButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
