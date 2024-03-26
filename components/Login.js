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
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Animate,
  G,
  Path,
} from "react-native-svg";

import Settings from "./Settings";
import Ionicons from "react-native-vector-icons/Ionicons";

import TranslationContext from "../translation/TranslationContext";

const screenWidth = Dimensions.get("window").width;
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);


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

  
  const [gradientColors, setGradientColors] = useState(['#FF0000', '#0000FF']); // Начальные цвета градиента

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Генерация новых случайных цветов
      const newColor1 = getRandomColor();
      const newColor2 = getRandomColor();
      // Установка новых цветов в состояние
      setGradientColors([newColor1, newColor2]);
    }, 1000); // Интервал в миллисекундах
    return () => clearInterval(intervalId); // Очистка интервала при размонтировании компонента
  }, []); // Пустой массив зависимостей для выполнения useEffect только при монтировании

  // Функция для генерации случайного цвета в формате HEX
  const getRandomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  };

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
            <Svg
              width="66.1458mm"
              height="66.1458mm"
              version="1.1"
              style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
              viewBox="0 0 6614.58 6614.58"
            >
               <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={gradientColors[0]} />
            <Stop offset="100%" stopColor={gradientColors[1]} />
          </LinearGradient>
              <G id="Слой_x0020_1">
                
                <G id="_2654813594912">
                  <Path
          fill="url(#grad)"
                    class="fil0"
                    d="M3513.93 1531.44c-12.26,-52.63 -58.21,-153.9 -79.6,-210.09l-92.24 -230.25c-25.73,-67.12 -77.65,-187.64 
                    -90.52,-242.89l-16.4 0c-9.53,40.89 -68.97,186 -89.01,238.94l-107.03 281.05c-3.62,9.09 -4.5,11.78 -8.83,23.96l-127.75 
                    342.31c-2.7,6.68 -5.73,14.24 -9.41,23.39l-188.15 500.54c-6.29,15.74 -11.8,29.49 -18.76,46.83l-71.04 180.39c-24.83,62.09 
                    -46.85,118.1 -71.11,180.31l-295.84 770.01c-1.77,4.8 -2.47,7.24 -4.22,12.17 -3.98,11.16 -0.02,0.58 -4.39,12.01l-80.48 
                    203.74c-9.76,24.31 -17.84,71.2 -39.01,86.71l-19.71 -62.28c-1.16,-3.46 -3.14,-8.62 -4.31,-12.09l-88.81 -261c-1.66,-5.07 
                    -2.16,-7.5 -3.84,-12.55l-141.02 -383.71c-1.25,-3.1 -5.66,-13.79 -7.87,-19.45 -5.81,-14.85 -3.12,-7.93 -8.35,-24.45 -4.93,-15.57 
                    -1.23,-5.22 -7.11,-20.22 -3.72,-9.52 -6.74,-16.61 -9.46,-23.34l-16.54 -43.58c-0.46,-1.29 -0.98,-2.73 -1.46,-4.01 -0.47,-1.26 
                    -1.04,-2.68 -1.52,-3.94l-3.1 -7.83c-0.48,-1.26 -1.06,-2.68 -1.53,-3.94l-7.1 -20.23c-1.61,-4.34 -4.73,-12.08 -7.75,-19.58l-136.68 
                    -366.17c-3.46,-8.54 -4.59,-10.87 -7.79,-19.54l-59.49 -159.16c-1.51,-4.18 -2.9,-7.75 -4.51,-11.87 -3.52,-9 -7.14,-17.36 -9.48,-23.32
                     -6.17,-15.63 -10.12,-29.12 -15.66,-44.47 -4.89,-13.55 -2.61,-7.09 -7.68,-19.64l-103.85 -278.76c-2.13,-5.28 -6.85,-16.87 
                     -7.88,-19.45l-23.32 -64.13c-6.45,-16.16 -10.49,-25.79 -17.3,-42.83 -0.49,-1.23 -1.09,-2.65 -1.57,-3.89 -0.49,-1.24 -1.09,-2.65 
                     -1.57,-3.9 -4.31,-11.41 -0.42,-0.27 -4.28,-12.11l-8.05 -24.75c-0.47,-1.26 -1.07,-2.66 -1.56,-3.91l-79.73 -209.96c-27.94,-86.18 
                     -66.87,-168.61 -94.81,-255 -0.44,-1.35 -0.88,-2.8 -1.33,-4.14l-70.9 -185.99c-6.57,-17.74 -11.86,-57.73 -35.19,-57.73l-683.23 
                     0c0.48,21.32 5.42,33.64 13.23,52.36 0.5,1.22 1.1,2.65 1.6,3.86l20.22 56.3c0.64,1.62 2.52,6.18 3.17,7.78 4.02,9.98 3.96,9.78 
                     7.87,19.44l48.73 131.65c0.44,1.35 0.9,2.79 1.36,4.11l202.2 546.62c0.44,1.31 0.96,2.75 1.43,4.04l87.01 235.47c4.36,12.2 4.28,11.52 
                     7.52,19.81 4.43,11.36 8.53,23.64 12.9,36.28l135.46 361.93c3.75,10.02 4,9.57 7.74,19.59l119.53 323.21c0.5,1.22 1.11,2.64 1.6,3.87l65.55 
                     174.94c0.63,1.62 2.39,6.3 2.99,7.95 1.57,4.34 2.5,7.59 4.17,12.22l135.75 367.1c0.66,1.6 2.54,6.16 3.17,7.77l3.08 7.86c2.66,7.36 
                     2.3,7.23 5.27,16.59l305.47 820.49c2.02,5.91 2.98,9.12 5.58,16.28l184.97 498.26c2.45,6.59 1.5,3.91 4.63,11.77 1.71,4.29 6.19,15.29 
                     6.29,15.57 0.63,1.62 2.38,6.31 2.98,7.95l10.27 28c0.48,1.26 1.05,2.68 1.52,3.94l7.16 20.17c0.47,1.27 1.04,2.68 1.51,3.96 0.47,1.26 
                     1.05,2.67 1.52,3.95l195.05 520.96c10.13,31.97 29.43,60.53 32.18,93.54l16.4 0c2.48,-29.78 33.31,-88.88 45.29,-118.68l14.87 
                     -39.8c19.59,-52.95 41.31,-106.11 63.22,-160.88l267.05 -678.53c7.11,-17.74 8.68,-21.75 15.59,-39.07l221 -560.62c22.19,-55.54 41.68,-104.21 
                     64.03,-160.06 2.28,-5.69 6.49,-16.3 7.78,-19.55l135.84 -339.7c0.47,-1.25 1.05,-2.67 1.54,-3.92 0.49,-1.24 1.09,-2.65 1.58,-3.88l26.27 
                     -66.66c4.67,-13.3 1.39,-5.9 7.34,-19.98l221.75 -570.81c0.51,-1.18 1.17,-2.58 1.69,-3.77l37.01 -94.16c0.5,-1.21 1.15,-2.61 1.66,-3.81 
                     0.5,-1.2 1.18,-2.59 1.68,-3.79l157.93 -394.11c1.6,-4.13 2.99,-7.72 4.49,-11.91l191.49 -475.35c2.29,-5.47 6.44,-16.24 7.76,-19.57l48.42 
                     -121.01c6.94,-17.37 8.48,-21.26 15.59,-39.07l95.32 -238.1c6.85,-15.13 10.16,-20.28 16.56,-38.09 4.77,-13.26 9.74,-25.16 15.4,-39.26 
                     53.24,-132.57 334.21,-812.39 334.21,-840.95 0,-72.65 -13.56,-96.94 -16.27,-147.7 -2.15,-40.14 -3.79,-16.36 -11.06,-43.6l-16.4 0 -57.73 
                     144.5c-3.81,9.06 -5.32,11.42 -10.16,22.63l-66.71 168.32c-37.96,106.97 -93.38,231.55 -136.33,339.2l-211.67 526.22c-0.49,1.24 -1.06,2.67 
                     -1.55,3.91l-22.59 59.4c-10.11,25.08 -21.96,67.31 -39.84,80.41z"
                  />
                  <Path
          fill="url(#grad)"
                    class="fil0"
                    d="M4372.07 3728.7c-17.2,-73.8 -85.87,-220.57 -117.95,-302.92 -0.49,-1.24 -1.07,-2.66 -1.55,-3.92l-5.72 -16.14c-0.46,-1.31 -0.9,-2.79 
                    -1.38,-4.09l-6.29 -15.57c-0.51,-1.19 -1.18,-2.58 -1.68,-3.78l-226.69 -576.79c-0.47,-1.31 -0.89,-2.8 -1.35,-4.12l-88.87 -228.56c-13.09,-38.01 
                    23.19,-104.68 38.41,-142.64 10.12,-25.24 20.43,-48.56 28.97,-69.42 2.02,-4.95 5.29,-13.46 6.17,-15.68l23.43 -58.56c10.04,-25.04 17.82,-44.55 
                    28.1,-70.29l116.38 -288.09c5.85,-14.63 8.53,-22.58 13.93,-35.26l43.77 -109.27c0.49,-1.23 1.1,-2.65 1.59,-3.88l60.92 -152.24c22.04,-53.36 
                    9.28,-96.74 -1.6,-152.21 -3.47,-17.62 0.56,-33.03 -4.41,-50.25l-13.5 -35.69c-16.59,12.15 -21,30.23 -28.14,48.39l-217.83 541.92c-58.39,146.37 
                    -114.76,299.07 -178.07,445.03l-260.76 652.03c-3.46,8.57 -4.55,10.9 -7.74,19.6 -11.25,30.75 -20.79,46.28 -31.77,77.54 -35.21,100.33 
                    -80.06,202.12 -119.77,301.1l-72.59 184.29c-4.74,11.89 -3.99,10.31 -7.99,19.35l-129.47 318.73c-9.9,24.82 -18.34,50.67 -28.99,74.87 
                    -11.65,26.49 -18.48,45.2 -29.52,74.32l-467.62 1150.27c-59.94,134.85 -109.39,278.3 -164.13,415.25l-61.38 151.78c-18.39,51.81 -38.33,98.88 
                    -59.62,148.09 -10.42,24.09 -17.7,53.05 -29.43,74.41 -57.36,104.42 -30.89,90.43 13.92,217.47 5.8,16.46 10.03,33.93 22.51,43.07 16.42,-70.46 
                    95.08,-244.72 125.77,-322.44l87.37 -235.11c18.98,-64.33 48.35,-126.61 73.44,-188.91l368.55 -926.86c43.87,-109.21 145.46,-379.06 194.7,-488.53
                     37.51,-83.44 66.29,-169.78 100.44,-254.84l28.36 -70.03c0.52,-1.17 1.19,-2.57 1.72,-3.73l194.81 -482.96c1.44,17.29 2.71,11.97 4.56,17.29 
                     0.43,1.24 1.04,2.71 1.51,3.97l17.35 42.78c3.86,9.69 6.82,17 12.52,31.2l117.85 297.55c3.73,8.57 8.75,21.68 12.54,31.18l273.31 
                     683.21c0.49,1.24 1.09,2.66 1.58,3.89 0.49,1.24 1.09,2.65 1.58,3.89l53.05 132.78c9.87,23.41 17.42,42.34 26.56,66.36l79.64 199.12c4.52,10.72 
                     6.92,20.31 11.63,32.1l222.59 564.49 21.87 0c0.48,-21.55 1.88,-18.36 8.07,-35.65l48.21 -126.7c0.49,-1.24 1.09,-2.65 1.58,-3.89l67.12 
                     -178.84c50.27,-125.92 90.21,-257.47 141.29,-383.43l161.66 -434.11c3.75,-10.02 3.99,-9.57 7.74,-19.59 5.76,-15.33 7.58,-22.58 12.63,-36.57 
                     5.24,-14.5 7.35,-18.23 13.99,-35.2l96.77 -258.51c3.46,-8.5 4.6,-10.87 7.81,-19.51l131.2 -355.26c0.62,-1.64 2.49,-6.2 3.11,-7.84l78.86 
                     -210.81c2,-4.95 5.78,-14.27 6.3,-15.57 4.73,-11.86 8.27,-23.09 13.22,-35.98l576.22 -1549.98c3.13,-7.79 6.2,-15.14 7.82,-19.51l142.14 
                     -382.58c4.07,-10.94 8.96,-21.68 14.09,-35.11l24.79 -68.12c0.67,-1.93 4.14,-11.97 5.69,-16.18 0.47,-1.27 1.03,-2.69 1.5,-3.96l60.85 
                     -163.25c0.64,-1.6 2.52,-6.17 3.18,-7.75l3.24 -7.69c5.25,-12.66 0.14,1.44 4.8,-11.6 5.58,-15.59 6.8,-22.92 6.8,-42.4l-705.1 0c-0.44,19.96 
                     -0.75,11.32 -4.42,22.91l-468.89 1269.25c-2.78,7.67 -5.38,13.78 -9.26,23.52 -0.65,1.61 -2.5,6.19 -3.13,7.81 -4.5,11.74 -0.28,0.52 
                     -4.38,12.02 -1.76,4.93 -2.45,7.36 -4.23,12.16l-27.3 71.09c-1.46,3.63 -2.91,7.33 -4.67,11.72l-99.67 266.55c-10.77,31.77 -18.94,54.73 
                     -30.68,84.1 -0.98,2.42 -5.82,14.11 -7.9,19.43l-39.03 103.08c-0.65,1.59 -2.52,6.17 -3.15,7.78l-17.03 48.55c-0.64,1.62 -2.52,6.18 
                     -3.17,7.77l-21.25 55.27c-2.02,6.41 -1.45,5.96 -3.84,12.56l-130.26 350.74c-0.63,1.61 -2.51,6.17 -3.16,7.78l-9.45 23.34c-0.49,1.23 
                     -1.07,2.66 -1.57,3.89l-52.98 143.78c-3.99,9.97 -5.1,12.57 -7.89,19.45l-23.33 64.12c-3.13,7.98 -7.65,18.51 -9.47,23.33 -6.33,16.75 
                     -8.24,29.66 -21.06,39.05z"
                  />
                  <Path 
          fill="url(#grad)"
                    class="fil0"
                    d="M2180.27 5745.6c0,25.97 16.42,61.97 25,84.31 9.79,25.52 17.16,59 35.12,79.67 5.21,-22.37 20.86,-54.95 30.46,-78.87 11.4,-28.41 
                    19.43,-51.46 30.44,-78.87l825.67 -2060.29c4.81,-10.65 4.4,-8.57 7.99,-19.35l56.49 -140.27c10.24,-25.65 21.84,-54.51 31.25,-78.06l286.66 
                    -713.59c4.44,-11.1 9.13,-26.78 14.7,-39.96l367.95 -911.06c23.26,-52.51 43.05,-108.09 63.88,-160.22l127.28 -315.45c25.88,-65.03 122.29,-279.74 
                    122.18,-323.05 -0.08,-27.43 -20.79,-172.23 -30.05,-191.52 -28.21,18.89 -39.1,73.16 -52.25,106.25 -5.09,12.82 -10.99,24.35 -16.5,38.16l-712.02 
                    1780.4c-0.48,1.24 -1.09,2.65 -1.58,3.89l-14.13 35.06c-0.65,1.6 -2.52,6.17 -3.15,7.78l-74.9 187.46c-41.44,103.88 -83.65,209.21 
                    -124.97,312.3l-372.42 922.98c-61.53,153.69 -120.03,311.48 -188.11,462.32l-24.22 57.78c-0.48,1.25 -1.08,2.65 -1.57,3.89l-38.38 
                    92.8c-9.98,24.6 -19.85,51.22 -29.86,79.45 -10.04,28.34 -20.28,48.89 -31.75,77.57l-217.07 542.68c-10.05,25.05 -22.81,51.99 -31.36,77.96 
                    -7.79,23.69 -60.78,149.86 -60.78,157.85z"
                  />
                </G>
              </G>
            </Svg>
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
