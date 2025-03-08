import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Scaling functions
const scaleWidth = (size) => (width / 375) * size; // 375 is the base width (e.g., iPhone 12)
const scaleHeight = (size) => (height / 812) * size; // 812 is the base height (e.g., iPhone 12)

const LoadingComponent = () => {
  const [dots, setDots] = useState(1);
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev < 3 ? prev + 1 : 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.iconContainer}>
          <View style={styles.book} />
          <Animated.View style={[styles.circle, { transform: [{ rotate: spin }] }]}>
            <View style={styles.dot} />
          </Animated.View>
        </View>
        <Text style={styles.title}>College Attendance System</Text>
        <Text style={styles.loadingText}>Loading{".".repeat(dots)}</Text>
        <View style={styles.progressBarBackground}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
        <Text style={styles.footerText}>Please wait while we fetch your data</Text>
      </View>
    </View>
  );
};

// Responsive Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
  },
  box: {
    backgroundColor: "#fff",
    padding: scaleWidth(20),
    borderRadius: scaleWidth(10),
    alignItems: "center",
    width: scaleWidth(320), // 85% of base width (375)
    elevation: 5,
  },
  iconContainer: {
    width: scaleWidth(100),
    height: scaleHeight(100),
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  book: {
    width: scaleWidth(80),
    height: scaleHeight(50),
    backgroundColor: "#007AFF",
    borderRadius: scaleWidth(5),
  },
  circle: {
    position: "absolute",
    width: scaleWidth(40),
    height: scaleHeight(40),
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: scaleWidth(10),
    height: scaleHeight(10),
    backgroundColor: "#FFD700",
    borderRadius: scaleWidth(5),
  },
  title: {
    fontSize: scaleWidth(20),
    fontWeight: "bold",
    color: "#0056b3",
    marginTop: scaleHeight(10),
  },
  loadingText: {
    fontSize: scaleWidth(16),
    color: "#666",
    marginVertical: scaleHeight(10),
  },
  progressBarBackground: {
    width: "100%",
    alignItems: "center",
    marginBottom: scaleHeight(10),
  },
  footerText: {
    fontSize: scaleWidth(14),
    color: "#888",
  },
});

export default LoadingComponent;