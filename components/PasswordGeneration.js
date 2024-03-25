/*
  Links to the repositories from which the imported packages are taken, as well as the name of the license 
  for each package used, are given in the file "license-checker-output.json" (obtained as a result of the 
  command output: "npx license-checker --json > license-checker-output.json"), located in the project root.
  The texts of all licenses used by the imported packages are presented in the "Licenses" directory, also 
  located in the root of this project.
  If the file "LICENSE__<license_name>___<package name>" has no content, then it corresponds to the standard 
  text of the corresponding license.
*/

/*
 Image:   Cross SVG Vector  
 Source:  https://www.svgrepo.com/svg/521590/cross (date:21.03.2024)
 License: Creative Commons CC0 
 AUTHOR: Konstantin Filatov
*/
/*
 Image:   Check Mark SVG Vector
 Source:  https://www.svgrepo.com/svg/158192/check-mark (date:21.03.2024)
 License: Creative Commons CC0 
*/

import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";

import Ionicons from "react-native-vector-icons/Ionicons";
import TranslationContext from "../translation/TranslationContext";
import Svg, { Path, G } from "react-native-svg";

const screenWidth = Dimensions.get("window").width;

const PasswordGeneration = ({ theme }) => {
  const translation = useContext(TranslationContext);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [inputText, setInputText] = useState("");
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    numbers: false,
    symbols: false,
  });

  const generatePassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    setGeneratedPassword(password);
  };

  const checkPasswordStrength = (text) => {
    const criteria = {
      length: text.length >= 8,
      uppercase: /[A-Z]/.test(text),
      lowercase: /[a-z]/.test(text),
      numbers: /[0-9]/.test(text),
      symbols: /[!@#$%^&*()_+]/.test(text),
    };
    setPasswordCriteria(criteria);
  };

  const handleInputChange = (text) => {
    setInputText(text);
    checkPasswordStrength(text);
  };

  const calculateFulfilledCriteria = () => {
    return Object.values(passwordCriteria).filter((criterion) => criterion)
      .length;
  };
  const copyToClipboard = () => {
    Clipboard.setString(generatedPassword);
    Haptics.selectionAsync();
  };
  useEffect(() => {
    return () => {
      setGeneratedPassword("");
      setInputText("");
      setPasswordCriteria({
        length: false,
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: false,
      });
    };
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical={false}
      contentContainerStyle={styles.scrollViewContainer}
      scrollEnabled={scrollEnabled}
      style={{ backgroundColor: theme.bg.backgroundColor }}
      endFillColor="#000"
      overScrollMode="never"
    >
      <View style={styles.container}>
        <View style={styles.contentView}>
          <Text style={[styles.header, { borderColor: theme.borderColor }]}>
            {translation.passwordGeneration.title1}
          </Text>
          <View>
            <TextInput
              style={[
                styles.textInput,
                {
                  color: "black",
                  backgroundColor: theme.bg.mainBg,
                  borderColor: theme.borderColor,
                },
              ]}
              value={generatedPassword}
              placeholder={translation.passwordGeneration.placeholder1}
              editable={false}
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
              onPress={() => copyToClipboard(generatedPassword)}
              style={[
                styles.copyBtn3,
                { opacity: generatedPassword.length > 0 ? 1 : 0.5 },
              ]}
              disabled={generatedPassword.length === 0}
            >
              <Ionicons
                name="copy-outline"
                size={20}
                style={{ marginLeft: "auto", opacity: 0.5 }}
              ></Ionicons>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: theme.btnColor.primary }]}
            onPress={generatePassword}
          >
            <Text style={{ color: "white" }}>
              {translation.passwordGeneration.btn1}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentView}>
          <Text style={[styles.header, { borderColor: theme.borderColor }]}>
            {translation.passwordGeneration.title2}
          </Text>
          <View>
            <TextInput
              style={[
                styles.textInput,
                {
                  color: "black",
                  backgroundColor: theme.bg.mainBg,
                  borderColor: theme.borderColor,
                },
              ]}
              value={inputText}
              placeholder={translation.passwordGeneration.placeholder2}
              onChangeText={handleInputChange}
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
              onPress={() => setInputText("")}
              style={[
                styles.resetBtn,
                { opacity: inputText.length > 0 ? 0.5 : 0 },
              ]}
              disabled={inputText.length === 0}
            >
              <Ionicons
                name="close-circle"
                size={20}
                style={{ marginLeft: "auto", opacity: 0.5 }}
              ></Ionicons>
            </TouchableOpacity>
          </View>

          {inputText && (
            <View style={styles.criteriaContainer}>
              <Text style={{ fontSize: 15, marginBottom: 10 }}>
                {translation.passwordGeneration.passwordStrength}{" "}
                {calculateFulfilledCriteria()}/5
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {passwordCriteria.length ? (
                  <Svg
                    width={11}
                    height={11}
                    style={{ marginRight: 7, marginLeft: 5 }}
                    version="1.1"
                    id="Capa_1"
                    viewBox="0 0 17.837 17.837"
                    fill="#03a800"
                    stroke="#03a800"
                    stroke-width="0.00017837000000000002"
                  >
                    <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
                    <G
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></G>
                    <G id="SVGRepo_iconCarrier">
                      <G>
                        <Path
                          style="fill:#03a800;"
                          d="M16.145,2.571c-0.272-0.273-0.718-0.273-0.99,0L6.92,10.804l-4.241-4.27 c-0.272-0.274-0.715-0.274-0.989,0L0.204,8.019c-0.272,0.271-0.272,0.717,0,0.99l6.217,6.258c0.272,0.271,0.715,0.271,0.99,0 L17.63,5.047c0.276-0.273,0.276-0.72,0-0.994L16.145,2.571z"
                        ></Path>
                      </G>
                    </G>
                  </Svg>
                ) : (
                  <Svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ff0000"
                    width={20}
                    height={20}
                    style={{ marginRight: 5 }}
                  >
                    <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
                    <G
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></G>
                    <G id="SVGRepo_iconCarrier">
                      <Path
                        d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"
                        fill="#ff0000"
                      ></Path>
                    </G>
                  </Svg>
                )}
                <Text style={styles.criteriaText}>
                  {translation.passwordGeneration.length}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {passwordCriteria.uppercase ? (
                  <Svg
                    width={11}
                    height={11}
                    style={{ marginRight: 7, marginLeft: 5 }}
                    version="1.1"
                    id="Capa_1"
                    viewBox="0 0 17.837 17.837"
                    fill="#03a800"
                    stroke="#03a800"
                    stroke-width="0.00017837000000000002"
                  >
                    <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
                    <G
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></G>
                    <G id="SVGRepo_iconCarrier">
                      <G>
                        <Path
                          style="fill:#03a800;"
                          d="M16.145,2.571c-0.272-0.273-0.718-0.273-0.99,0L6.92,10.804l-4.241-4.27 c-0.272-0.274-0.715-0.274-0.989,0L0.204,8.019c-0.272,0.271-0.272,0.717,0,0.99l6.217,6.258c0.272,0.271,0.715,0.271,0.99,0 L17.63,5.047c0.276-0.273,0.276-0.72,0-0.994L16.145,2.571z"
                        ></Path>
                      </G>
                    </G>
                  </Svg>
                ) : (
                  <Svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ff0000"
                    width={20}
                    height={20}
                    style={{ marginRight: 5 }}
                  >
                    <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
                    <G
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></G>
                    <G id="SVGRepo_iconCarrier">
                      <Path
                        d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"
                        fill="#ff0000"
                      ></Path>
                    </G>
                  </Svg>
                )}
                <Text style={styles.criteriaText}>
                  {translation.passwordGeneration.uppercase}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {passwordCriteria.lowercase ? (
                  <Svg
                    width={11}
                    height={11}
                    style={{ marginRight: 7, marginLeft: 5 }}
                    version="1.1"
                    id="Capa_1"
                    viewBox="0 0 17.837 17.837"
                    fill="#03a800"
                    stroke="#03a800"
                    stroke-width="0.00017837000000000002"
                  >
                    <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
                    <G
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></G>
                    <G id="SVGRepo_iconCarrier">
                      <G>
                        <Path
                          style="fill:#03a800;"
                          d="M16.145,2.571c-0.272-0.273-0.718-0.273-0.99,0L6.92,10.804l-4.241-4.27 c-0.272-0.274-0.715-0.274-0.989,0L0.204,8.019c-0.272,0.271-0.272,0.717,0,0.99l6.217,6.258c0.272,0.271,0.715,0.271,0.99,0 L17.63,5.047c0.276-0.273,0.276-0.72,0-0.994L16.145,2.571z"
                        ></Path>
                      </G>
                    </G>
                  </Svg>
                ) : (
                  <Svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ff0000"
                    width={20}
                    height={20}
                    style={{ marginRight: 5 }}
                  >
                    <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
                    <G
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></G>
                    <G id="SVGRepo_iconCarrier">
                      <Path
                        d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"
                        fill="#ff0000"
                      ></Path>
                    </G>
                  </Svg>
                )}
                <Text style={styles.criteriaText}>
                  {translation.passwordGeneration.lowercase}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {passwordCriteria.numbers ? (
                  <Svg
                    width={11}
                    height={11}
                    style={{ marginRight: 7, marginLeft: 5 }}
                    version="1.1"
                    id="Capa_1"
                    viewBox="0 0 17.837 17.837"
                    fill="#03a800"
                    stroke="#03a800"
                    stroke-width="0.00017837000000000002"
                  >
                    <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
                    <G
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></G>
                    <G id="SVGRepo_iconCarrier">
                      <G>
                        <Path
                          style="fill:#03a800;"
                          d="M16.145,2.571c-0.272-0.273-0.718-0.273-0.99,0L6.92,10.804l-4.241-4.27 c-0.272-0.274-0.715-0.274-0.989,0L0.204,8.019c-0.272,0.271-0.272,0.717,0,0.99l6.217,6.258c0.272,0.271,0.715,0.271,0.99,0 L17.63,5.047c0.276-0.273,0.276-0.72,0-0.994L16.145,2.571z"
                        ></Path>
                      </G>
                    </G>
                  </Svg>
                ) : (
                  <Svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ff0000"
                    width={20}
                    height={20}
                    style={{ marginRight: 5 }}
                  >
                    <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
                    <G
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></G>
                    <G id="SVGRepo_iconCarrier">
                      <Path
                        d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"
                        fill="#ff0000"
                      ></Path>
                    </G>
                  </Svg>
                )}
                <Text style={styles.criteriaText}>
                  {translation.passwordGeneration.numbers}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {passwordCriteria.symbols ? (
                  <Svg
                    width={11}
                    height={11}
                    style={{ marginRight: 7, marginLeft: 5 }}
                    version="1.1"
                    id="Capa_1"
                    viewBox="0 0 17.837 17.837"
                    fill="#03a800"
                    stroke="#03a800"
                    stroke-width="0.00017837000000000002"
                  >
                    <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
                    <G
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></G>
                    <G id="SVGRepo_iconCarrier">
                      <G>
                        <Path
                          style="fill:#03a800;"
                          d="M16.145,2.571c-0.272-0.273-0.718-0.273-0.99,0L6.92,10.804l-4.241-4.27 c-0.272-0.274-0.715-0.274-0.989,0L0.204,8.019c-0.272,0.271-0.272,0.717,0,0.99l6.217,6.258c0.272,0.271,0.715,0.271,0.99,0 L17.63,5.047c0.276-0.273,0.276-0.72,0-0.994L16.145,2.571z"
                        ></Path>
                      </G>
                    </G>
                  </Svg>
                ) : (
                  <Svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ff0000"
                    width={20}
                    height={20}
                    style={{ marginRight: 5 }}
                  >
                    <G id="SVGRepo_bgCarrier" stroke-width="0"></G>
                    <G
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></G>
                    <G id="SVGRepo_iconCarrier">
                      <Path
                        d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z"
                        fill="#ff0000"
                      ></Path>
                    </G>
                  </Svg>
                )}
                <Text style={styles.criteriaText}>
                  {translation.passwordGeneration.symbols}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    width: screenWidth,
    maxWidth: 800,
    alignSelf: "center",
  },
  header: {
    fontSize: 20,
    opacity: 0.5,
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 40,
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 5,
    borderRadius: 5,
  },
  contentView: {
    display: "flex",
    padding: 10,
    width: "100%",
    justifyContent: "space-between",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E6EB",
    padding: 10,
    borderRadius: 5,
    height: 50,
    marginBottom: 10,
    backgroundColor: "rgb(248 248 248)",
  },
  addBtn: {
    backgroundColor: "#0071b8",
    borderRadius: 5,
    padding: 10,
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  criteriaContainer: {
    marginTop: 10,
    opacity: 0.5,
    marginLeft: 15,
  },
  criteriaText: {
    marginBottom: 5,
  },
  copyBtn3: {
    position: "absolute",
    top: 15,
    right: 10,
  },
  resetBtn: {
    position: "absolute",
    bottom: 25,
    right: 10,
  },
});

export default PasswordGeneration;
