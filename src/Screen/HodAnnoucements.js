import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from "react-native";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window"); // Get screen dimensions

const AnnouncementCreation = () => {
  const [formData, setFormData] = useState({ title: "", content: "" });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    Toast.show({ type: "success", text1: "Announcement created successfully (Mock Action)" });
    setFormData({ title: "", content: "" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Announcement</Text>

      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={formData.title}
        onChangeText={(text) => handleChange("title", text)}
        placeholder="Enter title"
      />

      <Text style={styles.label}>Content:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={formData.content}
        onChangeText={(text) => handleChange("content", text)}
        placeholder="Enter content"
        multiline
        numberOfLines={5}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Announcement</Text>
      </TouchableOpacity>

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.9, // 90% of screen width
    maxWidth: 500,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    alignSelf: "center",
    marginTop: height * 0.2, // 20% from top
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#4a90e2",
    textAlign: "center",
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4a90e2",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#4a90e2",
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#4a90e2",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AnnouncementCreation;