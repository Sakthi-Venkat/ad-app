import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import { Picker } from "@react-native-picker/picker";

const { width, height } = Dimensions.get("window");

// Scaling functions
const scaleWidth = (size) => (width / 375) * size; // 375 is the base width (e.g., iPhone 12)
const scaleHeight = (size) => (height / 812) * size; // 812 is the base height (e.g., iPhone 12)

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const DepartmentAttendanceDashboard = () => {
  const [department, setDepartment] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const fetchAttendanceReports = async () => {
    setLoading(true);
    setError("");

    if (!department) {
      showMessage({
        message: "Please select a department.",
        type: "danger",
      });
      setLoading(false);
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/api/getCumulativeAttendance`, {
        params: { department, attendanceDate: today },
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.data.success) {
        setAttendanceData(response.data.data);
        showMessage({
          message: "Attendance data fetched successfully",
          type: "success",
        });
      } else {
        setError(response.data.message || "Failed to fetch data");
        showMessage({
          message: response.data.message || "Failed to fetch data",
          type: "danger",
        });
      }
    } catch (error) {
      setError("Failed to fetch attendance data");
      showMessage({
        message: "Failed to fetch attendance data",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (department) {
      fetchAttendanceReports();
    }
  }, [department]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Department Attendance Dashboard</Text>
      <Text style={styles.subHeader}>
        {department} Department - Attendance for {today}
      </Text>

      {/* Department Selector */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select Department:</Text>
        <Picker
          selectedValue={department}
          onValueChange={(value) => setDepartment(value)}
          style={styles.picker}
          enabled={!loading} // Disable picker while loading
        >
          <Picker.Item label="Select Department" value="" />
          <Picker.Item label="CSE" value="CSE" />
          <Picker.Item label="IT" value="IT" />
          <Picker.Item label="ECE" value="ECE" />
        </Picker>
      </View>

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="#8c7ae6" style={styles.loading} />}

      {/* Error Message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Attendance Data Table */}
      <FlatList
        data={attendanceData}
        keyExtractor={(item) => item.classRoom}
        ListHeaderComponent={() =>
          attendanceData.length > 0 ? (
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Class</Text>
              <Text style={styles.tableHeaderText}>Total</Text>
              <Text style={styles.tableHeaderText}>Present</Text>
              <Text style={styles.tableHeaderText}>Percentage</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={() =>
          !loading && (
            <Text style={styles.noData}>No attendance data available</Text>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableText}>{item.classRoom}</Text>
            <Text style={styles.tableText}>{item.total}</Text>
            <Text style={styles.tableText}>{item.present}</Text>
            <Text style={styles.tableText}>
              {item.percentage ? item.percentage.toFixed(2) : "0.00"}%
            </Text>
          </View>
        )}
      />
    </View>
  );
};

// Responsive Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f0ff",
    padding: scaleWidth(40),
  },
  header: {
    backgroundColor: "#8c7ae6",
    color: "#fff",
    textAlign: "center",
    fontSize: scaleWidth(22),
    fontWeight: "bold",
    padding: scaleWidth(15),
    borderRadius: scaleWidth(8),
    marginBottom: scaleHeight(10),
  },
  subHeader: {
    color: "#8c7ae6",
    fontSize: scaleWidth(16),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: scaleHeight(20),
  },
  pickerContainer: {
    backgroundColor: "#fff",
    padding: scaleWidth(10),
    borderRadius: scaleWidth(6),
    marginBottom: scaleHeight(20),
  },
  label: {
    fontSize: scaleWidth(16),
    fontWeight: "bold",
    color: "#3b3050",
    marginBottom: scaleHeight(5),
  },
  picker: {
    height: scaleHeight(40),
    borderColor: "#c2b8f2",
    borderWidth: 1,
    borderRadius: scaleWidth(6),
  },
  loading: {
    marginVertical: scaleHeight(20),
  },
  error: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: scaleHeight(10),
  },
  noData: {
    color: "#8a8a8a",
    textAlign: "center",
    marginVertical: scaleHeight(20),
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#d9c2ff",
    paddingVertical: scaleHeight(10),
    borderRadius: scaleWidth(6),
    marginBottom: scaleHeight(5),
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    color: "#3b3050",
    textAlign: "center",
    fontSize: scaleWidth(14),
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: scaleHeight(8),
    borderRadius: scaleWidth(6),
    marginBottom: scaleHeight(5),
  },
  tableText: {
    flex: 1,
    color: "#3b3050",
    textAlign: "center",
    fontSize: scaleWidth(14),
  },
});

export default DepartmentAttendanceDashboard;