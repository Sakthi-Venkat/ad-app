import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  ActivityIndicator, StyleSheet, Alert 
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const CCAttendance = () => {
  const [attendanceDate, setAttendanceDate] = useState("");
  const [classRoom, setClassRoom] = useState("");
  const [department, setDepartment] = useState("");
  const [attendanceByPeriod, setAttendanceByPeriod] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchAttendanceForCC = async () => {
    if (!department || !classRoom || !attendanceDate) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(`${apiUrl}/api/attendance/cc `,{
        params: { attendanceDate, classRoom, department },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setAttendanceByPeriod(res.data.data);
        Alert.alert("Success", res.data.message);
      } else {
        Alert.alert("Error", res.data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while fetching attendance");
    }

    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Icon name="users" size={24} color="white" />
        <Text style={styles.headerText}>Class Attendance Dashboard</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Icon name="building" size={20} color="#2563EB" style={styles.icon} />
          <TextInput
            placeholder="Department (e.g., CSE)"
            value={department}
            onChangeText={setDepartment}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="users" size={20} color="#2563EB" style={styles.icon} />
          <TextInput
            placeholder="Section (e.g., 10A)"
            value={classRoom}
            onChangeText={setClassRoom}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="calendar" size={20} color="#2563EB" style={styles.icon} />
          <TextInput
            placeholder="YYYY-MM-DD"
            value={attendanceDate}
            onChangeText={setAttendanceDate}
            style={styles.input}
          />
        </View>

        <TouchableOpacity onPress={fetchAttendanceForCC} style={styles.button}>
          <Icon name="search" size={18} color="white" />
          <Text style={styles.buttonText}>Fetch Attendance</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 10 }} />}
      </View>

      {Object.keys(attendanceByPeriod).length > 0 && (
        <View style={styles.results}>
          <Text style={styles.resultTitle}>Attendance Details</Text>
          {Object.entries(attendanceByPeriod).map(([period, records]) => (
            <View key={period} style={styles.periodCard}>
              <Text style={styles.periodTitle}>Period {period}</Text>
              <Text style={styles.attendanceText}>
                <Text style={styles.boldText}>Total Students:</Text> {records.length}
              </Text>
              <Text style={[styles.attendanceText, { color: "green" }]}>
                <Text style={styles.boldText}>Present:</Text> {records.Present.join(", ") || "None"}
              </Text>
              <Text style={[styles.attendanceText, { color: "red" }]}>
                <Text style={styles.boldText}>Absent:</Text> {records.absent.join(", ") || "None"}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F3F4F6",
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  headerText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  form: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    marginBottom: 15,
    paddingBottom: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    color: "#374151",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  results: {
    marginTop: 20,
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 10,
  },
  periodCard: {
    backgroundColor: "#F9FAFB",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
  },
  periodTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  attendanceText: {
    fontSize: 14,
    color: "#4B5563",
  },
  boldText: {
    fontWeight: "bold",
  },
});

export default CCAttendance;