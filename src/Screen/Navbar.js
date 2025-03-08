import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import jwtDecode from "jwt-decode";
import { Ionicons } from "@expo/vector-icons";

const Navbar = () => {
  const [role, setRole] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRole = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setRole(decoded.roles);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };
    fetchRole();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.navigate("Login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const renderLinks = () => {
    let links = [];

    if (role === "student") {
      links = [
        { label: "Dashboard", screen: "Dashboard" },
        { label: "Profile", screen: "Profile" },
        { label: "Announcements", screen: "FetchAnnouncements" },
        { label: "Internal Marks", screen: "MarksView" },
        { label: "Leave/OD Request", screen: "LeaveRequest" },
        { label: "My Reports", screen: "StudentReports" },
      ];
    } else if (role === "staff") {
      links = [
        { label: "Dashboard", screen: "Dashboard" },
        { label: "Profile", screen: "Profile" },
        { label: "Announcements", screen: "FetchAnnouncements" },
        { label: "Upload Marks", screen: "UploadMarks" },
        { label: "Leave/OD Approvals", screen: "LeaveRequestAdmin" },
        { label: "Class Report", screen: "CCAttendance" },
      ];
    } else if (role === "hod") {
      links = [
        { label: "Dashboard", screen: "CumulativeReport" },
        { label: "Profile", screen: "Profile" },
        { label: "Announcements", screen: "HodAnnouncements" },
        { label: "Leave Approvals", screen: "LeaveRequestAdmin" },
        { label: "Class Reports", screen: "CCAttendance" },
      ];
    } else {
      links = [
        { label: "Dashboard", screen: "Dashboard" },
        { label: "Profile", screen: "Profile" },
      ];
    }

    return links.map((link, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          setIsOpen(false);
          navigation.navigate(link.screen);
        }}
        style={styles.menuItem}
      >
        <Text style={styles.menuText}>{link.label}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View>
      {/* Hamburger Button */}
      <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerButton}>
        <Ionicons name={isOpen ? "close" : "menu"} size={24} color="white" />
      </TouchableOpacity>

      {/* Modal for Sidebar */}
      <Modal transparent={true} visible={isOpen} animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.sidebar}>
            <Text style={styles.title}>Portal</Text>
            <ScrollView style={styles.menu}>{renderLinks()}</ScrollView>

            {/* Logout Button */}
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  hamburgerButton: {
    position: "absolute",
    left: 20,
    top: 40,
    zIndex: 50,
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sidebar: {
    width: 250,
    backgroundColor: "white",
    height: "100%",
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 20,
  },
  menu: {
    width: "100%",
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Navbar;