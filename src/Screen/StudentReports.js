import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button,  FlatList, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const StudentReports = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [roles, setRoles] = useState('');
  const [classRoom, setClassRoom] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [department, setDepartment] = useState('');
  const [filterType, setFilterType] = useState('week');
  const [value, setValue] = useState('');
  const [rollNo, setRollNo] = useState(0);

  const { width } = useWindowDimensions();

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setRoles(decoded.roles);
          setRollNo(decoded.rollNo);
        } catch (err) {
          console.error('Error decoding token:', err);
        }
      }
    };
    fetchToken();
  }, []);

  const fetchReports = async () => {
    let url = '';
    if (roles === 'student') {
      url = `http://localhost:5000/api/myReports?rollNo=${rollNo}&${filterType}=${value}`;
  } else if (roles === 'staff' || roles === 'hod') {
      url = `http://localhost:5000/api/getBulkAttendance?classRoom=${classRoom}&department=${department}&${filterType}=${value}`;
  }
  

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(url, {
        headers: { 'Authorization':` Bearer ${token} `},
        withCredentials: true,
      });

      if (res.data.success) {
        setAttendanceData(res.data.data);
        if (roles === 'student') {
          setFilterData(res.data.data2);
        }
      } else {
        setAttendanceData([]);
        setFilterData([]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  useEffect(() => {
    if (value) {
      fetchReports();
    }
  }, [value]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Attendance Report</Text>

      {(roles === 'staff' || roles === 'hod') && (
        <>
          <TextInput style={[styles.input, { width: width * 0.9 }]} placeholder='Class' value={classRoom} onChangeText={setClassRoom} />
          <TextInput style={[styles.input, { width: width * 0.9 }]} placeholder='Department' value={department} onChangeText={setDepartment} />
        </>
      )}

      <Picker selectedValue={filterType} style={[styles.picker, { width: width * 0.9 }]} onValueChange={(itemValue) => setFilterType(itemValue)}>
        <Picker.Item label='Month' value='month' />
        <Picker.Item label='Week' value='week' />
      </Picker>

      <Button title='Get Attendance' onPress={fetchReports} />

      <FlatList
        data={roles === 'student' ? filterData : attendanceData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.row, { width: width * 0.9 }]}>  
            {roles !== 'student' && <Text style={styles.cell}>{item.rollNo}</Text>}
            <Text style={styles.cell}>{item.total}</Text>
            <Text style={styles.cell}>{item.percentCount}</Text>
            <Text style={styles.cell}>{item.percentage}%</Text>
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default StudentReports;