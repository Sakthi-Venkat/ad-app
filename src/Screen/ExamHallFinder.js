import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const ExamHallFinder = () => {
  const [classRoom, setClassRoom] = useState(null);
  const [department, setDepartment] = useState(null);
  const [year, setYear] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>🏛️</Text>
        <Text style={styles.title}>Exam Hall Finder</Text>
        <Text style={styles.subtitle}>Find your exam hall with ease</Text>
      </View>

      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Class Room</Text>
        <RNPickerSelect
          onValueChange={(value) => setClassRoom(value)}
          items={[
            { label: "101", value: "101" },
            { label: "102", value: "102" },
            { label:"103",  value:"1003"},
            {label:"104",   value:"104"},
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: "Select Class Room", value: null }}
        />

        <Text style={styles.label}>Department</Text>
        <RNPickerSelect
          onValueChange={(value) => setDepartment(value)}
          items={[
            { label: "CSE", value: "CSE" },
            { label: "IT", value: "IT" },
            {label:"Mech",value: "mech"},
            {label:"Civil",value: "civil"},
            {label:"E&I",value: "E&I"},
            {label:"EEE",value: "EEE"},
            
            
            
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: "Select Department", value: null }}
        />

        <Text style={styles.label}>Year</Text>
        <RNPickerSelect
          onValueChange={(value) => setYear(value)}
          items={[
            { label: "First Year", value: "1" },
            { label: "Second Year", value: "2" },
            {label: "Third year",value:"3"},
            {label: "Fourth year",value:"4"},
            
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: "Select Year", value: null }}
        />
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}> Find Exam Hall</Text>
      </TouchableOpacity>

      <View style={styles.messageBox}>
        <Text style={styles.messageText}>No exam hall details found. Try different search criteria.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    paddingTop: hp("5%"),
  },
  header: {
    backgroundColor: "#007bff",
    width: wp("90%"),
    borderTopLeftRadius: wp("5%"),
    borderTopRightRadius: wp("5%"),
    paddingVertical: hp("3%"),
    alignItems: "center",
  },
  icon: {
    fontSize: hp("5%"),
    color: "white",
  },
  title: {
    fontSize: hp("3%"),
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: hp("2%"),
    color: "white",
  },
  dropdownContainer: {
    width: wp("85%"),
    marginTop: hp("3%"),
  },
  label: {
    fontSize: hp("2%"),
    fontWeight: "bold",
    marginBottom: hp("1%"),
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: hp("2%"),
    width: wp("85%"),
    borderRadius: wp("2%"),
    alignItems: "center",
    marginTop: hp("3%"),
  },
  buttonText: {
    fontSize: hp("2.5%"),
    fontWeight: "bold",
    color: "white",
  },
  messageBox: {
    backgroundColor: "#e9ecef",
    width: wp("85%"),
    padding: hp("2%"),
    marginTop: hp("3%"),
    borderRadius: wp("2%"),
    alignItems: "center",
  },
  messageText: {
    fontSize: hp("2%"),
    color: "#6c757d",
    textAlign: "center",
  },
});

const pickerSelectStyles = {
  inputIOS: {
    backgroundColor: "#ffffff",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("3%"),
    borderRadius: wp("2%"),
    fontSize: hp("2%"),
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: hp("2%"),
  },
  inputAndroid: {
    backgroundColor: "#ffffff",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("3%"),
    borderRadius: wp("2%"),
    fontSize: hp("2%"),
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: hp("2%"),
  },
};

export default ExamHallFinder;