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
import store from "../store/store";
import TranslationContext from "../translation/TranslationContext";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
const screenWidth = Dimensions.get("window").width;

const EditDataForm = ({ selectedData, onClose, theme }) => {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const translation = useContext(TranslationContext);
  const [editableData, setEditableData] = useState(selectedData);

  const [showPassword, setShowPassword] = useState(false);

  const formatCardNumber = (input) => {
    const cleanInput = input.replace(/[^\d]/g, "");
    const formattedInput = cleanInput.replace(/(.{4})/g, "$1 ");
    handleInputChange("number", formattedInput);
  };
  const handleInputChange = (key, text) => {
    if (key === "date") {
      const cleanedText = text.replace(/[^0-9]/g, "");

      if (cleanedText.length === 2 && text.length === 2) {
        setEditableData({ ...editableData, [key]: cleanedText + "/" });
        return;
      }
    }

    setEditableData((prevData) => ({
      ...prevData,
      [key]: text,
    }));
  };

  const editData = () => {
    store.dispatch({
      type: "EDIT_PASSWORD",
      payload: {
        editableData,
      },
    });
    onClose();
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: theme.bg.mainBg }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
          contentContainerStyle={styles.scrollViewContainer}
          scrollEnabled={scrollEnabled}
          style={{ backgroundColor: theme.bg.mainBg, width: "100%" }}
          endFillColor="#000"
          overScrollMode="never"
        >
          <View
            style={[
              styles.container,
              { backgroundColor: theme.bg.mainBg, width: "100%" },
            ]}
          >
            <View style={{ width: "100%" }}>
              <View
                style={{
                  position: "absolute",
                  bottom: 60,
                  left: 5,
                  backgroundColor: theme.bg.mainBg,
                  zIndex: 99,
                  paddingHorizontal: 5,
                }}
              >
                <Text style={styles.inputTitle}>
                  {translation.addForm.name}
                </Text>
              </View>
              <TextInput
                placeholder={translation.addForm.name}
                value={editableData.name}
                onChangeText={(text) => handleInputChange("name", text)}
                style={[styles.textInput, { borderColor: theme.borderColor }]}
                maxLength={10}
                onFocus={() => {
                  if (typeof document !== "undefined") {
                    let inputs = document.getElementsByTagName("input");
                    for (let i = 0; i < inputs.length; i++) {
                      inputs[i].style.outline = "none";
                    }
                  }
                }}
              />
            </View>
            {!editableData.owner && editableData.owner !== "" ? (
              <>
                {editableData.url || editableData.url === "" ? (
                  <>
                    <View style={{ width: "100%" }}>
                      <View
                        style={{
                          position: "absolute",
                          bottom: 60,
                          left: 5,
                          backgroundColor: theme.bg.mainBg,
                          zIndex: 99,
                          paddingHorizontal: 5,
                        }}
                      >
                        <Text style={styles.inputTitle}>{"URL"}</Text>
                      </View>
                      <TextInput
                        placeholder="URL"
                        value={editableData.url}
                        onChangeText={(text) => handleInputChange("url", text)}
                        style={[
                          styles.textInput,
                          { borderColor: theme.borderColor },
                        ]}
                        maxLength={10}
                        onFocus={() => {
                          if (typeof document !== "undefined") {
                            let inputs = document.getElementsByTagName("input");
                            for (let i = 0; i < inputs.length; i++) {
                              inputs[i].style.outline = "none";
                            }
                          }
                        }}
                      />
                    </View>
                    <View style={{ width: "100%" }}>
                      <View
                        style={{
                          position: "absolute",
                          bottom: 60,
                          left: 5,
                          backgroundColor: theme.bg.mainBg,
                          zIndex: 99,
                          paddingHorizontal: 5,
                        }}
                      >
                        <Text style={styles.inputTitle}>
                          {translation.addForm.login}
                        </Text>
                      </View>
                      <TextInput
                        placeholder={translation.addForm.login}
                        value={editableData.login}
                        onChangeText={(text) =>
                          handleInputChange("login", text)
                        }
                        style={[
                          styles.textInput,
                          { borderColor: theme.borderColor },
                        ]}
                        onFocus={() => {
                          if (typeof document !== "undefined") {
                            let inputs = document.getElementsByTagName("input");
                            for (let i = 0; i < inputs.length; i++) {
                              inputs[i].style.outline = "none";
                            }
                          }
                        }}
                      />
                    </View>
                    <View style={{ width: "100%" }}>
                      <View
                        style={{
                          position: "absolute",
                          bottom: 60,
                          left: 5,
                          backgroundColor: theme.bg.mainBg,
                          zIndex: 99,
                          paddingHorizontal: 5,
                        }}
                      >
                        <Text style={styles.inputTitle}>
                          {translation.addForm.password}
                        </Text>
                      </View>
                      <TextInput
                        placeholder="********"
                        value={editableData.password}
                        onChangeText={(text) =>
                          handleInputChange("password", text)
                        }
                        secureTextEntry
                        style={[
                          styles.textInput,
                          { borderColor: theme.borderColor },
                        ]}
                        onFocus={() => {
                          if (typeof document !== "undefined") {
                            let inputs = document.getElementsByTagName("input");
                            for (let i = 0; i < inputs.length; i++) {
                              inputs[i].style.outline = "none";
                            }
                          }
                        }}
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <View style={{ width: "100%" }}>
                      <View
                        style={{
                          position: "absolute",
                          bottom: 60,
                          left: 5,
                          backgroundColor: theme.bg.mainBg,
                          zIndex: 99,
                          paddingHorizontal: 5,
                        }}
                      >
                        <Text style={styles.inputTitle}>
                          {translation.addForm.login}
                        </Text>
                      </View>
                      <TextInput
                        placeholder={translation.addForm.login}
                        value={editableData.login}
                        onChangeText={(text) =>
                          handleInputChange("login", text)
                        }
                        style={[
                          styles.textInput,
                          { borderColor: theme.borderColor },
                        ]}
                        onFocus={() => {
                          if (typeof document !== "undefined") {
                            let inputs = document.getElementsByTagName("input");
                            for (let i = 0; i < inputs.length; i++) {
                              inputs[i].style.outline = "none";
                            }
                          }
                        }}
                      />
                    </View>
                    <View style={{ width: "100%", position: "relative" }}>
                      <View
                        style={{
                          position: "absolute",
                          bottom: 60,
                          left: 5,
                          backgroundColor: theme.bg.mainBg,
                          zIndex: 99,
                          paddingHorizontal: 5,
                        }}
                      >
                        <Text style={styles.inputTitle}>
                          {translation.addForm.password}
                        </Text>
                      </View>
                      <TextInput
                        placeholder="********"
                        value={editableData.password}
                        secureTextEntry={!showPassword}
                        onChangeText={(text) =>
                          handleInputChange("password", text)
                        }
                        style={[
                          styles.textInput,
                          { borderColor: theme.borderColor },
                        ]}
                        onFocus={() => {
                          if (typeof document !== "undefined") {
                            let inputs = document.getElementsByTagName("input");
                            for (let i = 0; i < inputs.length; i++) {
                              inputs[i].style.outline = "none";
                            }
                          }
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.showPasswordBtn}
                      >
                        <Ionicons
                          name={
                            showPassword ? "eye-off-outline" : "eye-outline"
                          }
                          size={20}
                          color="black"
                          style={{ marginRight: 0, opacity: 0.5 }}
                        ></Ionicons>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </>
            ) : (
              <>
                <View style={{ width: "100%" }}>
                  <View
                    style={{
                      position: "absolute",
                      bottom: 60,
                      left: 5,
                      backgroundColor: theme.bg.mainBg,
                      zIndex: 99,
                      paddingHorizontal: 5,
                    }}
                  >
                    <Text style={styles.inputTitle}>
                      {translation.addForm.bankOwnerName}
                    </Text>
                  </View>
                  <TextInput
                    placeholder={editableData.owner}
                    value={editableData.owner}
                    onChangeText={(text) => handleInputChange("owner", text)}
                    style={[
                      styles.textInput,
                      {
                        borderColor: theme.borderColor,
                        textTransform: "uppercase",
                      },
                    ]}
                    maxLength={50}
                    onFocus={() => {
                      if (typeof document !== "undefined") {
                        let inputs = document.getElementsByTagName("input");
                        for (let i = 0; i < inputs.length; i++) {
                          inputs[i].style.outline = "none";
                        }
                      }
                    }}
                  />
                </View>
                <View style={{ width: "100%" }}>
                  <View
                    style={{
                      position: "absolute",
                      bottom: 60,
                      left: 5,
                      backgroundColor: theme.bg.mainBg,
                      zIndex: 99,
                      paddingHorizontal: 5,
                    }}
                  >
                    <Text style={styles.inputTitle}>MM/YY</Text>
                  </View>
                  <TextInput
                    placeholder={editableData.date}
                    value={editableData.date}
                    onChangeText={(text) => handleInputChange("date", text)}
                    style={[
                      styles.textInput,
                      {
                        borderColor: theme.borderColor,
                        textTransform: "uppercase",
                      },
                    ]}
                    keyboardType="numeric"
                    maxLength={5}
                    onFocus={() => {
                      if (typeof document !== "undefined") {
                        let inputs = document.getElementsByTagName("input");
                        for (let i = 0; i < inputs.length; i++) {
                          inputs[i].style.outline = "none";
                        }
                      }
                    }}
                  />
                </View>
                <View style={{ width: "100%" }}>
                  <View
                    style={{
                      position: "absolute",
                      bottom: 60,
                      left: 5,
                      backgroundColor: theme.bg.mainBg,
                      zIndex: 99,
                      paddingHorizontal: 5,
                    }}
                  >
                    <Text style={styles.inputTitle}>
                      {translation.addForm.number}
                    </Text>
                  </View>
                  <TextInput
                    placeholder={editableData.number}
                    value={editableData.number}
                    onChangeText={(text) => {
                      formatCardNumber(text);
                    }}
                    style={[
                      styles.textInput,
                      {
                        borderColor: theme.borderColor,
                        textTransform: "uppercase",
                      },
                    ]}
                    keyboardType="numeric"
                    maxLength={23}
                    onFocus={() => {
                      if (typeof document !== "undefined") {
                        let inputs = document.getElementsByTagName("input");
                        for (let i = 0; i < inputs.length; i++) {
                          inputs[i].style.outline = "none";
                        }
                      }
                    }}
                  />
                </View>
                <View style={{ width: "100%" }}>
                  <View
                    style={{
                      position: "absolute",
                      bottom: 60,
                      left: 5,
                      backgroundColor: theme.bg.mainBg,
                      zIndex: 99,
                      paddingHorizontal: 5,
                    }}
                  >
                    <Text style={styles.inputTitle}>CVC2/CVV2</Text>
                  </View>
                  <TextInput
                    placeholder={editableData.cv}
                    value={editableData.cv}
                    onChangeText={(text) => handleInputChange("cv", text)}
                    style={[
                      styles.textInput,
                      {
                        borderColor: theme.borderColor,
                        textTransform: "uppercase",
                      },
                    ]}
                    keyboardType="numeric"
                    maxLength={3}
                    onFocus={() => {
                      if (typeof document !== "undefined") {
                        let inputs = document.getElementsByTagName("input");
                        for (let i = 0; i < inputs.length; i++) {
                          inputs[i].style.outline = "none";
                        }
                      }
                    }}
                  />
                </View>
              </>
            )}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.btnColor.primary }]}
          onPress={() => editData()}
        >
          <Text style={{ color: "white" }}>
            {translation.newCategoryForm.confirmBtn}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: "start",
    alignSelf: "center",
    justifyContent: "center",
    maxWidth: 800,
  },
  textInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    paddingRight: 40,
    height: 50,
  },
  addBtn: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: screenWidth,
    maxWidth: 800,
    alignSelf: "center",
  },
  inputTitle: {
    opacity: 0.3,
  },
  showPasswordBtn: {
    position: "absolute",
    right: 15,
    top: "20%",
  },
});

export default EditDataForm;
