import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, 
  Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import DatePicker from "react-native-date-picker";
import Toast from "react-native-toast-message";
import { jwtDecode } from "jwt-decode";

const apiUrl = process.env.EXPO_PUBLIC_API_URL || "https://your-api-url.com"; // Ensure fallback

const Dashboard = () => {
  const [userRole, setUserRole] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState("");
  const [classRoom, setClassRoom] = useState("");
  const [department, setDepartment] = useState("");
  const [date, setDate] = useState(new Date());
  const [period, setPeriod] = useState("");
  const [students, setStudents] = useState([]);
  const [absent, setAbsent] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Get user role from token
  useEffect(() => {
    const getUserRole = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserRole(decoded.roles?.[0] || ""); // Ensure it's a string
        } catch (err) {
          Toast.show({ type: "error", text1: "Authentication error" });
        }
      }
    };
    getUserRole();
  }, []);

  const fetchStudents = async () => {
    if (!classRoom || !department || !year) {
      Toast.show({ type: "warning", text1: "Select class, year, and department" });
      return;
    }

    setLoadingStudents(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        `${apiUrl}/api/getAllAttendance?classRoom=${classRoom}&department=${department}&Year=${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setStudents(Array.isArray(res.data.data) ? res.data.data : []);
        Toast.show({ type: "success", text1: res.data.message || "Students loaded" });
      } else {
        setStudents([]);
        Toast.show({ type: "error", text1: "No students found" });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: error.message || "Error fetching students" });
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    if (classRoom && department && year) fetchStudents();
  }, [classRoom, department, year]);

  const handleCheckBoxChange = (rollNo, checked) => {
    setAbsent((prev) => (checked ? [...prev, rollNo] : prev.filter((item) => item !== rollNo)));
  };

  const handleBulkMarking = async () => {
    if (!date || !period || !classRoom || !department || !year) {
      Toast.show({ type: "error", text1: "Fill all required fields" });
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const formattedDate = date.toISOString().split("T")[0]; // Convert date to YYYY-MM-DD

      const res = await axios.post(
        `${apiUrl}/api/markAttendance`,
        { attendanceDate: formattedDate, classRoom, department, absent, period: Number(period), Year: year },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        Toast.show({ type: "success", text1: "Attendance marked successfully" });
        setAbsent([]);
      } else {
        Toast.show({ type: "error", text1: "Attendance mark failed" });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: error.message || "Error marking attendance" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#E3F2FD", padding: 20 }}>
        <Toast />
        {userRole === "staff" ? (
          <View>
            <Text style={styles.heading}>Bulk Attendance Marking</Text>

            <TextInput placeholder="Year" value={year} onChangeText={setYear} style={styles.input} />
            <TextInput placeholder="Department" value={department} onChangeText={setDepartment} style={styles.input} />
            <TextInput placeholder="Class/Section" value={classRoom} onChangeText={setClassRoom} style={styles.input} />
            <TextInput placeholder="Period" value={period} onChangeText={setPeriod} keyboardType="numeric" style={styles.input} />

            <DatePicker date={date} onDateChange={setDate} mode="date" />

            <TouchableOpacity onPress={handleBulkMarking} style={styles.button}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Mark Attendance</Text>}
            </TouchableOpacity>

            <FlatList
              data={students}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.studentRow}>
                  <Text>{item.rollNo}</Text>
                  <Text>{item.email}</Text>
                  <TouchableOpacity onPress={() => handleCheckBoxChange(item.rollNo, !absent.includes(item.rollNo))}>
                    <Text>{absent.includes(item.rollNo) ? "✅" : "⬜"}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        ) : (
          <View>
            <Text style={styles.heading}>Attendance Dashboard</Text>

            <DatePicker date={date} onDateChange={setDate} mode="date" />

            <TouchableOpacity onPress={() => {}} style={styles.button}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Fetch Attendance</Text>}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = {
  heading: { fontSize: 22, fontWeight: "bold", color: "#1565C0", marginBottom: 10 },
  input: { padding: 10, borderWidth: 1, marginBottom: 10, borderRadius: 5, backgroundColor: "#fff" },
  button: { backgroundColor: "#1976D2", padding: 15, borderRadius: 5, alignItems: "center", marginTop: 10 },
  buttonText: { color: "white", fontWeight: "bold" },
  studentRow: { flexDirection: "row", justifyContent: "space-between", padding: 10, borderBottomWidth: 1 },
};

export default Dashboard;