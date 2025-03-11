import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Profile from "./Profile";
import LeaveApproval from "./LeaveApproval";
import StudentReports from "./StudentReports";
import InternalMarkUpload from "./InternalMarkUpload";
import ExamHallFinder from "./ExamHallFinder";

// Get device dimensions
const { width, height } = Dimensions.get("window");

// Create Drawer Navigator
const Drawer = createDrawerNavigator();

// Dummy Screens (Replace with actual components)
const HomeScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.screenText}>Home Screen</Text>
  </View>
);

const FetchAnnouncements = () => (
  <View style={styles.screen}>
    <Text style={styles.screenText}>Announcement Screen</Text>
  </View>
);

// Custom Drawer Content
const CustomDrawerContent = ({ navigation }) => {
  return (
    <View style={styles.drawerContainer}>
      <Text style={styles.title}>Portal</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text style={styles.menuItem}>Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Text style={styles.menuItem}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("FetchAnnouncements")}>
        <Text style={styles.menuItem}>Announcement</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("InternalMarkUpload")}>
        <Text style={styles.menuItem}>Internal Mark Upload</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("LeaveApproval")}>
        <Text style={styles.menuItem}>Leave/OD Request</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("StudentReports")}>
        <Text style={styles.menuItem}>Report of Your Class</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ExamHallFinder")}>
        <Text style={styles.menuItem}>Exam Hall</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logout} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      
    </View>
  );
};

// Drawer Navigator
const AppDrawer = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Announcement" component={FetchAnnouncements} />
      <Drawer.Screen name="InternalMarkUpload" component={InternalMarkUpload} />
      <Drawer.Screen name="LeaveApproval" component={LeaveApproval} />
      <Drawer.Screen name="StudentReports" component={StudentReports} />
      <Drawer.Screen name="ExamHallFinder" component={ExamHallFinder} />
    </Drawer.Navigator>
  );
};

export default function App() {
  return <AppDrawer />;
}

// Responsive Styles
const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    padding: width * 0.06, // 5% of screen width
    
    backgroundColor: "#fff",
  },
  title: {
    fontSize: width * 0.06, // Scales with screen width
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.02, // Scales with screen height
    color: "#007BFF",
  },
  menuItem: {
    fontSize: width * 0.045,
    paddingVertical: height * 0.012, 
    color: "#333",
    paddingVertical:20,
  },
  logout: {
    backgroundColor: "blue",
    borderRadius: width * 0.1, // Scales with width
    paddingVertical: height * 0.015,
    marginTop: height * 0.03,
    alignItems: "center",
    marginVertical:20,
  },
  logoutText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screenText: {
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
});