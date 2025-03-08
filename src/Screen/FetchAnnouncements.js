import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";

const apiUrl = "YOUR_API_URL"; // Replace with your API URL

const FetchAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIds, setExpandedIds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = "YOUR_AUTH_TOKEN"; // Replace with token retrieval logic
      const res = await axios.get(`${apiUrl}/api/announcements`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setAnnouncements(res.data.data || []);
        if (!refreshing) {
          Toast.show({ type: "success", text1: "Announcements fetched successfully" });
        }
      } else {
        Toast.show({ type: "error", text1: res.data.message });
        setError(res.data.message);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      Toast.show({ type: "error", text1: "Failed to fetch announcements" });
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnnouncements();
  };

  const toggleAnnouncement = (id) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading && !refreshing) {
    return <ActivityIndicator size="large" color="#4a90e2" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#f3f3f3" }}>
      <View
        style={{
          backgroundColor: "#4a90e2",
          padding: 16,
          borderRadius: 8,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather name="inbox" size={24} color="white" />
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginLeft: 8 }}>Inbox</Text>
        </View>
        <TouchableOpacity onPress={handleRefresh} disabled={loading || refreshing}>
          <Feather name="refresh-cw" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Feather name="alert-circle" size={40} color="red" />
          <Text style={{ color: "red", fontSize: 16, marginTop: 8 }}>Failed to load announcements</Text>
          <Text style={{ color: "gray", fontSize: 14 }}>{error}</Text>
          <TouchableOpacity
            onPress={fetchAnnouncements}
            style={{ marginTop: 12, padding: 10, backgroundColor: "#4a90e2", borderRadius: 6 }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : announcements.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Feather name="bell" size={40} color="gray" />
          <Text style={{ color: "gray", fontSize: 16, marginTop: 8 }}>No new messages</Text>
        </View>
      ) : (
        <FlatList
          data={announcements}
          keyExtractor={(item) => item._id}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          renderItem={({ item }) => {
            const isExpanded = expandedIds.includes(item._id);
            return (
              <TouchableOpacity
                style={{
                  backgroundColor: "#fff",
                  padding: 16,
                  borderRadius: 8,
                  marginVertical: 8,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
                onPress={() => toggleAnnouncement(item._id)}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold", color: "#4a90e2" }}>{item.title}</Text>
                  <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="gray" />
                </View>
                {isExpanded && <Text style={{ color: "#333", marginTop: 8 }}>{item.content}</Text>}
                <Text style={{ fontSize: 12, color: "gray", marginTop: 8 }}>{formatDate(item.createdAt)}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <Toast />
    </View>
  );
};

export default FetchAnnouncements;