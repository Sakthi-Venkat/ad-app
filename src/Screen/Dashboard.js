import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import DatePicker from "react-native-date-picker";
import Toast from "react-native-toast-message";
import { jwtDecode } from "jwt-decode";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const Dashboard = () => {
  const [userRole, setUserRole] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
          setUserRole(decoded.roles);
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
        setStudents(res.data.data || []);
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

  const handleBulkmarking = async () => {
    if (!date || !period || !classRoom || !department || !year) {
      Toast.show({ type: "error", text1: "Fill all required fields" });
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(
        `${apiUrl}/api/markAttendance`,
        { attendanceDate: date, classRoom, department, absent, period: Number(period), Year: year },
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

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${apiUrl}/api/getAttendance?attendanceDate=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setAttendanceRecords(res.data.data);
        Toast.show({ type: "success", text1: "Attendance records loaded" });
      } else {
        Toast.show({ type: "error", text1: "Failed to fetch attendance records" });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Error fetching attendance records" });
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#E3F2FD", padding: 20 }}>
      <Toast />
      {userRole === "staff" ? (
        <View>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#1565C0", marginBottom: 10 }}>
            Bulk Attendance Marking
          </Text>

          <TextInput placeholder="Year" value={year} onChangeText={setYear} style={styles.input} />
          <TextInput placeholder="Department" value={department} onChangeText={setDepartment} style={styles.input} />
          <TextInput placeholder="Class/Section" value={classRoom} onChangeText={setClassRoom} style={styles.input} />
          <TextInput placeholder="Period" value={period} onChangeText={setPeriod} keyboardType="numeric" style={styles.input} />

          


          <TouchableOpacity onPress={handleBulkmarking} style={styles.button}>
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
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#1565C0" }}>Attendance Dashboard</Text>

          

          <TouchableOpacity onPress={fetchAttendance} style={styles.button}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Fetch Attendance</Text>}
          </TouchableOpacity>

          {attendanceRecords && (
            <View>
              <Text>Total Periods: {attendanceRecords.total}</Text>
              <Text>Present: {attendanceRecords.percentCount}</Text>
              <Text>Percentage: {attendanceRecords.percentage}%</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = {
  input: { padding: 10, borderWidth: 1, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: "#1976D2", padding: 15, borderRadius: 5, alignItems: "center", marginTop: 10 },
  buttonText: { color: "white", fontWeight: "bold" },
  studentRow: { flexDirection: "row", justifyContent: "space-between", padding: 10, borderBottomWidth: 1 },
  attendanceGrid: {
    flex: 1,
    flexDirection: 'column', 
    padding: 20,
  },

  leftPanel: {
    width: '100%',
    alignItems: 'center',
  },

  inputContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    width: 300,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 15,
  },

  inputLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },

  inputField: {
    padding: 10,
    width: 250,
    borderColor: '#c2b8f2',
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 14,
    backgroundColor: '#ffffff',
    color: '#3d3b40',
  },

  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  studentsList: {
    backgroundColor: '#f0e6ff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  submitButton: {
    backgroundColor: '#b19cd9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
  },

  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 10,
  },

  successMessage: {
    color: 'green',
    fontWeight: 'bold',
  },

  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 5,
  },

  studentRoll: {
    fontWeight: 'bold',
    color: '#3d3b40',
    width: 80,
  },

  studentEmail: {
    flex: 1,
    color: '#8a8a8a',
    padding: 10,
  },

  wrongCheckbox: {
    width: 24,
    height: 24,
    backgroundColor: '#e06eff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  wrongCheckboxChecked: {
    backgroundColor: '#db8eff',
  },

  reportLink: {
    textDecorationLine: 'underline',
    color: '#8c7ae6',
    fontWeight: 'bold',
  },

  reportLinkHover: {
    color: '#5a4bb7',
  },
};

export default Dashboard;