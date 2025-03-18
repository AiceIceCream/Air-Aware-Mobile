import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';

export default function Footer({ navigation, activeScreen }) {
  const logoIcon = require('../../../assets/Logo1.png');
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-150)).current; // Starting position off-screen

  const footerButtons = [
    { name: "PM2.5", screen: "Home", icon: require("../../../assets/air-filter.png") },
    { name: "PM10", screen: "Pm10", icon: require("../../../assets/air-filter.png") },
    { name: "Temp", screen: "Temperature", icon: require("../../../assets/thermometer.png") },
    { name: "Humidity", screen: "Humidity", icon: require("../../../assets/water.png") },
    { name: "Oxygen", screen: "Oxygen", icon: require("../../../assets/oxygen.png") },
  ];

  const toggleTab = () => {
    setIsOpen(!isOpen);
    Animated.timing(slideAnim, {
      toValue: isOpen ? -150 : 0, // Slide in and out
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      {!isOpen && (
        <TouchableOpacity style={styles.toggleButton} onPress={toggleTab}>
          <Image source={require("../../../assets/sidemenu.png")} style={styles.menuIcon} />
        </TouchableOpacity>
      )}

      {isOpen && (
        <TouchableWithoutFeedback onPress={toggleTab}>
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View style={[styles.sideTab, { transform: [{ translateX: slideAnim }] }]}>
        <Image source={logoIcon} style={styles.logoIcon} />

        <TouchableOpacity style={styles.closeButton} onPress={toggleTab}>
          <Text style={styles.toggleButtonText}>Close</Text>
        </TouchableOpacity>

        {footerButtons.map(({ name, screen, icon }) => (
          <TouchableOpacity
            key={screen}
            style={[styles.footerButton, activeScreen === screen && styles.activeButton]}
            onPress={() => navigation.navigate(screen)}
          >
            <Image source={icon} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{name}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
      </>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    left: 0,
    top: 62,
    padding: 5,
    zIndex: 1, 
  },
  menuIcon: {
    width: 35,
    height: 35,
    left: 0,
  },
  logoIcon: {
    top: 10,
    width: 40,
    height: 40,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 10,
    textAlign: "center"
  },
  sideTab: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 150,
    height: 'auto',
    borderTopEndRadius: 20,
    borderBottomEndRadius: 20,
    backgroundColor: 'white',
    paddingVertical: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  closeButton: {
    backgroundColor: '#0078fe',
    width: 100,
    padding: 8,
    marginBottom: 20,
    top: 600,
    borderRadius: 5
  },
  footerButton: {
    alignItems: 'center',
    marginBottom: 50,
  },
  activeButton: {
    backgroundColor: '#66C1F9',
    borderRadius: 5,
    padding: 5,
    width: 150,
  },
  buttonIcon: {
    width: 50,
    height: 30,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 14,
    color: '#000',
  },
});
