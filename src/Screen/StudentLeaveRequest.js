import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import DocumentPicker from "react-native-document-picker";
import DatePicker from "react-native-date-picker";
import { showMessage } from "react-native-flash-message";

const StudentLeaveRequest = () => {
  const [formData, setFormData] = useState({
    type: "Leave",
    reason: "",
    rollNo: "",
    startDate: new Date(),
    endDate: new Date(),
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);

  const apiUrl = "YOUR_BACKEND_URL";  // Replace with your actual API URL

  // Handle File Selection
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });
      setFile(result);
    } catch (err) {
      console.log("File selection canceled:", err);
    }
  };

  // Handle Form Submission
  const handleSubmit = async () => {
    if (!formData.rollNo || !formData.reason) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    setLoading(true);
    const token = "YOUR_AUTH_TOKEN"; // Replace with stored authentication token

    const formSubmitData = new FormData();
    formSubmitData.append("type", formData.type);
    formSubmitData.append("reason", formData.reason);
    formSubmitData.append("rollNo", formData.rollNo);
    formSubmitData.append("startDate", formData.startDate.toISOString());
    formSubmitData.append("endDate", formData.endDate.toISOString());

    if (file) {
      formSubmitData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });
    }

    try {
      const response = await fetch(`${apiUrl}/api/leaveRequest`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formSubmitData,
      });

      const resData = await response.json();
      if (resData.success) {
        showMessage({ message: "Leave request submitted!", type: "success" });
        setFormData({ type: "Leave", reason: "", rollNo: "", startDate: new Date(), endDate: new Date() });
        setFile(null);
      } else {
        showMessage({ message: resData.message || "Submission failed", type: "danger" });
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      showMessage({ message: "Error submitting request", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#F3E8FF" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>Leave/OD Request</Text>

      {/* Roll No Input */}
      <TextInput
        placeholder="Enter Roll Number"
        value={formData.rollNo}
        onChangeText={(text) => setFormData({ ...formData, rollNo: text })}
        style={styles.input}
      />

      {/* Request Type Selection */}
      <TouchableOpacity
        style={styles.input}
        onPress={() =>
          setFormData((prev) => ({
            ...prev,
            type: prev.type === "Leave" ? "OD" : "Leave",
          }))
        }
      >
        <Text>{formData.type}</Text>
      </TouchableOpacity>

      {/* Date Pickers */}
      <TouchableOpacity onPress={() => setOpenStartDate(true)} style={styles.input}>
        <Text>Start Date: {formData.startDate.toDateString()}</Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={openStartDate}
        date={formData.startDate}
        onConfirm={(date) => {
          setFormData({ ...formData, startDate: date });
          setOpenStartDate(false);
        }}
        onCancel={() => setOpenStartDate(false)}
      />

      <TouchableOpacity onPress={() => setOpenEndDate(true)} style={styles.input}>
        <Text>End Date: {formData.endDate.toDateString()}</Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={openEndDate}
        date={formData.endDate}
        minimumDate={formData.startDate}
        onConfirm={(date) => {
          setFormData({ ...formData, endDate: date });
          setOpenEndDate(false);
        }}
        onCancel={() => setOpenEndDate(false)}
      />

      {/* Reason Input */}
      <TextInput
        placeholder="Reason for Leave"
        value={formData.reason}
        onChangeText={(text) => setFormData({ ...formData, reason: text })}
        multiline
        style={[styles.input, { height: 80 }]}
      />

      {/* File Upload */}
      <TouchableOpacity onPress={pickDocument} style={[styles.input, { backgroundColor: "#E0E0E0" }]}>
        <Text>{`file ? Selected: ${file.name} : "Attach Supporting Document"`}</Text>
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity onPress={handleSubmit} style={styles.button} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit Request</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  input: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#5A3E8B",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
};

export default StudentLeaveRequest;