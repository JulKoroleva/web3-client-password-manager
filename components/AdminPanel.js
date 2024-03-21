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
import store from "../store/store.js";
import TranslationContext from "../translation/TranslationContext";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
  Dimensions,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import {
  addTokensForUserAddress,
  updateCommissionRecipientAddress,
  updateCommissionSize,
  getCommissionRecipientAddress,
  getMyBalance,
  getUserTokenAmount,
  getCurrentCommissionSize,
} from "../scripts/dataStorageSmartContractInterface";
import Svg, { Path } from "react-native-svg";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import Ionicons from "react-native-vector-icons/Ionicons";
import Loader from "./Loader";

const screenWidth = Dimensions.get("window").width;

const AdminPanel = ({ onLoading, theme }) => {
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("loading");
  const translation = useContext(TranslationContext);
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [dataValidation, setDataValidation] = useState({});

  const [commissionRecipientAddress, setCommissionRecipientAddress] =
    useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [totalTokensForRecipient, setTotalTokensForRecipient] = useState("");
  const [newCommissionRecipientAddress, setNewCommissionRecipientAddress] =
    useState("");
  const [newCommissionSize, setNewCommissionSize] = useState("");

  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [isOpen4, setIsOpen4] = useState(false);

  const animatedValue1 = useState(new Animated.Value(0))[0];
  const animatedValue2 = useState(new Animated.Value(0))[0];
  const animatedValue3 = useState(new Animated.Value(0))[0];
  const animatedValue4 = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchData = async () => {
      const adress = await getCommissionRecipientAddress();
      setCommissionRecipientAddress(adress);
    };
    fetchData();
  }, []);

  const toggleView = (index) => {
    switch (index) {
      case 1:
        setIsOpen1(!isOpen1);
        animateView(isOpen1, animatedValue1);
        break;
      case 2:
        setIsOpen2(!isOpen2);
        animateView(isOpen2, animatedValue2);
        break;
      case 3:
        setIsOpen3(!isOpen3);
        animateView(isOpen3, animatedValue3);
        break;
      case 4:
        setIsOpen4(!isOpen4);
        animateView(isOpen4, animatedValue4);
        break;
      default:
        break;
    }
  };

  const animateView = (isOpen, animatedValue) => {
    Animated.timing(animatedValue, {
      toValue: isOpen ? 0 : 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const getContentStyle = (animatedValue, index) => {
    let height;
    switch (index) {
      case 1:
        height = animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 180],
        });
        break;
      case 2:
        height = animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 230],
        });
        break;
      default:
        height = animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 100],
        });
    }
    return {
      height,
      overflow: "hidden",
    };
  };

  const addTokens = async () => {
    let isValid = true;
    if (recipientAddress.trim() === "") {
      setDataValidation({
        ...dataValidation,
        recipientAddress: "Заполните поле",
      });
      isValid = false;
    }
    if (totalTokensForRecipient.trim() === "") {
      setDataValidation({
        ...dataValidation,
        totalTokensForRecipient: "Заполните поле",
      });
      isValid = false;
    }
    if (
      isNaN(totalTokensForRecipient) ||
      /[^\d]/.test(totalTokensForRecipient)
    ) {
      setDataValidation({
        totalTokensForRecipient: "Введите корректное число",
      });
      isValid = false;
      return;
    }

    if (isValid) {
      setLoading(true);
      setLoadingStatus("loading");
      const res = await addTokensForUserAddress(
        recipientAddress,
        totalTokensForRecipient
      );
      if (res === true) {
        setLoadingStatus("success");
        setRecipientAddress("");
        setTotalTokensForRecipient("");
        setDataValidation({});
        const tokens = await getUserTokenAmount();
        store.dispatch({
          type: "SET_USER_TOKENS",
          payload: {
            tokens: tokens,
          },
        });

        setTimeout(() => {
          setLoading(false);
        }, 3000);
      } else {
        setLoadingStatus("error");
        setDataValidation({
          ...dataValidation,
          recipientAddress: "Заполните поле",
        });
        isValid = false;
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    }
  };

  const sendNewCommissionSize = async () => {
    let isValid = true;
    if (newCommissionSize.trim() === "") {
      setDataValidation({
        ...dataValidation,
        newCommissionSize: "Заполните поле",
      });
      isValid = false;
      return;
    }
    if (isNaN(newCommissionSize)) {
      setDataValidation({
        ...dataValidation,
        newCommissionSize: "Введите число",
      });
      isValid = false;
      return;
    }
    if (isValid) {
      setLoading(true);
      setLoadingStatus("loading");
      const res = await updateCommissionSize(newCommissionSize);
      if (res === true) {
        setLoadingStatus("success");
        setNewCommissionSize("");
        const comission = await getCurrentCommissionSize();
        store.dispatch({
          type: "SET_CURRENT_COMISSION",
          payload: {
            comission: comission,
          },
        });
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      } else {
        setLoadingStatus("error");
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        setDataValidation({
          ...dataValidation,
          newCommissionSize: "Заполните поле",
        });
        isValid = false;
      }
    }
  };

  const updateRecipientAddress = async () => {
    let isValid = true;
    if (newCommissionRecipientAddress.trim() === "") {
      setDataValidation({
        ...dataValidation,
        newCommissionRecipientAddress: "Заполните поле",
      });
      isValid = false;
      return;
    }
    if (isValid) {
      setLoading(true);
      setLoadingStatus("loading");
      const res = await updateCommissionRecipientAddress(
        newCommissionRecipientAddress
      );
      if (res === true) {
        setLoadingStatus("success");
        setCommissionRecipientAddress(newCommissionRecipientAddress);
        setNewCommissionRecipientAddress("");
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      } else {
        setLoadingStatus("error");
        setDataValidation({
          ...dataValidation,
          newCommissionRecipientAddress: "Заполните поле",
        });
        isValid = false;
      }

      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

  const copyToClipboard = (textToCopy) => {
    try {
      Clipboard.setString(textToCopy);
      Haptics.selectionAsync();
    } catch (error) {
      // console.error("Error copying to clipboard:", error);
    }
  };

  return (
    <>
      {loading && (
        <Modal visible={loading} transparent={false}>
          <Loader theme={theme} status={loadingStatus}></Loader>
        </Modal>
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        contentContainerStyle={styles.scrollViewContainer}
        scrollEnabled={scrollEnabled}
        style={[{ backgroundColor: theme.bg.backgroundColor }]}
        endFillColor="#000"
        overScrollMode="never"
      >
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => toggleView(1)}
            style={[
              styles.header,
              {
                borderColor: theme.borderColor,
                backgroundColor: theme.bg.FlatList,
              },
            ]}
          >
            <Text style={{ fontWeight: "500", opacity: 0.5 }}>
              {translation.adminPanel.addTokensTitle}
            </Text>
            {isOpen1 === true && (
              <Svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={styles.arrow}
              >
                <Path
                  d="M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z"
                  fill="#6c757d"
                />
              </Svg>
            )}
            {isOpen1 === false && (
              <Svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ ...styles.arrow, transform: [{ rotate: "-90deg" }] }}
              >
                <Path
                  d="M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z"
                  fill="#6c757d"
                />
              </Svg>
            )}
          </TouchableOpacity>
          <Animated.View
            style={[
              styles.contentView,
              getContentStyle(animatedValue1, 1),
              { display: isOpen1 ? "flex" : "none" },
            ]}
          >
            <TextInput
              value={recipientAddress}
              style={[
                styles.textInput,
                {
                  borderColor: dataValidation.recipientAddress
                    ? "red"
                    : theme.borderColor,
                },
              ]}
              placeholder={translation.adminPanel.recipientAddress}
              onChangeText={(text) => {
                setRecipientAddress(text);
                const newDataValidation = { ...dataValidation };
                delete newDataValidation.recipientAddress;
                setDataValidation(newDataValidation);
              }}
            />
            <TextInput
              value={totalTokensForRecipient}
              style={[
                styles.input,
                {
                  borderColor: dataValidation.totalTokensForRecipient
                    ? "red"
                    : theme.borderColor,
                },
              ]}
              placeholder={translation.adminPanel.sum}
              onChangeText={(text) => {
                setTotalTokensForRecipient(text);
                const newDataValidation = { ...dataValidation };
                delete newDataValidation.totalTokensForRecipient;
                setDataValidation(newDataValidation);
              }}
              keyboardType="numeric"
            />
            <TouchableOpacity
              onPress={async () => addTokens()}
              style={[
                styles.addBtn,
                { backgroundColor: theme.btnColor.primary },
              ]}
            >
              <Text style={{ color: "white" }}>
                {translation.adminPanel.confirmBtn}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity
            onPress={() => toggleView(2)}
            style={[
              styles.header,
              {
                borderColor: theme.borderColor,
                backgroundColor: theme.bg.FlatList,
              },
            ]}
          >
            <Text style={{ fontWeight: "500", opacity: 0.5 }}>
              {translation.adminPanel.changeCommissionRecipient}
            </Text>
            {isOpen2 === true && (
              <Svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={styles.arrow}
              >
                <Path
                  d="M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z"
                  fill="#6c757d"
                />
              </Svg>
            )}
            {isOpen2 === false && (
              <Svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ ...styles.arrow, transform: [{ rotate: "-90deg" }] }}
              >
                <Path
                  d="M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z"
                  fill="#6c757d"
                />
              </Svg>
            )}
          </TouchableOpacity>
          <Animated.View
            style={[
              styles.contentView,
              getContentStyle(animatedValue2, 2), // Pass index for section 2
              { display: isOpen2 ? "flex" : "none" },
            ]}
          >
            <Text style={{ marginLeft: 0, opacity: 0.5 }}>
              {translation.adminPanel.currentRecipientAddress}
            </Text>
            <TouchableOpacity
              onPress={() => copyToClipboard(commissionRecipientAddress)}
              style={{
                marginRight: "auto",
              }}
            >
              <Text style={{ marginBottom: 0, marginLeft: 0, opacity: 0.3 }}>
                {commissionRecipientAddress}
              </Text>
            </TouchableOpacity>
            <TextInput
              value={newCommissionRecipientAddress}
              style={[
                styles.textInput,
                {
                  borderColor: dataValidation.newCommissionRecipientAddress
                    ? "red"
                    : theme.borderColor,
                },
              ]}
              placeholder={translation.adminPanel.commissionRecipientAddress}
              onChangeText={(text) => {
                setNewCommissionRecipientAddress(text);
                const newDataValidation = { ...dataValidation };
                delete newDataValidation.newCommissionRecipientAddress;
                setDataValidation(newDataValidation);
              }}
            />
            <TouchableOpacity
              onPress={async () => updateRecipientAddress()}
              style={[
                styles.addBtn,
                { backgroundColor: theme.btnColor.primary },
              ]}
            >
              <Text style={{ color: "white" }}>
                {translation.adminPanel.confirmBtn}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity
            onPress={() => toggleView(3)}
            style={[
              styles.header,
              {
                borderColor: theme.borderColor,
                backgroundColor: theme.bg.FlatList,
              },
            ]}
          >
            <Text style={{ fontWeight: "500", opacity: 0.5 }}>
              {translation.adminPanel.changeCommissionSize}
            </Text>
            {isOpen3 === true && (
              <Svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={styles.arrow}
              >
                <Path
                  d="M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z"
                  fill="#6c757d"
                />
              </Svg>
            )}
            {isOpen3 === false && (
              <Svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ ...styles.arrow, transform: [{ rotate: "-90deg" }] }}
              >
                <Path
                  d="M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z"
                  fill="#6c757d"
                />
              </Svg>
            )}
          </TouchableOpacity>
          <Animated.View
            style={[
              styles.contentView,
              getContentStyle(animatedValue3),
              { display: isOpen3 ? "flex" : "none" },
            ]}
          >
            <TextInput
              value={newCommissionSize}
              style={[
                styles.input,
                {
                  borderColor: dataValidation.newCommissionSize
                    ? "red"
                    : theme.borderColor,
                },
              ]}
              placeholder={translation.adminPanel.cost}
              onChangeText={(text) => {
                setNewCommissionSize(text);
                const newDataValidation = { ...dataValidation };
                delete newDataValidation.newCommissionSize;
                setDataValidation(newDataValidation);
              }}
              keyboardType="numeric"
            />
            <TouchableOpacity
              onPress={async () => sendNewCommissionSize()}
              style={[
                styles.addBtn,
                { backgroundColor: theme.btnColor.primary },
              ]}
            >
              <Text style={{ color: "white" }}>
                {translation.adminPanel.confirmBtn}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
      <Modal
        visible={successMessageVisible}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={[
                styles.closeButtonContainer,
                { position: "absolute", top: 4, right: 4 },
              ]}
              onPress={() => setSuccessMessageVisible(false)}
            >
              <Ionicons
                name="close-outline"
                size={20}
                style={{ opacity: 0.5 }}
              ></Ionicons>
            </TouchableOpacity>

            <Text style={{ opacity: 0.7 }}>
              {translation.adminPanel.successMessage}
            </Text>
          </View>
        </View>
      </Modal>
    </>
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
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    height: 50,
  },
  contentView: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  input: {
    width: "50%",
    borderBottomWidth: 1,
    borderColor: "#E5E6EB",
    borderStyle: "solid",
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: "#E5E6EB",
    height: 50,
  },
  addBtn: {
    backgroundColor: "#0071b8",
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderStyle: "solid",
    padding: 10,
    width: screenWidth,
    maxWidth: 800,
  },
  btnContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AdminPanel;
