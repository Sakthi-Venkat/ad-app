import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import RNPickerSelect from "react-native-picker-select";

const apiUrl = process.env.EXPO_PUBLIC_API_URL; // Replace with your API URL

const InternalMarkUpload = () => {
  const [department, setDepartment] = useState("");
  const [classRoom, setClassRoom] = useState("");
  const [year, setYear] = useState("");
  const [examType, setExamType] = useState("");
  const [subject, setSubject] = useState("");
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    if (!department || !classRoom || !year) {
      Toast.show({ type: "error", text1: "Please select all fields" });
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(
        `${apiUrl}/api/getAllAttendance?classRoom=${classRoom}&department=${department}&Year=${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setStudents(res.data.data);
        Toast.show({ type: "success", text1: "Students fetched successfully" });
      } else {
        Toast.show({ type: "error", text1: "Failed to fetch students" });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Error fetching students" });
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (rollNo, value) => {
    setMarks((prev) => ({ ...prev, [rollNo]: value }));
  };

  const handleSubmit = async () => {
    if (!examType || students.length === 0) {
      Toast.show({ type: "error", text1: "Please complete all selections" });
      return;
    }

    const payload = students.map((student) => ({
      rollNo: student.rollNo,
      examType,
      marks: marks[student.rollNo] || 0,
      subject,
    }));

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(
        `${apiUrl}/api/internal-marks/upload`,
        { marksData: payload },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        Toast.show({ type: "success", text1: "Marks uploaded successfully" });
        setMarks({});
        setStudents([]);
      } else {
        Toast.show({ type: "error", text1: "Failed to upload marks" });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Error uploading marks" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Internal Mark Upload</Text>

      {/* Dropdown Selectors */}
      <RNPickerSelect
        onValueChange={setDepartment}
        items={[
          { label: "CSE", value: "CSE" },
          { label: "IT", value: "IT" },
          { label: "ECE", value: "ECE" },
          { label: "EEE", value: "EEE" },
          { label: "MECH", value: "MECH" },
        ]}
        placeholder={{ label: "Select Department", value: null }}
        style={pickerStyles}
      />

      <RNPickerSelect
        onValueChange={setClassRoom}
        items={[
          { label: "A", value: "A" },
          { label: "B", value: "B" },
          { label: "C", value: "C" },
        ]}
        placeholder={{ label: "Select Class", value: null }}
        style={pickerStyles}
      />

      <RNPickerSelect
        onValueChange={setYear}
        items={[
          { label: "I", value: "I" },
          { label: "II", value: "II" },
          { label: "III", value: "III" },
          { label: "IV", value: "IV" },
        ]}
        placeholder={{ label: "Select Year", value: null }}
        style={pickerStyles}
      />

      <RNPickerSelect
        onValueChange={setExamType}
        items={[
          { label: "Internal 1", value: "internal1" },
          { label: "Internal 2", value: "internal2" },
          { label: "Semester", value: "semester" },
        ]}
        placeholder={{ label: "Select Exam Type", value: null }}
        style={pickerStyles}
      />

      <RNPickerSelect
        onValueChange={setSubject}
        items={[
          { label: "Subject 1", value: "sub1" },
          { label: "Subject 2", value: "sub2" },
          { label: "Subject 3", value: "sub3" },
        ]}
        placeholder={{ label: "Select Subject", value: null }}
        style={pickerStyles}
      />

      {/* Fetch Students Button */}
      <TouchableOpacity style={styles.button} onPress={fetchStudents}>
        <Text style={styles.buttonText}>Fetch Students</Text>
      </TouchableOpacity>

      {/* Student List */}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.rollNo}
          renderItem={({ item }) => (
            <View style={styles.studentRow}>
              <Text style={styles.studentText}>{item.rollNo}</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                maxLength={3}
                placeholder="Marks"
                value={marks[item.rollNo] || ""}
                onChangeText={(value) => handleMarksChange(item.rollNo, value)}
              />
            </View>
          )}
        />
      )}

      {/* Submit Button */}
      {students.length > 0 && (
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Upload Marks</Text>
        </TouchableOpacity>
      )}

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#007bff" },
  button: { backgroundColor: "#007bff", padding: 10, borderRadius: 8, alignItems: "center", marginVertical: 10 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  studentRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  studentText: { fontSize: 16 },
  input: { borderBottomWidth: 1, width: 80, textAlign: "center" },
});

const pickerStyles = {
  inputIOS: { fontSize: 16, padding: 12, backgroundColor: "#fff", borderRadius: 8, marginBottom: 10 },
  inputAndroid: { fontSize: 16, padding: 12, backgroundColor: "#fff", borderRadius: 8, marginBottom: 10 },
};

export default InternalMarkUpload;