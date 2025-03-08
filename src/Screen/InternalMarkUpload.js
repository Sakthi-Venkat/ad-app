import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, ActivityIndicator 
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const { width, height } = Dimensions.get("window");

const apiUrl = "YOUR_API_URL"; // Replace with your actual API URL

const InternalMarkUpload = () => {
  const [marksData, setMarksData] = useState([
    { rollNo: "", subject: "", marks: "", examDate: new Date(), showDatePicker: false }
  ]);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const updatedData = [...marksData];
    updatedData[index][field] = value;
    setMarksData(updatedData);
  };

  const toggleDatePicker = (index, visibility) => {
    const updatedData = [...marksData];
    updatedData[index].showDatePicker = visibility;
    setMarksData(updatedData);
  };

  const handleConfirmDate = (index, date) => {
    handleChange(index, "examDate", date);
    toggleDatePicker(index, false);
  };

  const addRow = () => {
    if (marksData.length < 10) {
      setMarksData([...marksData, { rollNo: "", subject: "", marks: "", examDate: new Date(), showDatePicker: false }]);
    } else {
      Toast.show({ type: "error", text1: "Maximum 10 rows allowed" });
    }
  };

  const removeRow = (index) => {
    if (marksData.length > 1) {
      const updatedData = marksData.filter((_, i) => i !== index);
      setMarksData(updatedData);
      Toast.show({ type: "success", text1: "Row deleted successfully" });
    } else {
      Toast.show({ type: "error", text1: "At least one row is required" });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const token = "YOUR_AUTH_TOKEN"; // Replace with actual token retrieval logic

    try {
      const res = await axios.post(`${apiUrl}/api/internal-marks/upload`, { marksData }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        Toast.show({ type: "success", text1: "Internal marks uploaded successfully" });
        setMarksData([{ rollNo: "", subject: "", marks: "", examDate: new Date(), showDatePicker: false }]);
      } else {
        Toast.show({ type: "error", text1: res.data.message });
      }
    } catch (err) {
      console.error("Error uploading internal marks:", err);
      Toast.show({ type: "error", text1: err.response?.data?.message || "Upload failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Internal Marks Upload</Text>

      {marksData.map((item, index) => (
        <View key={index} style={styles.card}>
          <TextInput
            style={styles.input}
            value={item.rollNo}
            onChangeText={(text) => handleChange(index, "rollNo", text)}
            placeholder="Enter Roll No"
          />

          <TextInput
            style={styles.input}
            value={item.subject}
            onChangeText={(text) => handleChange(index, "subject", text)}
            placeholder="Enter Subject"
          />

          <TextInput
            style={styles.input}
            value={item.marks}
            onChangeText={(text) => handleChange(index, "marks", text)}
            keyboardType="numeric"
            placeholder="Enter Marks"
          />

          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => toggleDatePicker(index, true)}
          >
            <Text style={styles.datePickerText}>
              {item.examDate.toDateString()}
            </Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={item.showDatePicker}
            mode="date"
            onConfirm={(date) => handleConfirmDate(index, date)}
            onCancel={() => toggleDatePicker(index, false)}
          />

          {marksData.length > 1 && (
            <TouchableOpacity style={styles.removeButton} onPress={() => removeRow(index)}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={addRow}>
          <Text style={styles.buttonText}>Add Row</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Upload Marks</Text>}
        </TouchableOpacity>
      </View>

      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    minHeight: height,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4a90e2",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    width: width * 0.9,
    marginBottom: 10,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#4a90e2",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  datePickerButton: {
    backgroundColor: "#4a90e2",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
  },
  datePickerText: {
    color: "#fff",
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: "#d9534f",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.9,
  },
  addButton: {
    backgroundColor: "#4a90e2",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  uploadButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default InternalMarkUpload;