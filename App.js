import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import SignupPage from "./src/Screen/SignupPage";
import Login from "./src/Screen/Login";
import HomePage from "./src/Screen/HomePage";
import Dashboard from "./src/Screen/Dashboard";
import LeaveApproval from "./src/Screen/LeaveApproval";




// Stack Navigator for Main Screens
const Stack = createStackNavigator();


function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="Signup" component={SignupPage} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="LeaveApproval" component={LeaveApproval} />
    </Stack.Navigator>
  );
}



export default function App() {
  return (
    <NavigationContainer>
      <MainStackNavigator />
      <Toast />
    </NavigationContainer>
  );
}