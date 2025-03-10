import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert 
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://your-api-url.com"; // Replace with your API URL

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [fPCode, setFPCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState("send");
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();                      8

  const sendForgotPasswordCode = async () => {
    if (!email) {
      Toast.show({ type: "error", text1: "Error", text2: "Please enter your email" });
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/api/sendForgotPassCode`, { email });

      if (res.data.success) {
        Toast.show({ type: "success", text1: "Success", text2: res.data.message });
        setStep("verify");
      } else {
        Toast.show({ type: "error", text1: "Error", text2: res.data.message });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: error.response?.data?.message || "An error occurred" });
    }
  };

  const verifyForgotPasswordCode = async () => {
    if (!email || !fPCode || !newPassword) {
      Toast.show({ type: "error", text1: "Error", text2: "Please fill all the fields" });
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/api/verifyForgotPassCode`, {
        email,
        providedCode: fPCode,
        newPassword,
      });

      if (res.data.success) {
        Toast.show({ type: "success", text1: "Success", text2: res.data.message });
        navigation.navigate("Login");
      } else {
        Toast.show({ type: "error", text1: "Error", text2: res.data.message });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: error.response?.data?.message || "An error occurred" });
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f0f0", padding: 20 }}>
      <View style={{ backgroundColor: "#fff", padding: 20, width: "100%", borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
          {step === "send" ? "Forgot Password" : "Verify Code"}
        </Text>

        {step === "send" && (
          <>
            <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 10, marginBottom: 10 }}>
              <Icon name="envelope" size={20} color="#555" />
              <TextInput 
                style={{ flex: 1, padding: 10 }}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity 
              onPress={sendForgotPasswordCode}
              style={{ backgroundColor: "#6200ea", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Send Verification Code</Text>
            </TouchableOpacity>
          </>
        )}

        {step === "verify" && (
          <>
            <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 10, marginBottom: 10 }}>
              <Icon name="lock" size={20} color="#555" />
              <TextInput 
                style={{ flex: 1, padding: 10 }}
                placeholder="Enter verification code"
                value={fPCode}
                onChangeText={setFPCode}
                keyboardType="numeric"
                autoCapitalize="none"
              />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 10, marginBottom: 10 }}>
              <Icon name="key" size={20} color="#555" />
              <TextInput 
                style={{ flex: 1, padding: 10 }}
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="#555" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={verifyForgotPasswordCode}
              style={{ backgroundColor: "#6200ea", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Verify and Reset Password</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={{ textAlign: "center", color: "#6200ea", marginTop: 20 }}>Remember your password? Login</Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </View>
  );
};

export default ForgotPasswordScreen;