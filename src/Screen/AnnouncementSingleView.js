import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const AnnouncementSingleView = ({ announcement }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleContent = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <TouchableOpacity onPress={toggleContent} style={styles.container}>
      <Text style={styles.title}>{announcement.title}</Text>
      <Text style={styles.content}>
        {isExpanded
          ? announcement.content
          : announcement.content.length > 100
          ? `${announcement.content.substring(0, 100)}...`
          : announcement.content}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#fff",
    elevation: 2, // for Android shadow effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    color: "#555",
  },
});

export default AnnouncementSingleView;