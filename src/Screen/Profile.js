import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Alert, 
  ScrollView,
  ActivityIndicator
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const Profile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    roles: "",
    department: "",
    classRoom: "",
    rollNo: "",
    Year: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "No authentication token found. Please log in.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${apiUrl}/api/profile`, {
          headers: { Authorization: `Bearer ${token}`, client: "not browser" },
          withCredentials: true,
        });

        if (res.data.success && res.data.data) {
          setUser(res.data.data);
          setFormData({
            email: res.data.data.email || "",
            roles: Array.isArray(res.data.data.roles)
              ? res.data.data.roles.join(", ")
              : res.data.data.roles || "",
            department: res.data.data.department || "",
            classRoom: res.data.data.classRoom || "",
            rollNo: String(res.data.data.rollNo) || "",
            Year: res.data.data.Year || "I",
          });
        } else {
          Alert.alert("Error", res.data?.message || "User data not found");
        }
      } catch (error) {
        console.log("Fetch Error:", error);
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.patch(
       `${apiUrl}/api/updateprofile/${formData.rollNo}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}`, client: "not browser" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        Alert.alert("Success", "Profile updated successfully");
        navigation.navigate("Dashboard");
      } else {
        Alert.alert("Error", res.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Profile update failed");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6b5b95" />
      </View>
    );
  }

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
          <Text style={styles.label}>Year:</Text>
          <TextInput
            style={styles.input}
            value={formData.Year}
            onChangeText={(text) => handleChange("Year", text)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});