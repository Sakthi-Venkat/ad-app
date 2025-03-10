import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ToastAndroid } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";

const ExamHallPost = () => {
  const [formData, setFormData] = useState({
    rollNo: "",
    classRoom: "",
    examDate: new Date(),
    examHall: "",
    department: "",
    Year: "",
    ExamType: "",
  });
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const postHalls = async () => {
    setLoading(true);

    const requiredFields = ["rollNo", "classRoom", "examDate", "examHall", "department", "Year", "ExamType"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      ToastAndroid.show(`Missing fields: ${missingFields.join(", ")}`, ToastAndroid.LONG);
      setLoading(false);
      return;
    }

    try {
      const token = "YOUR_TOKEN_HERE";
      const res = await axios.post(`${apiUrl}/api/examAllocate`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        ToastAndroid.show("Exam Hall Allocated Successfully", ToastAndroid.SHORT);
        setFormData({ rollNo: "", classRoom: "", examDate: new Date(), examHall: "", department: "", Year: "", ExamType: "" });
      } else {
        ToastAndroid.show(res.data.message || "Failed to Allocate Exam Hall", ToastAndroid.LONG);
      }
    } catch (error) {
      ToastAndroid.show("Error Allocating Exam Hall", ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Exam Hall Allocation</Text>

      <View style={styles.inputContainer}>
        <FontAwesome name="id-card" size={20} color="#007BFF" />
        <TextInput
          style={styles.input}
          placeholder="Roll Number"
          keyboardType="numeric"
          value={formData.rollNo}
          onChangeText={(text) => handleChange("rollNo", text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="graduation-cap" size={20} color="#007BFF" />
        <TextInput
          style={styles.input}
          placeholder="Academic Year"
          value={formData.Year}
          onChangeText={(text) => handleChange("Year", text)}
        />
      </View>

      <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
        <FontAwesome name="calendar" size={20} color="#007BFF" />
        <Text style={styles.dateText}>{formData.examDate.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={formData.examDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) handleChange("examDate", selectedDate);
          }}
        />
      )}

      <RNPickerSelect
        onValueChange={(value) => handleChange("ExamType", value)}
        items={[
          { label: "Internal 1", value: "internal1" },
          { label: "Internal 2", value: "internal2" },
          { label: "Semester", value: "semester" },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: "Select Exam Type", value: "" }}
      />

      <TouchableOpacity style={styles.button} onPress={postHalls} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Allocate Exam Hall</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#007BFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  inputAndroid: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
});

export default ExamHallPost;
