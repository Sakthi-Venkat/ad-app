import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomePage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.logo}>AttendEase</Text>
        <View style={styles.navButtons}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.signInButton}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.signUpButton}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Image Section */}
        <Image source={require('../assets/profile.png')} style={styles.image} resizeMode="contain" />

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Attendance Management System</Text>
          <Text style={styles.subtitle}>Simplify Your Attendance Tracking</Text>
          <Text style={styles.description}>
            A comprehensive platform designed for educational institutions to efficiently track and manage 
            attendance for students and staff. Our system makes it easy to record, monitor, and report attendance data across your organization.
          </Text>
          <Text style={styles.quote}>"Streamlining attendance processes for students, staff, and department heads."</Text>

          <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.getStartedButton}>
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff',
  },
  navbar: {
    backgroundColor: '#2563eb', 
    height: 110,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  navButtons: {
    flexDirection: 'row',
  },
  signInButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  signInText: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  signUpButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  signUpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flexGrow: 1, 
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  image: {
    width: '90%',
    height: 200,
    maxHeight: 250,
    marginBottom: 20,
  },
  textContainer: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563eb',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 12,
  },
  quote: {
    fontSize: 16,
    color: '#2563eb',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  getStartedButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 2,
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomePage;