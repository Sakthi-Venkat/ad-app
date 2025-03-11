import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  StyleSheet 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons"; // Icons


const StudentLeaveStatus = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedReasons, setExpandedReasons] = useState({});

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const res = await axios.get(`${apiUrl}/api/leaveRequest/student`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setRequests(res.data.data || []);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert("Error fetching leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Get Status Style
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return { color: "#28A745", icon: "check-circle" };
      case "pending":
        return { color: "#FFC107", icon: "hourglass-empty" };
      case "rejected":
        return { color: "#DC3545", icon: "cancel" };
      default:
        return { color: "#6C757D", icon: "info" };
    }
  };

  // Toggle Expanded Reason
  const toggleReason = (id) => {
    setExpandedReasons((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredRequests = requests.filter((req) =>
    filter === "all" ? true : req.status.toLowerCase() === filter
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Leave/OD Requests</Text>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {["all", "pending", "approved", "rejected"].map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setFilter(status)}
            style={[
              styles.filterButton,
              filter === status && styles.activeFilterButton,
            ]}
          >
            <Text style={[styles.filterText, filter === status && { color: "#FFF" }]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Leave Requests */}
      {filteredRequests.length === 0 ? (
        <Text style={styles.noRequestsText}>No leave requests found.</Text>
      ) : (
        filteredRequests.map((req) => {
          const statusStyle = getStatusStyle(req.status);
          return (
            <View key={req._id} style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <Text style={styles.requestType}>{req.type} Request</Text>
                <View style={styles.statusBadge}>
                  <MaterialIcons name={statusStyle.icon} size={18} color={statusStyle.color} />
                  <Text style={[styles.statusText, { color: statusStyle.color }]}>
                    {req.status}
                  </Text>
                </View>
              </View>

              {/* Reason */}
              <View>
                <Text style={styles.reasonLabel}>Reason:</Text>
                <Text numberOfLines={expandedReasons[req._id] ? 0 : 3} style={styles.reasonText}>
                  {req.reason}
                </Text>
                {req.reason.length > 100 && (
                  <TouchableOpacity onPress={() => toggleReason(req._id)}>
                    <Text style={styles.toggleText}>
                      {expandedReasons[req._id] ? "Show Less" : "Read More"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

export default StudentLeaveStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#007BFF",
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#007BFF",
    marginHorizontal: 5,
  },
  activeFilterButton: {
    backgroundColor: "#007BFF",
  },
  filterText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  noRequestsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6C757D",
    marginTop: 20,
  },
  requestCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  requestType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#343A40",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9ECEF",
    padding: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#495057",
  },
  reasonText: {
    fontSize: 14,
    color: "#6C757D",
    marginTop: 5,
  },
  toggleText: {
    color: "#007BFF",
    fontWeight: "bold",
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});