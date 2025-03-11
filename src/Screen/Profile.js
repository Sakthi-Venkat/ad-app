import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ScrollView 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const navigation = useNavigation(); // No need for fallback

  const [formData, setFormData] = useState({
    email: "",
    roles: "",
    department: "",
    classRoom: "",
    rollNo: "",
    year: "", // Changed 'Year' to 'year'
  });

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = () => {
    alert("Profile updated successfully (Mock Action)");
    navigation.navigate("Dashboard");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Profile</Text>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Role:</Text>
          <TextInput
            style={styles.input}
            value={formData.roles}
            onChangeText={(text) => handleChange("roles", text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Department:</Text>
          <TextInput
            style={styles.input}
            value={formData.department}
            onChangeText={(text) => handleChange("department", text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Class Room:</Text>
          <TextInput
            style={styles.input}
            value={formData.classRoom}
            onChangeText={(text) => handleChange("classRoom", text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Roll No:</Text>
          <TextInput
            style={styles.input}
            value={formData.rollNo}
            onChangeText={(text) => handleChange("rollNo", text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Year:</Text>
          <TextInput
            style={styles.input}
            value={formData.year}
            onChangeText={(text) => handleChange("year", text)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>

      <Image source={require("../assets/profile.png")} style={styles.image} />
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#F5F5FA",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6b5b95",
    marginBottom: 20,
  },
  form: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "#5a4e8f",
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#c2b8f2",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#333",
  },
  button: {
    backgroundColor: "#8c7ae6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginTop: 30,
  },
});