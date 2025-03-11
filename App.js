import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import SignupPage from "./src/Screen/SignupPage";
import Login from "./src/Screen/Login";
import HomePage from "./src/Screen/HomePage";
import Dashboard from "./src/Screen/Dashboard";
import LeaveApproval from "./src/Screen/LeaveApproval";
import ForgotPassword from "./src/Screen/ForgotPassword";
import profile from "./src/Screen/Profile";
import HodAnnoucements from "./src/Screen/HodAnnoucements";
import StudentLeaveStatus from "./src/Screen/StudentLeaveStatus";
import InternalMarkUpload from "./src/Screen/InternalMarkUpload";
import StudentReports from "./src/Screen/StudentReports";
import FetchAnnouncements from "./src/Screen/FetchAnnouncements";
import ExamHallFinder from "./src/Screen/ExamHallFinder";


const Stack = createStackNavigator();


function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePage" component={HomePage} />
      <Stack.Screen name="Signup" component={SignupPage} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="LeaveApproval" component={LeaveApproval} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Profile" component={profile} />
      <Stack.Screen name="HodAnnoucements" component={HodAnnoucements} />
      <Stack.Screen name="StudentLeaveStatus" component={StudentLeaveStatus} />
      <Stack.Screen name="InternalMarkUpload" component={InternalMarkUpload} />
      <Stack.Screen name="StudentReports" component={StudentReports} />
      <Stack.Screen name="FetchAnnouncements" component={FetchAnnouncements} />
      <Stack.Screen name="ExamHallFinder" component={ExamHallFinder} />
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
