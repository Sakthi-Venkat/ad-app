import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const { width: wp, height: hp } = Dimensions.get("window");
const apiUrl = process.env.REACT_APP_API_URL;

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rollNo: "",
    roles: "student",
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password || !formData.rollNo || !formData.roles) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/api/register`, formData);

      if (res.data.success) {
        Alert.alert("Success", "User created successfully");
        setFormData({ email: "", password: "", rollNo: "", roles: "student" });
        navigation.navigate('Dashbord');
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.form}>
          <Text style={[styles.title, { fontSize: wp > 400 ? 24 : 18 }]}>Create Account</Text>
          <Text style={[styles.subtitle, { fontSize: wp > 400 ? 18 : 14 }]}>Register for institutional access</Text>

          {error && <Text style={styles.errorMessage}>{error}</Text>}
          {success && <Text style={styles.successMessage}>{success}</Text>}

          <TextInput
            style={[styles.input, { fontSize: wp > 400 ? 14 : 12 }]}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
          <TextInput
            style={[styles.input, { fontSize: wp > 400 ? 14 : 12 }]}
            placeholder="Roll No"
            keyboardType="numeric"
            value={formData.rollNo}
            onChangeText={(text) => setFormData({ ...formData, rollNo: text })}
          />
          <TextInput
            style={[styles.input, { fontSize: wp > 400 ? 14 : 12 }]}
            placeholder="Password"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
          />
          <TextInput
            style={[styles.input, { fontSize: wp > 400 ? 14 : 12 }]}
            placeholder="Role (student, staff, hod)"
            value={formData.roles}
            onChangeText={(text) => setFormData({ ...formData, roles: text })}
          />

          <Button title="Signup" onPress={handleSubmit} color="#4C51BF" />

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    padding: wp * 0.04,
  },
  card: {
    backgroundColor: "white",
    width: "100%",
    maxWidth: 600,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    padding: wp * 0.08,
    marginTop: hp * 0.05,
  },
  form: {
    width: "100%",
    padding: 12,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: hp * 0.02,
  },
  subtitle: {
    textAlign: "center",
    color: "#718096",
    marginBottom: hp * 0.03,
  },
  input: {
    backgroundColor: "#F9FAFB",
    paddingVertical: hp * 0.02,
    paddingHorizontal: wp * 0.04,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: hp * 0.02,
    fontSize: wp > 400 ? 14 : 12,
    color: "#0d1b2a",
  },
  errorMessage: {
    color: "#E53E3E",
    textAlign: "center",
    marginBottom: hp * 0.02,
  },
  successMessage: {
    color: "#38A169",
    textAlign: "center",
    marginBottom: hp * 0.02,
  },
  linkContainer: {
    marginTop: hp * 0.03,
    alignItems: "center",
  },
  linkText: {
    color: "#4C51BF",
    textDecorationLine: "underline",
  },
});

export default RegisterScreen;
