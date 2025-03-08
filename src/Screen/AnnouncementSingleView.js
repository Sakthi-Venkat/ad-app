import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AnnouncementSingleView = ({ announcement }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleContent = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={toggleContent}>
      <Text style={styles.title}>{announcement.title}</Text>
      <Text style={styles.content}>
        {isExpanded
          ? announcement.content
          : announcement.content.length > 100
          ?` ${announcement.content.substring(0, 100)}...`
          : announcement.content}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#4B5563', // Equivalent to Tailwind's gray-600
  },
});

export default AnnouncementSingleView;