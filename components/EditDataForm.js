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

const screenWidth = Dimensions.get("window").width;

const EditDataForm = ({ selectedData, onClose, theme }) => {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const translation = useContext(TranslationContext);
  const [editableData, setEditableData] = useState(selectedData);

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        contentContainerStyle={styles.scrollViewContainer}
        scrollEnabled={scrollEnabled}
        style={{ backgroundColor: theme.bg.mainBg }}
        endFillColor="#000"
        overScrollMode="never"
      >
        <View style={[styles.container, { backgroundColor: theme.bg.mainBg }]}>
          <View>
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
              <Text style={styles.inputTitle}>{translation.addForm.name}</Text>
            </View>
            <TextInput
              placeholder={translation.addForm.name}
              value={editableData.name}
              onChangeText={(text) => handleInputChange("name", text)}
              style={[styles.textInput, { borderColor: theme.borderColor }]}
              maxLength={10}
            />
          </View>
          {!editableData.owner && editableData.owner !== "" ? (
            <>
              {editableData.url || editableData.url === "" ? (
                <>
                  <View>
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
                    />
                  </View>
                  <View>
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
                      onChangeText={(text) => handleInputChange("login", text)}
                      style={[
                        styles.textInput,
                        { borderColor: theme.borderColor },
                      ]}
                    />
                  </View>
                  <View>
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
                    />
                  </View>
                </>
              ) : (
                <>
                  <View>
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
                      onChangeText={(text) => handleInputChange("login", text)}
                      style={[
                        styles.textInput,
                        { borderColor: theme.borderColor },
                      ]}
                    />
                  </View>
                  <View>
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
                    />
                  </View>
                </>
              )}
            </>
          ) : (
            <>
              <View>
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
                />
              </View>
              <View>
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
                />
              </View>
              <View>
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
                />
              </View>
              <View>
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
    justifyContent: "center",
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
});

export default EditDataForm;
