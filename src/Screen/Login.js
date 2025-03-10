import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const { width: wp, height: hp } = Dimensions.get('window');

const Login = () => {
  const [formData, setFormData] = useState({
    password: '',
    rollNo: '',
    roles: 'student',
  });
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/login', formData);
      
      if (res.data.success) {
        await AsyncStorage.setItem('token', res.data.token);
        console.log("Login successful");
       
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/highsc1.png')} style={[styles.image, { width: wp > 400 ? 200 : 150, height: wp > 400 ? 200 : 150 }]} />
      <Text style={[styles.title, { fontSize: wp > 400 ? 28 : 24 }]}>Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={[styles.input, { fontSize: wp > 400 ? 16 : 14 }]}
        placeholder="Roll No"
        keyboardType="numeric"
        value={formData.rollNo}
        onChangeText={(text) => setFormData({ ...formData, rollNo: text })}
      />
      <TextInput
        style={[styles.input, { fontSize: wp > 400 ? 16 : 14 }]}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />
      <Text style={styles.Forgot}>ForgotPassword</Text>
     
      <Picker
        selectedValue={formData.roles}
        style={[styles.picker, { fontSize: wp > 400 ? 16 : 14 }]}
        onValueChange={(itemValue) => setFormData({ ...formData, roles: itemValue })}>
        <Picker.Item label="Student" value="student" />
        <Picker.Item label="Staff" value="staff" />
        <Picker.Item label="HOD" value="hod" />
      </Picker>
      
      <Button title="Login" onPress={()=> navigation.navigate('Dashboard')} color="#4C51BF"  style={styles.button}/>
      <Text style={styles.signupText}>
        Don't have an account? <Text style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>Signup</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp * 0.05,
    backgroundColor: '#F7FAFC',
  },
  image: {
    marginBottom: hp * 0.02,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: hp * 0.02,
  },
  error: {
    color: 'red',
    marginBottom: hp * 0.02,
    fontSize: wp > 400 ? 16 : 14,
  },
  input: {
    width: '100%',
    paddingVertical: hp * 0.015,
    paddingHorizontal: wp * 0.04,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: hp * 0.02,
    backgroundColor: '#F9FAFB',
  },
  Forgot:{
     color:'#4C51BF',
     justifyContent:'flex-end',
     alignSelf:'flex-end',
  },
  picker: {
    width: '100%',
    height: 50,
    marginBottom: hp * 0.02,
  },
  
  signupText: {
    marginTop: hp * 0.02,
  },
  signupLink: {
    color: '#4C51BF',
    textDecorationLine: 'underline',
  },
  button:{
    
  },
});

export default Login;
