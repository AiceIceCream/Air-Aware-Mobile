import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Image, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";

export default function Landing({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate("Home");
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        style={{ flex: 1 }}
        colors={['#0078fe', '#32aefe', '#abeeff']}
      >
        <View style={styles.container}>
          <View style={styles.hero}>
            <Image source={require('../../../assets/Logo1.png')} style={styles.logo} />
            <Text style={styles.appTitle}>AirAware</Text>
            <Text style={styles.subTitle}>Air Quality Monitoring System Based on Cagayan de Oro City</Text>
          </View>
          <View style={styles.content}>
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              style={styles.buttonContainer}
            >
              <Animated.View style={[styles.button, { transform: [{ scale: scaleAnim }] }]}>
                <Text style={styles.buttonText}>Check AirAware</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    height: "100%",
    width: "100%"
  },
  hero: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 36,
    color: '#fff',
    marginBottom: 50,
    fontWeight: 'bold'
  },
  subTitle: {
    fontSize:20,
    fontWeight: '300',
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 50,
    margin: 40
  },
  content: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  buttonContainer: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#2ba8fb',
    paddingVertical: 12.5,
    paddingHorizontal: 30,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.5s',
    shadowColor: '#6fc5ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});