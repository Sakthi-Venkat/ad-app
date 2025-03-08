import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  Dimensions,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { Ionicons } from "@expo/vector-icons"; // Icons for status


const { width, height } = Dimensions.get("window");

// Scaling functions
const scaleWidth = (size) => (width / 375) * size; // 375 is the base width (e.g., iPhone 12)
const scaleHeight = (size) => (height / 812) * size; // 812 is the base height (e.g., iPhone 12)

const LeaveApproval = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserRole(decoded.roles);
        } catch (err) {
          console.error("Error decoding token:", err);
        }
      }
    };
    fetchUserRole();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${apiUrl}/api/leaveRequestadmin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setRequests(res.data.data || []);
      } else {
        Alert.alert("Error", res.data.message);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to fetch requests.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (requestId, status) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.patch(
        `${apiUrl}/api/leaverequest/${requestId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        Alert.alert("Success", "Status updated successfully");
        fetchRequests();
      } else {
        Alert.alert("Error", res.data.message);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to update status.");
    }
  };

  const handleSendToHod = async (requestId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.patch(
        `${apiUrl}/api/leaverequest/foward/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        Alert.alert("Success", "Request sent to HOD");
        fetchRequests();
      } else {
        Alert.alert("Error", "Failed to send request to HOD");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send request to HOD");
    }
  };

  const statusStyles = {
    Approved: { backgroundColor: "#d4edda", color: "#155724" },
    Rejected: { backgroundColor: "#f8d7da", color: "#721c24" },
    pendingHod: { backgroundColor: "#d1c4e9", color: "#311b92" },
    Pending: { backgroundColor: "#fff3cd", color: "#856404" },
  };

  const RequestCard = ({ req }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.studentId}>Student ID: {req.rollNo}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusStyles[req.status].backgroundColor },
          ]}
        >
          <Text style={{ color: statusStyles[req.status].color }}>{req.status}</Text>
        </View>
      </View>

      <Text style={styles.reasonLabel}>Reason:</Text>
      <Text style={styles.reasonText}>{req.reason}</Text>

      {req.filePath && (
        <TouchableOpacity
          onPress={() => Linking.openURL(`${apiUrl}/uploads/${req.filePath}`)}
          style={styles.documentButton}
        >
          <Text style={styles.documentButtonText}>View Document</Text>
        </TouchableOpacity>
      )}

      {req.status === "Pending" && !req.forwarded && userRole === "staff" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => handleStatusUpdate(req._id, "Approved")}
            style={[styles.button, { backgroundColor: "green" }]}
          >
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleStatusUpdate(req._id, "Rejected")}
            style={[styles.button, { backgroundColor: "red" }]}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSendToHod(req._id)}
            style={[styles.button, { backgroundColor: "purple" }]}
          >
            <Text style={styles.buttonText}>Forward to HOD</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Leave/OD Approval Dashboard</Text>
        <Text style={styles.subHeaderText}>Manage and process student requests</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : requests.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="inbox-outline" size={scaleWidth(50)} color="gray" />
          <Text style={styles.emptyStateText}>No leave or OD requests found.</Text>
        </View>
      ) : (
        requests.map((req) => <RequestCard key={req._id} req={req} />)
      )}
    </ScrollView>
  );
};

// Responsive Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:scaleHeight(20),
    padding: scaleWidth(16),
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    marginBottom: scaleHeight(20),
  },
  headerText: {
    fontSize: scaleWidth(24),
    fontWeight: "bold",
    color: "#007AFF",
  },
  subHeaderText: {
    fontSize: scaleWidth(14),
    color: "#555",
  },
  card: {
    backgroundColor: "white",
    padding: scaleWidth(16),
    borderRadius: scaleWidth(10),
    marginBottom: scaleHeight(10),
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: scaleHeight(10),
  },
  studentId: {
    fontWeight: "bold",
    fontSize: scaleWidth(16),
  },
  statusBadge: {
    padding: scaleWidth(5),
    borderRadius: scaleWidth(10),
  },
  reasonLabel: {
    marginTop: scaleHeight(10),
    fontSize: scaleWidth(14),
    color: "#555",
  },
  reasonText: {
    backgroundColor: "#f9f9f9",
    padding: scaleWidth(10),
    borderRadius: scaleWidth(5),
    marginTop: scaleHeight(5),
  },
  documentButton: {
    backgroundColor: "#007AFF",
    padding: scaleWidth(10),
    marginTop: scaleHeight(10),
    borderRadius: scaleWidth(5),
    alignItems: "center",
  },
  documentButtonText: {
    color: "white",
    fontSize: scaleWidth(14),
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: scaleHeight(10),
  },
  button: {
    flex: 1,
    padding: scaleWidth(10),
    borderRadius: scaleWidth(5),
    margin: scaleWidth(5),
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: scaleWidth(14),
  },
  emptyState: {
    alignItems: "center",
    padding: scaleWidth(20),
  },
  emptyStateText: {
    fontSize: scaleWidth(16),
    color: "gray",
    marginTop: scaleHeight(10),
  },
});

export default LeaveApproval;