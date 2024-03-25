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
import { useSelector } from "react-redux";
import store from "../store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Animated,
  Keyboard,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
} from "react-native";

import Settings from "./Settings";
import Ionicons from "react-native-vector-icons/Ionicons";

import TranslationContext from "../translation/TranslationContext";

const screenWidth = Dimensions.get("window").width;

const Login = ({
  onDataReceived,
  onResetKey,
  error,
  onPressTheme,
  theme,
  isDarkTheme,
  onChangeLanguage,
  language,
}) => {
  const translation = useContext(TranslationContext);

  const [masterPassword, setMasterPassword] = useState("");
  const [hasData, setHasData] = useState();
  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(0));
  const [showPassword, setShowPassword] = useState(false);

  const [openSettings, setOpenSettings] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  useEffect(() => {
    fetchData = async () => {
      const userData = await AsyncStorage.getItem("walletList");

      if (userData !== null) {
        setHasData(true);
      } else {
        setHasData(false);
      }
    };
    fetchData();
  }, []);

  const openRegistration = () => {
    setRegistrationOpen(true);
  };

  const closeRegistration = () => {
    setRegistrationOpen(false);
  };

  const sendPasswordForVerification = async () => {
    store.dispatch({
      type: "SET_MASTER_KEY",
      payload: {
        key: masterPassword,
      },
    });
    await onDataReceived(masterPassword);
  };

  const handleCloseErrorModal = () => {
    setErrorModalVisible(false);
  };
  const removeData = async () => {
    await AsyncStorage.removeItem("encryptedUserData0");
    const files = store.getState().items.walletList;
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.fileName.startsWith("encryptedUserData")) {
          await AsyncStorage.removeItem(file.fileName);
        }
      }
    } catch (error) {
      // console.error("Ошибка при удалении файлов:", error);
    }
    await AsyncStorage.removeItem("walletList");
    const res = await AsyncStorage.getItem("walletList");
    store.dispatch({
      type: "CHECK_DATA",
      payload: {
        isExisted: false,
      },
    });
    onResetKey();
    setHasData(false);
    handleCloseErrorModal();
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        Animated.timing(keyboardHeight, {
          toValue: event.endCoordinates.height / 5,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          { paddingBottom: keyboardHeight, backgroundColor: theme.bg.mainBg },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            setOpenSettings(true);
          }}
          style={{
            position: "absolute",
            height: 90,
            top: 10,
            left: 10,
          }}
        >
          <Ionicons
            name="settings-sharp"
            size={25}
            style={{ opacity: 0.5 }}
          ></Ionicons>
        </TouchableOpacity>
        <View style={[styles.container, { width: screenWidth, maxWidth: 500 }]}>
          <View>
            <Image
              source={require("../assets/icon.png")}
              style={styles.logo}
            ></Image>
          </View>
          <View style={styles.inputContainer}>
            <View
              style={{
                position: "absolute",
                top: 8,
                left: 5,
                backgroundColor: theme.bg.mainBg,
                zIndex: 99,
                paddingHorizontal: 5,
              }}
            >
              <Text style={[styles.inputTitle]}>
                {translation.login.masterPassword}
              </Text>
            </View>
            <TextInput
              placeholder=""
              onChangeText={(text) => setMasterPassword(text)}
              secureTextEntry={!showPassword}
              style={[
                styles.textInput,
                { borderColor: error === true ? "red" : "#E5E6EB" },
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
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="black"
                style={{ marginRight: 0, opacity: 0.5 }}
              ></Ionicons>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.btnContainer,
              { opacity: masterPassword.length > 0 ? 1 : 0 },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.loginBtn,
                { backgroundColor: theme.btnColor.primary },
              ]}
              onPress={sendPasswordForVerification}
            >
              <Text style={{ color: theme.textColor.subtitle }}>
                {translation.login.loginBtn}
              </Text>
            </TouchableOpacity>
          </View>
          {hasData === true ? (
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => setErrorModalVisible(true)}
            >
              <Text>{translation.login.resetLocalData.btn}</Text>
              <Image
                source={require("../assets/faq.png")}
                style={{ width: 20, height: 20, marginLeft: 10 }}
              ></Image>
            </TouchableOpacity>
          ) : (
            <View>
              <Text style={[styles.infoText, { fontSize: 12 }]}>
                {translation.login.loginPageDescription}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
      <Modal
        visible={errorModalVisible}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>{translation.login.resetLocalData.title}</Text>
            <Text>{translation.login.resetLocalData.description}</Text>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={[
                  styles.closeButtonContainer,
                  {
                    width: "50%",
                    borderRightWidth: 1,
                    borderColor: "#E5E6EB",
                    marginTop: 10,
                  },
                ]}
                onPress={removeData}
              >
                <Text
                  style={[
                    styles.closeButton,
                    { color: theme.btnColor.primary },
                  ]}
                >
                  OK
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.closeButtonContainer,
                  { width: "50%", marginTop: 10 },
                ]}
                onPress={() => setErrorModalVisible(false)}
              >
                <Text
                  style={[
                    styles.closeButton,
                    { color: theme.btnColor.primary },
                  ]}
                >
                  {translation.login.resetLocalData.cancel}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={false}
        style={{ backgroundColor: theme.bg.mainBg }}
        visible={openSettings}
        onRequestClose={() => setOpenSettings(false)}
      >
        <View
          style={[
            styles.modalHeader,
            {
              backgroundColor: theme.bg.darkColor,
              paddingBottom: 5,
              paddingTop: 10,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => setOpenSettings(false)}
            style={styles.closeBtn}
          >
            <Ionicons
              name="arrow-back-outline"
              size={30}
              style={{ marginRight: "auto", opacity: 0.5, marginLeft: 10 }}
            ></Ionicons>
          </TouchableOpacity>
        </View>
        <Settings
          theme={theme}
          onPressTheme={onPressTheme}
          isDarkTheme={isDarkTheme}
          onChangeLanguage={onChangeLanguage}
          selectedLanguage={language}
          style={{ backgroundColor: theme.bg.mainBg }}
        ></Settings>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    width: screenWidth,
    alignSelf: "center",
    paddingTop: 50,
    paddingHorizontal: "auto",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 30,
  },
  inputContainer: {
    position: "relative",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  inputTitle: {
    fontSize: 16,
    opacity: 0.5,
  },
  textInput: {
    width: "100%",
    marginTop: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  loginBtn: {
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    marginLeft: "auto",
  },
  showPasswordBtn: {
    position: "absolute",
    right: 20,
    top: "50%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    textAlign: "center",
  },
  btnContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  resetBtn: {
    flexDirection: "row",
    opacity: 0.4,
    marginTop: 50,
  },

  infoText: {
    flexDirection: "row",
    opacity: 0.4,
    marginTop: 10,
  },
});

export default Login;
