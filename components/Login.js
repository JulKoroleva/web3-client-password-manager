/*
  Links to the repositories from which the imported packages are taken, as well as the name of the license 
  for each package used, are given in the file "license-checker-output.json" (obtained as a result of the 
  command output: "npx license-checker --json > license-checker-output.json"), located in the project root.
  The texts of all licenses used by the imported packages are presented in the "Licenses" directory, also 
  located in the root of this project.
  If the file "LICENSE__<license_name>___<package name>" has no content, then it corresponds to the standard 
  text of the corresponding license.
*/

import React, { useState, useEffect, useContext, useRef } from "react";
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
  Easing,
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
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedStop = Animated.createAnimatedComponent(Stop);

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

  const [gradientIndex, setGradientIndex] = useState(0);
  const colors = [
    ["#2474bf", "#4c89d9", "#2474bf", "#65bfc9"],
    ["#65bfc9", "#2fa1ad", "#3ab2c2", "#217d9e"],
    ["#217d9e", "#0886fc", "#08549c", "#2474bf"],
  ];
  const colors2 = [
    ["#2474bf", "#2474bf", "#4c89d9", "#59b3bd"],
    ["#59b3bd", "#3ab2c2", "#21929e", "#0d789e"],
    ["#0d789e", "#08549c", "#0886fc", "#2474bf"],
  ];
  const animatedValue = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const animatedColors = {
    color1: new Animated.Value(0),
    color2: new Animated.Value(1),
  };
  const backgroundColorInterpolate = animatedValue.interpolate({
    inputRange: [0, 0.5, 0.8, 1],
    outputRange: colors[gradientIndex],
  });
  const backgroundColorInterpolate2 = animatedValue.interpolate({
    inputRange: [0, 0.5, 0.8, 1],
    outputRange: colors2[gradientIndex],
  });

  const [gradientColors, setGradientColors] = useState(["#FF0000", "#0000FF"]);

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

  useEffect(() => {
    animateGradient();
  }, []);

  const animateGradient = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 8000,
      useNativeDriver: false,
    }).start(() => {
      setGradientIndex((prevIndex) => (prevIndex + 1) % colors.length);
      animatedValue.setValue(0);
      animateGradient();
    });
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: false,
        delay: 300,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      animateGradientChange();
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const animateGradientChange = () => {
    const newColor1 = getRandomColor();
    const newColor2 = getRandomColor();

    Animated.parallel([
      Animated.timing(animatedColors.color1, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(animatedColors.color2, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setGradientColors([newColor1, newColor2]);
      animatedColors.color1.setValue(0);
      animatedColors.color2.setValue(1);
    });
  };

  const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
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
            <Animated.View style={[{ opacity: opacity, marginBottom: 50 }]}>
              <Svg
                width="103"
                height="104"
                viewBox="0 0 513 484"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <AnimatedPath
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M280.15 106.161C279.044 102.032 274.897 94.086 272.966 89.6771L264.641 71.611C262.319 66.3446 257.633 56.8882 256.471 52.5531H254.991C254.131 55.7615 248.766 67.1473 246.957 71.3011L237.297 93.3531C236.97 94.0663 236.891 94.2774 236.5 95.2331L224.97 122.092C224.726 122.616 224.453 123.209 224.121 123.927L207.139 163.201C206.572 164.436 206.074 165.515 205.446 166.875L199.034 181.029C196.793 185.901 194.806 190.296 192.616 195.177L165.915 255.594C165.756 255.971 165.692 256.162 165.534 256.549C165.175 257.425 165.533 256.595 165.138 257.492L157.874 273.478C156.994 275.385 156.264 279.064 154.354 280.281L152.575 275.394C152.47 275.123 152.291 274.718 152.186 274.446L144.17 253.967C144.02 253.569 143.975 253.378 143.823 252.982L131.096 222.875C130.983 222.632 130.585 221.793 130.385 221.349C129.861 220.184 130.104 220.727 129.632 219.431C129.187 218.209 129.521 219.021 128.99 217.844C128.654 217.097 128.382 216.541 128.136 216.013L126.643 212.593C126.602 212.492 126.555 212.379 126.512 212.279C126.469 212.18 126.418 212.068 126.374 211.97L126.095 211.355C126.051 211.256 125.999 211.145 125.957 211.046L125.316 209.459C125.17 209.118 124.889 208.511 124.616 207.922L112.28 179.192C111.968 178.522 111.866 178.339 111.577 177.658L106.208 165.17C106.072 164.842 105.946 164.562 105.801 164.239C105.483 163.533 105.156 162.877 104.945 162.409C104.388 161.183 104.032 160.124 103.532 158.92C103.09 157.857 103.296 158.364 102.839 157.379L93.4656 135.507C93.2734 135.092 92.8474 134.183 92.7544 133.98L90.6497 128.949C90.0675 127.681 89.7029 126.925 89.0883 125.588C89.044 125.492 88.9899 125.38 88.9466 125.283C88.9023 125.186 88.8482 125.075 88.8049 124.977C88.4159 124.082 88.767 124.956 88.4186 124.027L87.692 122.085C87.6496 121.986 87.5954 121.876 87.5512 121.778L80.3552 105.304C77.8334 98.5419 74.3198 92.0742 71.7981 85.2958C71.7584 85.1898 71.7187 85.0761 71.678 84.9709L65.2789 70.3776C64.686 68.9856 64.2085 65.8479 62.1029 65.8479H0.437836C0.481158 67.5207 0.92702 68.4874 1.63191 69.9562C1.67704 70.052 1.73119 70.1642 1.77632 70.2591L3.60128 74.6766C3.65904 74.8037 3.82872 75.1615 3.88739 75.287C4.25021 76.0701 4.2448 76.0544 4.5977 76.8123L8.99583 87.142C9.03554 87.2479 9.07706 87.3609 9.11858 87.4645L27.3682 130.354C27.4079 130.457 27.4548 130.57 27.4972 130.671L35.3503 149.147C35.7439 150.104 35.7366 150.051 36.0291 150.701C36.4289 151.592 36.7989 152.556 37.1933 153.548L49.4193 181.946C49.7578 182.732 49.7803 182.697 50.1179 183.483L60.9061 208.843C60.9512 208.939 61.0063 209.05 61.0505 209.146L66.9667 222.873C67.0236 223 67.1824 223.367 67.2366 223.497C67.3783 223.837 67.4622 224.092 67.6129 224.455L79.8651 253.259C79.9247 253.385 80.0943 253.743 80.1512 253.869L80.4292 254.486C80.6693 255.063 80.6368 255.053 80.9048 255.787L108.475 320.165C108.657 320.629 108.744 320.881 108.979 321.443L125.673 360.538C125.894 361.055 125.809 360.845 126.091 361.461C126.245 361.798 126.65 362.661 126.659 362.683C126.716 362.81 126.874 363.178 126.928 363.307L127.855 365.504C127.898 365.603 127.949 365.714 127.992 365.813L128.638 367.395C128.68 367.495 128.732 367.606 128.774 367.706C128.817 367.805 128.869 367.916 128.912 368.016L146.516 408.892C147.43 411.401 149.172 413.642 149.42 416.232H150.9C151.124 413.895 153.907 409.258 154.988 406.92L156.33 403.797C158.098 399.642 160.059 395.471 162.036 391.174L186.139 337.934C186.78 336.542 186.922 336.228 187.546 334.869L207.492 290.881C209.495 286.523 211.254 282.704 213.271 278.322C213.477 277.875 213.857 277.043 213.973 276.788L226.234 250.134C226.276 250.036 226.328 249.925 226.373 249.826C226.417 249.729 226.471 249.619 226.515 249.522L228.886 244.292C229.308 243.248 229.012 243.829 229.549 242.724L249.563 197.936C249.609 197.844 249.668 197.734 249.715 197.641L253.056 190.253C253.101 190.158 253.16 190.048 253.206 189.954C253.251 189.86 253.312 189.75 253.357 189.656L267.611 158.733C267.756 158.409 267.881 158.127 268.016 157.799L285.299 120.501C285.506 120.072 285.881 119.227 286 118.966L290.37 109.471C290.996 108.108 291.135 107.803 291.777 106.405L300.38 87.7234C300.998 86.5362 301.297 86.1322 301.875 84.7347C302.305 83.6943 302.754 82.7606 303.265 81.6543C308.07 71.2524 333.429 17.9117 333.429 15.6708C333.429 9.97045 332.205 8.06458 331.96 4.0818C331.766 0.932294 331.618 2.79815 330.962 0.660812H329.482L324.272 11.9987C323.928 12.7096 323.791 12.8948 323.355 13.7743L317.334 26.9812C313.908 35.3744 308.906 45.1494 305.029 53.5959L285.925 94.8847C285.881 94.982 285.829 95.0942 285.785 95.1915L283.746 99.8522C282.834 101.82 281.764 105.134 280.15 106.161Z"
                  fill={backgroundColorInterpolate}
                />
                <AnimatedPath
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M357.602 278.565C356.049 272.774 349.852 261.258 346.956 254.797C346.912 254.7 346.86 254.588 346.816 254.489L346.3 253.223C346.259 253.12 346.219 253.004 346.176 252.902L345.608 251.681C345.562 251.587 345.501 251.478 345.456 251.384L324.996 206.127C324.954 206.024 324.916 205.908 324.874 205.804L316.853 187.87C315.672 184.888 318.946 179.657 320.32 176.678C321.234 174.698 322.164 172.868 322.935 171.232C323.117 170.843 323.412 170.175 323.492 170.001L325.606 165.406C326.513 163.442 327.215 161.911 328.143 159.891L338.646 137.287C339.174 136.139 339.416 135.515 339.904 134.52L343.854 125.947C343.898 125.85 343.953 125.739 343.998 125.642L349.496 113.697C351.485 109.51 350.334 106.106 349.352 101.754C349.038 100.372 349.402 99.1625 348.954 97.8114L347.735 95.011C346.238 95.9644 345.84 97.383 345.195 98.8079L325.535 141.329C320.265 152.813 315.177 164.794 309.463 176.247L285.928 227.407C285.616 228.08 285.518 228.262 285.23 228.945C284.215 231.358 283.353 232.576 282.362 235.029C279.185 242.901 275.137 250.888 271.553 258.654L265.001 273.114C264.573 274.047 264.641 273.923 264.28 274.633L252.595 299.641C251.701 301.589 250.939 303.617 249.978 305.516C248.927 307.594 248.31 309.062 247.314 311.347L205.109 401.601C199.699 412.181 195.236 423.437 190.295 434.182L184.755 446.091C183.095 450.157 181.296 453.85 179.374 457.711C178.434 459.601 177.777 461.874 176.718 463.55C171.541 471.743 173.93 470.645 177.974 480.613C178.498 481.904 178.88 483.275 180.006 483.992C181.488 478.464 188.587 464.791 191.357 458.693L199.243 440.245C200.956 435.198 203.607 430.311 205.871 425.423L239.135 352.699C243.094 344.13 252.263 322.956 256.707 314.367C260.093 307.82 262.69 301.046 265.773 294.371L268.332 288.877C268.379 288.785 268.44 288.675 268.488 288.584L286.07 250.69C286.2 252.046 286.315 251.629 286.482 252.046C286.521 252.143 286.576 252.259 286.618 252.358L288.184 255.714C288.532 256.475 288.799 257.048 289.314 258.162L299.95 281.509C300.287 282.181 300.74 283.21 301.082 283.955L325.75 337.562C325.794 337.66 325.848 337.771 325.893 337.867C325.937 337.965 325.991 338.075 326.035 338.173L330.823 348.591C331.714 350.428 332.395 351.913 333.22 353.798L340.408 369.421C340.816 370.262 341.033 371.015 341.458 371.94L361.548 416.232H363.522C363.565 414.541 363.691 414.791 364.25 413.434L368.601 403.493C368.645 403.396 368.7 403.285 368.744 403.188L374.802 389.156C379.339 379.276 382.944 368.954 387.554 359.071L402.145 325.009C402.483 324.223 402.505 324.258 402.843 323.472C403.363 322.269 403.527 321.7 403.983 320.602C404.456 319.465 404.647 319.172 405.246 317.841L413.98 297.557C414.292 296.89 414.395 296.704 414.685 296.026L426.526 268.151C426.582 268.023 426.751 267.665 426.807 267.536L433.924 250.996C434.105 250.607 434.446 249.876 434.493 249.774C434.92 248.843 435.239 247.962 435.686 246.951L487.693 125.335C487.975 124.723 488.253 124.147 488.399 123.804L501.228 93.7854C501.595 92.9271 502.036 92.0844 502.499 91.0306L504.737 85.6857C504.797 85.5343 505.11 84.7465 505.25 84.4162C505.293 84.3165 505.343 84.2051 505.386 84.1055L510.878 71.2964C510.935 71.1708 511.105 70.8123 511.165 70.6883L511.457 70.0849C511.931 69.0916 511.47 70.1979 511.89 69.1747C512.394 67.9515 512.504 67.3764 512.504 65.8479H448.865C448.826 67.414 448.797 66.7361 448.466 67.6455L406.147 167.235C405.896 167.836 405.661 168.316 405.311 169.08C405.252 169.206 405.085 169.566 405.028 169.693C404.622 170.614 405.003 169.734 404.633 170.636C404.474 171.023 404.412 171.214 404.251 171.59L401.787 177.168C401.655 177.453 401.525 177.743 401.366 178.088L392.37 199.002C391.398 201.495 390.661 203.296 389.601 205.601C389.512 205.791 389.076 206.708 388.888 207.125L385.365 215.213C385.307 215.338 385.138 215.697 385.081 215.824L383.544 219.633C383.486 219.76 383.316 220.118 383.258 220.243L381.34 224.579C381.158 225.082 381.209 225.047 380.993 225.565L369.237 253.085C369.18 253.211 369.01 253.569 368.951 253.695L368.099 255.527C368.054 255.623 368.002 255.735 367.957 255.832L363.175 267.113C362.815 267.896 362.715 268.1 362.463 268.639L360.357 273.671C360.075 274.297 359.667 275.123 359.503 275.501C358.931 276.815 358.759 277.828 357.602 278.565Z"
                  fill={backgroundColorInterpolate2}
                />
                <AnimatedPath
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M159.781 436.817C159.781 438.855 161.263 441.68 162.037 443.432C162.921 445.435 163.586 448.062 165.207 449.684C165.677 447.928 167.089 445.372 167.956 443.495C168.985 441.266 169.71 439.457 170.703 437.307L245.224 275.65C245.658 274.815 245.621 274.978 245.945 274.132L251.044 263.126C251.968 261.113 253.015 258.849 253.864 257.001L279.737 201.011C280.138 200.14 280.561 198.909 281.064 197.875L314.273 126.391C316.372 122.271 318.159 117.91 320.039 113.819L331.526 89.0682C333.862 83.9658 342.564 67.119 342.554 63.7208C342.546 61.5685 340.677 50.2071 339.841 48.6935C337.295 50.1757 336.312 54.4339 335.126 57.0302C334.666 58.0361 334.134 58.9408 333.636 60.0244L269.373 199.72C269.33 199.817 269.275 199.928 269.23 200.025L267.955 202.776C267.896 202.902 267.728 203.26 267.671 203.387L260.911 218.095C257.17 226.246 253.361 234.51 249.631 242.599L216.019 315.019C210.465 327.078 205.185 339.459 199.041 351.294L196.855 355.828C196.811 355.926 196.757 356.036 196.713 356.133L193.249 363.414C192.348 365.344 191.457 367.433 190.554 369.648C189.648 371.872 188.724 373.484 187.688 375.734L168.097 418.315C167.19 420.28 166.038 422.394 165.266 424.432C164.563 426.291 159.781 436.19 159.781 436.817Z"
                  fill={backgroundColorInterpolate2}
                />
              </Svg>
            </Animated.View>
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
    paddingTop: 30,
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
