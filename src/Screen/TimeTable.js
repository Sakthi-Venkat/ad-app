import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const TimeTable = () => {
  const [timeTable, setTimeTable] = useState([]);

  useEffect(() => {
    fetchTimeTable();
  }, []);

  const fetchTimeTable = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/getTimeTable', {
        headers: {
          Authorization: `Bearer ${token}`,
          client: 'not browser',
        },
        withCredentials: true,
      });

      if (res.data.success) {
        setTimeTable(res.data.timeTable);
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {timeTable.length > 0 ? (
        <FlatList
          data={timeTable}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.text}><Text style={styles.bold}>Day:</Text> {item.day}</Text>
              <Text style={styles.text}><Text style={styles.bold}>Period:</Text> {item.period}</Text>
              <Text style={styles.text}><Text style={styles.bold}>Subject:</Text> {item.subject}</Text>
              <Text style={styles.text}><Text style={styles.bold}>Classroom:</Text> {item.classRoom}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>No timetable entries found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    padding: wp(4),
    marginBottom: hp(2),
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: wp(4),
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: wp(5),
    color: 'gray',
    marginTop: hp(20),
  },
});

export default TimeTable;