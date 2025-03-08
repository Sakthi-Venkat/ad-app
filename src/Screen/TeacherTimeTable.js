import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const TeacherTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [editingEntry, setEditingEntry] = useState(null);
  const [editForm, setEditForm] = useState({
    day: '',
    period: '',
    classRoom: '',
    subject: '',
  });

  const [createMode, setCreateMode] = useState(false);
  const [newEntry, setNewEntry] = useState({
    day: '',
    period: '',
    classRoom: '',
    subject: '',
  });

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/getTimeTable', { withCredentials: true });
      if (res.data.success) {
        setTimetable(res.data.data);
      } else {
        setError('Failed to fetch timetable');
      }
    } catch (err) {
      setError('Error fetching timetable');
    }
    setLoading(false);
  };

  const handleEditClick = (entry) => {
    setEditingEntry(entry._id);
    setEditForm(entry);
  };

  const handleEditChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:5000/api/updateTimetable',
        editForm,
        {
          headers: { Authorization:` Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        Alert.alert('Success', 'Timetable updated successfully');
        setEditingEntry(null);
        fetchTimetable();
      } else {
        Alert.alert('Error', 'Failed to update timetable');
      }
    } catch (err) {
      Alert.alert('Error', 'Error updating timetable');
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/createTimeTable',
        newEntry,
        {
          headers: { Authorization:` Bearer ${token} `},
          withCredentials: true,
        }
      );
      if (res.data.success) {
        Alert.alert('Success', 'Timetable entry created successfully');
        setCreateMode(false);
        setNewEntry({ day: '', period: '', classRoom: '', subject: '' });
        fetchTimetable();
      } else {
        Alert.alert('Error', 'Failed to create timetable entry');
      }
    } catch (err) {
      Alert.alert('Error', 'Error creating timetable');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Teacher / HOD Timetable Management</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <View>
          <Text style={styles.subtitle}>Current Timetable Entries</Text>
          {timetable.length > 0 ? (
            timetable.map((entry) => (
              <View key={entry._id} style={styles.entry}>
                <Text>Day: {entry.day} | Period: {entry.period} | Subject: {entry.subject} | Classroom: {entry.classRoom}</Text>
                <TouchableOpacity style={styles.button} onPress={() => handleEditClick(entry)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text>No timetable entries found.</Text>
          )}

          {editingEntry && (
            <View style={styles.form}>
              <Text style={styles.formTitle}>Edit Timetable Entry</Text>
              <TextInput style={styles.input} placeholder="Day" value={editForm.day} onChangeText={(text) => handleEditChange('day', text)} />
              <TextInput style={styles.input} placeholder="Period" keyboardType="numeric" value={String(editForm.period)} onChangeText={(text) => handleEditChange('period', text)} />
              <TextInput style={styles.input} placeholder="Classroom" value={editForm.classRoom} onChangeText={(text) => handleEditChange('classRoom', text)} />
              <TextInput style={styles.input} placeholder="Subject" value={editForm.subject} onChangeText={(text) => handleEditChange('subject', text)} />

              <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonCancel} onPress={() => setEditingEntry(null)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          {!createMode ? (
            <TouchableOpacity style={styles.button} onPress={() => setCreateMode(true)}>
              <Text style={styles.buttonText}>Create New Timetable Entry</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.form}>
              <Text style={styles.formTitle}>Create Timetable Entry</Text>
              <TextInput style={styles.input} placeholder="Day" value={newEntry.day} onChangeText={(text) => setNewEntry({ ...newEntry, day: text })} />
              <TextInput style={styles.input} placeholder="Period" keyboardType="numeric" value={String(newEntry.period)} onChangeText={(text) => setNewEntry({ ...newEntry, period: text })} />
              <TextInput style={styles.input} placeholder="Classroom" value={newEntry.classRoom} onChangeText={(text) => setNewEntry({ ...newEntry, classRoom: text })} />
              <TextInput style={styles.input} placeholder="Subject" value={newEntry.subject} onChangeText={(text) => setNewEntry({ ...newEntry, subject: text })} />

              <TouchableOpacity style={styles.button} onPress={handleCreate}>
                <Text style={styles.buttonText}>Create Entry</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonCancel} onPress={() => setCreateMode(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  entry: { padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 10 },
  error: { color: 'red', textAlign: 'center' },
  form: { marginTop: 20, padding: 10, borderWidth: 1, borderColor: '#000' },
  formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, padding: 8, marginBottom: 10 },
  button: { backgroundColor: 'blue', padding: 10, marginBottom: 10 },
  buttonCancel: { backgroundColor: 'red', padding: 10 },
  buttonText: { color: 'white', textAlign: 'center' },
});

export default TeacherTimetable;