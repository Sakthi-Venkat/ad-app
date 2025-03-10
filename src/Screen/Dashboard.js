import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Profile from "./Profile";

const Drawer = createDrawerNavigator();

const Dashboard = () => {
  return (
    <Drawer.Navigator drawerContent={CustomDrawerContent}>
      <Drawer.Screen name="Home" component={Dashboard} initialParams={{ title: "Home" }} />
      <Drawer.Screen name="Profile" component={Profile} initialParams={{ title: "Profile" }} />
      {/* Add other screens as needed */}
    </Drawer.Navigator>
  );
};



const CustomDrawerContent = ({ navigation }) => {
  return (
    <View style={styles.drawerContainer}>
      <Text style={styles.title}>Portal</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
        <Text style={styles.menuItem}>Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Text style={styles.menuItem}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Announcement")}>
        <Text style={styles.menuItem}>Announcement</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("InternalMarkUpload")}>
        <Text style={styles.menuItem}>InternalMarkUpload</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#007BFF",
  },
  menuItem: {
    fontSize: 16,
    paddingVertical: 10,
    color: "#333",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  screenText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Dashboard;
