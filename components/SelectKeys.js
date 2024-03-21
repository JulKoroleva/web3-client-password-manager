/*
  Links to the repositories from which the imported packages are taken, as well as the name of the license 
  for each package used, are given in the file "license-checker-output.json" (obtained as a result of the 
  command output: "npx license-checker --json > license-checker-output.json"), located in the project root.
  The texts of all licenses used by the imported packages are presented in the "Licenses" directory, also 
  located in the root of this project.
  If the file "LICENSE__<license_name>___<package name>" has no content, then it corresponds to the standard 
  text of the corresponding license.
*/

import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import TranslationContext from "../translation/TranslationContext";

import { CheckBox } from "react-native-elements";

const SelectKeys = ({ importedPasswords, handleSelectedPasswords }) => {
  const translation = useContext(TranslationContext);
  const [selectedPasswords, setSelectedPasswords] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [expandedPasswords, setExpandedPasswords] = useState([]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPasswords([]);
      setExpandedPasswords([]);
    } else {
      const updatedPasswords = importedPasswords.map((password) => ({
        ...password,
        checked: !selectAll,
      }));
      setSelectedPasswords(updatedPasswords.map((password) => password.id));
    }

    setSelectAll(!selectAll);
  };

  const togglePasswordExpansion = (passwordId) => {
    setExpandedPasswords((prevExpandedPasswords) => {
      if (prevExpandedPasswords.includes(passwordId)) {
        return prevExpandedPasswords.filter((id) => id !== passwordId);
      } else {
        return [...prevExpandedPasswords, passwordId];
      }
    });
  };

  return (
    <>
      <Text style={styles.modalTitle}>
        {translation.selectKeys.selectedPasswords} {selectedPasswords.length}
      </Text>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        endFillColor="#000"
        overScrollMode="never"
      >
        <View style={styles.container}>
          <View style={styles.checkAllContainer}>
            <Text>{translation.selectKeys.selectAll}</Text>
            <CheckBox checked={selectAll} onPress={handleSelectAll} />
          </View>
          {importedPasswords.map((password) => (
            <View key={password.id} style={styles.passwordContainer}>
              <CheckBox
                key={selectedPasswords}
                checked={selectedPasswords.includes(password.id)}
                onPress={() => {
                  const isChecked = selectedPasswords.includes(password.id);
                  setSelectedPasswords((prevSelectedPasswords) => {
                    if (isChecked) {
                      return prevSelectedPasswords.filter(
                        (id) => id !== password.id
                      );
                    } else {
                      return [...prevSelectedPasswords, password.id];
                    }
                  });
                }}
              />
              <View>
                <TouchableOpacity
                  onPress={() => togglePasswordExpansion(password.id)}
                >
                  <Text style={{ marginVertical: 5 }}>{password.name}</Text>
                </TouchableOpacity>
                {expandedPasswords.includes(password.id) && (
                  <View style={styles.userData}>
                    <Text>
                      {translation.homeScreen.login} {password.login}
                    </Text>
                    <Text>
                      {translation.homeScreen.password} {password.password}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          handleSelectedPasswords(selectedPasswords);
        }}
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          alignItems: "center",
          borderRadius: 50,
          backgroundColor: "#668cad",
          width: 65,
          height: 65,
        }}
      >
        <Ionicons size={60} color={"white"} name="checkmark-outline" />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: "auto",
    alignItems: "start",
    justifyContent: "center",
  },
  modalTitle: {
    position: "absolute",
    top: -15,
    width: "60%",
    marginTop: 20,
    paddingTop: 20,
    paddingHorizontal: 15,
    zIndex: 99,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#E5E6EB",
    borderStyle: "solid",
  },
  checkAllContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#dde7f0",
  },
  userData: {
    justifyContent: "space-around",
    width: 250,
    backgroundColor: "#dae1e7",
    opacity: 0.5,
    borderRadius: 5,
    padding: 10,
    height: 100,
    marginVertical: 5,
  },
});

export default SelectKeys;
