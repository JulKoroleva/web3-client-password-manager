/*
  Links to the repositories from which the imported packages are taken, as well as the name of the license 
  for each package used, are given in the file "license-checker-output.json" (obtained as a result of the 
  command output: "npx license-checker --json > license-checker-output.json"), located in the project root.
  The texts of all licenses used by the imported packages are presented in the "Licenses" directory, also 
  located in the root of this project.
  If the file "LICENSE__<license_name>___<package name>" has no content, then it corresponds to the standard 
  text of the corresponding license.
*/

import React, { useEffect, useState, useContext } from "react";
import store from "../store/store";
import TranslationContext from "../translation/TranslationContext";
import CryptoJS from "rn-crypto-js";
import * as DocumentPicker from "expo-document-picker";
import * as MediaLibrary from "expo-media-library";
import * as ExpoFileSystem from "expo-file-system";
import Papa from "papaparse";
import { useSelector } from "react-redux";
import * as Permissions from "expo-permissions";
import { PureComponent } from "react";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import {
  convertToViewFormat,
  convertFromViewFormat,
  getElementsForDelete,
  processEncryptedData,
  decryptStructuredData,
  getFullCurrentNewStorageState,
  getRemovedEmptyNameFields,
} from "../utils/utils";
import {
  updateData,
  deleteData,
  getData,
  estimateGasSize,
  estimateWei,
  estimateGasSizeDeleteData,
  getPureDataSize,
  getPayableDataSize,
  getMyBalance,
  getCurrentCommissionSize,
  connectToNode,
  getUserTokenAmount,
} from "../scripts/dataStorageSmartContractInterface";
import Svg, { Path } from "react-native-svg";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  Linking,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import AddForm from "./AddForm";
import SelectKeys from "./SelectKeys";

import EditDataForm from "./EditDataForm";

import Loader from "./Loader";
import MenuBotton from "./MenuBotton";
import Faq from "./Faq";
import DocumentPickerBotton from "./DocumentPickerBotton";
import chips from "../assets/bank/chips.png";

const screenWidth = Dimensions.get("window").width;
const HomeScreen = ({ onLoading, theme, language }) => {
  const translation = useContext(TranslationContext);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("loading");
  const data = useSelector((state) => state.items.data);

  const [expandedCategories, setExpandedCategories] = useState([]);
  const [expandedSubItems, setExpandedSubItems] = useState([]);
  const [selectedPasswords, setSelectedPasswords] = useState([]);

  const [expanded, setExpanded] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectKeyModalVisible, setSelectKeyModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [editDataModalVisible, setEditDataModalVisible] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [deleteDataModal, setDeleteDataModal] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorSaveDataModal, setErrorSaveDataModal] = useState({
    isError: false,
    errorMessage: "",
  });
  const [menuPanels, setMenuPanels] = useState({});
  const [showFAQ, setShowFAQ] = useState(false);

  const openModal = () => {
    setAddModalVisible(true);
  };

  const closeModal = () => {
    setAddModalVisible(false);
  };
  const handlePress = () => {
    setExpanded(true);
  };
  const closeComposeBtn = () => {
    setExpanded(false);
  };
  const toggleSelectKeyModalVisible = () => {
    setSelectKeyModalVisible(!selectKeyModalVisible);
  };

  const toggleEditDataModalVisible = (item) => {
    setSelectedData(item);
    setEditDataModalVisible(!editDataModalVisible);
  };
  const toggleDeleteDataModalVisible = (item) => {
    setSelectedData(item);
    setDeleteDataModal(!deleteDataModal);
  };
  const openURL = (url) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }

    Linking.openURL(url).catch((err) =>
      console.error("Error opening URL:", err)
    );
  };

  const toggleCategory = (category) => {
    closeComposeBtn();
    setExpandedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((c) => c !== category)
        : [...prevCategories, category]
    );
  };

  const toggleSubItem = (itemId) => {
    closeComposeBtn();
    setExpandedSubItems((prevSubItems) =>
      prevSubItems.includes(itemId)
        ? prevSubItems.filter((item) => item !== itemId)
        : [...prevSubItems, itemId]
    );
  };

  const toggleMenuPanel = (itemId) => {
    setMenuPanels((prevMenuPanels) => ({
      ...prevMenuPanels,
      [itemId]: !prevMenuPanels[itemId],
    }));
  };

  const checkAndRequestPermissions = async () => {
    try {
      const { status: cameraRollStatus } =
        await MediaLibrary.requestPermissionsAsync();
      const { status: storageStatus } =
        await MediaLibrary.getPermissionsAsync();

      if (cameraRollStatus !== "granted" || storageStatus !== "granted") {
        const { status: newCameraRollStatus } =
          await MediaLibrary.requestPermissionsAsync();
        const { status: newStorageStatus } =
          await MediaLibrary.getPermissionsAsync();

        if (
          newCameraRollStatus === "granted" &&
          newStorageStatus === "granted"
        ) {
        } else {
          // console.log("Permissions not granted.");
        }
      } else {
      }
    } catch (error) {
      // console.error("Error checking and requesting permissions:", error);
    }
  };

  const pickDocument = async () => {
    setLoading(true);
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      checkAndRequestPermissions();
      if (status === "granted") {
        const result = await DocumentPicker.getDocumentAsync({
          type: "*/*",
          copyToCacheDirectory: false,
          multiple: false,
        });

        if (result.type === "success" && result.name.endsWith(".csv")  || result.canceled === false && result.assets[0].name.endsWith(".csv")) {
          const tempUri = ExpoFileSystem.cacheDirectory + "temp_csv";

          await ExpoFileSystem.copyAsync({
            from: result.uri || result.assets[0].uri,
            to: tempUri,
          });

          const fileContent = await ExpoFileSystem.readAsStringAsync(tempUri, {
            encoding: ExpoFileSystem.EncodingType.UTF8,
          });

          const rows = fileContent.split("\n");

          const websitesData = rows.map((row) => {
            const [name, url, login, password, note] = row.split(",");
            return {
              id: "_" + Math.random().toString(36).substr(2, 9),
              name,
              url,
              login,
              password,
              note,
              checked: true,
            };
          });

          if (websitesData.length > 2) {
            const startIndex = 1;
            const endIndex = websitesData.length - 1;

            const selectedPasswords = websitesData.slice(startIndex, endIndex);

            setSelectedPasswords(selectedPasswords);
          }

          toggleSelectKeyModalVisible();

          await ExpoFileSystem.deleteAsync(tempUri);
        } else {
          setLoadingStatus("error");

          setTimeout(() => {
            setLoading(false);
            setLoadingStatus("loading");
          }, 1000);
        }
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };
  const handleShowFAQ = () => {
    setShowFAQ(true);
  };

  const copyToClipboard = (textToCopy) => {
    try {
      Clipboard.setString(textToCopy);
      Haptics.selectionAsync();
    } catch (error) {
      // console.error("Error copying to clipboard:", error);
    }
  };

  const getSelectedPasswords = (passwords) => {
    setLoading(true);
    const selectedPasswordsToStore = selectedPasswords.filter((password) =>
      passwords.includes(password.id)
    );

    toggleSelectKeyModalVisible();
    store.dispatch({
      type: "IMPORT",
      payload: { importedData: selectedPasswordsToStore },
    });

    setLoading(false);
  };

  function encryptObject(obj, key) {
    const jsonString = JSON.stringify(obj);
    const cipherText = CryptoJS.AES.encrypt(jsonString, key).toString();
    return cipherText;
  }

  function decryptObject(cipherText, key) {
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    const decryptedObject = JSON.parse(decryptedText);
    return decryptedObject;
  }

  const saveDataToBlockchain = async () => {
    setLoading(true);
    setExpanded(false);
    setLoadingStatus("loading");

    const convertedData_ = convertFromViewFormat(data);
    const convertedData = getRemovedEmptyNameFields(convertedData_);
    const key = store.getState().items.masterPassword;
    const encryptedDataOldFromBlockchain_ = await getData();
    const encryptedDataOldFromBlockchain = getRemovedEmptyNameFields(
      encryptedDataOldFromBlockchain_
    );
    const salt = "salt_for_data_for_blockchain";
    const decryptedDataOldFromBlockchain = decryptStructuredData(
      encryptedDataOldFromBlockchain,
      key,
      salt
    );

    const encryptedDataNew = processEncryptedData(
      encryptedDataOldFromBlockchain,
      decryptedDataOldFromBlockchain,
      convertedData,
      key,
      salt
    );
    const uinionEncryptedNewData = getFullCurrentNewStorageState(
      encryptedDataOldFromBlockchain,
      decryptedDataOldFromBlockchain,
      convertedData,
      key,
      salt
    );

    const elementsForDeleteFromBlockchain = getElementsForDelete(
      uinionEncryptedNewData,
      encryptedDataOldFromBlockchain
    );

    let estimatedGasSizeDeleteData = -1;
    let estimatedGasSizeUpdateData = -1;

    try {
      estimatedGasSizeDeleteData = await estimateGasSizeDeleteData(
        elementsForDeleteFromBlockchain
      );
      estimatedGasSizeUpdateData = await estimateGasSize(encryptedDataNew);
    } catch (exception) {
      setErrorSaveDataModal({
        isError: true,
        errorMessage: translation.homeScreen.errorMessage.err1,
      });
      setLoadingStatus("error");
      setTimeout(() => {
        setLoading(false);
        setLoadingStatus("loading");
        setErrorSaveDataModal({
          isError: true,
          errorMessage: "",
        });
      }, 2000);
      return;
    }

    if (estimatedGasSizeDeleteData == 0 && estimatedGasSizeUpdateData == 0) {
      setErrorSaveDataModal({
        isError: true,
        errorMessage: translation.homeScreen.errorMessage.err2,
      });
      setLoadingStatus("error");
      setTimeout(() => {
        setLoading(false);
        setLoadingStatus("loading");
        setErrorSaveDataModal({
          isError: true,
          errorMessage: "",
        });
      }, 2000);
      return;
    }

    if (
      estimatedGasSizeUpdateData > store.getState().items.blockGasLimit ||
      estimatedGasSizeUpdateData > store.getState().items.transactionGasLimit
    ) {
      setLoadingStatus("error");
      setErrorSaveDataModal({
        isError: true,
        errorMessage: `${
          translation.homeScreen.errorMessage.err3
        } ${estimatedGasSizeUpdateData}/${
          store.getState().items.transactionGasLimit
        }`,
      });

      setTimeout(() => {
        setLoading(false);
        setLoadingStatus("loading");
        setErrorSaveDataModal({
          isError: true,
          errorMessage: "",
        });
      }, 5000);

      return;
    }
    if (
      estimatedGasSizeDeleteData > store.getState().items.blockGasLimit ||
      estimatedGasSizeDeleteData > store.getState().items.transactionGasLimit
    ) {
      setErrorSaveDataModal({
        isError: true,
        errorMessage: `${
          translation.homeScreen.errorMessage.err4
        } ${estimatedGasSizeDeleteData}/${
          store.getState().items.transactionGasLimit
        }`,
      });
      setLoadingStatus("error");
      setTimeout(() => {
        setLoading(false);
        setLoadingStatus("loading");
        setErrorSaveDataModal({
          isError: true,
          errorMessage: "",
        });
      }, 5000);

      return;
    }

    const pureDataSize = await getPureDataSize(encryptedDataNew);
    const payableDataSize = await getPayableDataSize(pureDataSize);
    const currentCommissionSize = await getCurrentCommissionSize();
    let myBalance = await getMyBalance();

    if (payableDataSize * currentCommissionSize > myBalance) {
      setErrorSaveDataModal({
        isError: true,
        errorMessage: `${translation.homeScreen.errorMessage.err5} ${currentCommissionSize}, ${translation.homeScreen.errorMessage.err5_1} ${myBalance}`,
      });
      setLoadingStatus("error");
      setTimeout(() => {
        setLoading(false);
        setLoadingStatus("loading");
        setErrorSaveDataModal({
          isError: true,
          errorMessage: "",
        });
      }, 2000);
      setLoading(false);
    } else {
      const currentEstimateWei = await estimateWei(encryptedDataNew);

      myBalance = await getMyBalance();

      const spendWei =
        currentEstimateWei + payableDataSize * currentCommissionSize;

      if (spendWei > myBalance) {
        setErrorSaveDataModal({
          isError: true,
          errorMessage: translation.homeScreen.errorMessage.err6,
        });
        setLoadingStatus("error");
        setTimeout(() => {
          setLoading(false);
          setLoadingStatus("loading");
          setErrorSaveDataModal({
            isError: true,
            errorMessage: "",
          });
        }, 2000);
      } else {
        if (estimatedGasSizeDeleteData != 0) {
          let ok = await deleteData(elementsForDeleteFromBlockchain);
          if (ok) {
            setLoadingStatus("success");
            setTimeout(() => {
              setLoading(false);
              setLoadingStatus("loading");
              setErrorSaveDataModal({
                isError: true,
                errorMessage: "",
              });
            }, 4000);
          } else {
            setLoadingStatus("error");
            setTimeout(() => {
              setLoading(false);
              setLoadingStatus("loading");
              setErrorSaveDataModal({
                isError: true,
                errorMessage: "",
              });
            }, 2000);
            setErrorSaveDataModal({
              isError: true,
              errorMessage: translation.homeScreen.errorMessage.err8,
            });
          }
        }

        if (estimatedGasSizeUpdateData != 0) {
          ok = await updateData(encryptedDataNew);
          if (ok) {
            setLoadingStatus("success");
            setTimeout(() => {
              setLoading(false);
              setLoadingStatus("loading");
              setErrorSaveDataModal({
                isError: true,
                errorMessage: "",
              });
            }, 6000);
          } else {
            setLoadingStatus("error");
            setTimeout(() => {
              setLoading(false);
              setLoadingStatus("loading");
              setErrorSaveDataModal({
                isError: true,
                errorMessage: "",
              });
            }, 2000);
            setErrorSaveDataModal({
              isError: true,
              errorMessage: translation.homeScreen.errorMessage.err10,
            });
          }
          setTimeout(() => {
            setLoading(false);
            setLoadingStatus("loading");
            setErrorSaveDataModal({
              isError: true,
              errorMessage: "",
            });
          }, 2000);
        }
      }
    }

    const balance = await getMyBalance();
    store.dispatch({
      type: "SET_USER_BALANCE",
      payload: {
        balance: balance,
      },
    });
    const tokens = await getUserTokenAmount();
    store.dispatch({
      type: "SET_USER_TOKENS",
      payload: {
        tokens: tokens,
      },
    });

    setLoadingStatus("success");
    setTimeout(() => {
      setLoading(false);
    }, 6000);
  };

  const renderItem = ({ item, index }) => {
    const isExpanded = expandedCategories.includes(item.category);
    const isLastItem = index === data.length - 1;

    return (
      item.items.length > 0 && (
        <View key={store.getState().items.data}>
          <TouchableOpacity
            style={[
              styles.itemCategory,
              isLastItem && styles.lastItemCategory,
              {
                backgroundColor: theme.bg.FlatList,
                borderColor: theme.borderColor,
              },
            ]}
            onPress={() => toggleCategory(item.category)}
          >
            {isExpanded === true && (
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
            {isExpanded === false && (
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
            <Ionicons
              size={25}
              name={item.categoryIcon}
              color={item.categoryIconColor}
              style={styles.itemImage}
            />
            <Text style={styles.title}>
              {language !== "ru"
                ? item.category
                : item.categoryName !== undefined
                ? item.categoryName
                : item.category}
            </Text>
          </TouchableOpacity>
          {isExpanded && (
            <FlatList
              data={item.items}
              style={[{ maxWidth: 800 }]}
              keyExtractor={(subItem, index) => `${subItem.id.toString()}`}
              renderItem={({ item: subItem, index: subIndex }) => (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => toggleSubItem(subItem.id)}
                  style={[
                    styles.subItem,
                    subIndex === item.items.length - 1 && styles.lastSubItem,
                    {
                      maxWidth: 650,
                      borderColor: theme.borderColor,
                    },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 15,
                    }}
                  >
                    {subItem.icon ? (
                      <Image
                        source={subItem.icon}
                        style={[styles.subItemImage]}
                      />
                    ) : (
                      <Ionicons
                        name="flash-outline"
                        size={20}
                        style={{ marginRight: 10 }}
                        color={theme.defaultIcon}
                      ></Ionicons>
                    )}

                    {subItem.itemName ? (
                      <Text
                        style={styles.subtitle}
                      >{`${subItem.itemName}`}</Text>
                    ) : (
                      <Text
                        style={styles.subtitle}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >{`${subItem.name}`}</Text>
                    )}
                    <View
                      style={{
                        flexDirection: "row",
                        marginLeft: "auto",
                        alignItems: "center",
                        width: 70,
                      }}
                    >
                      {menuPanels[subItem.id] && (
                        <View
                          style={{
                            flexDirection: "row",
                            marginLeft: "auto",
                            alignItems: "center",
                            width: 70,
                            backgroundColor: theme.bg.backgroundColor,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              toggleEditDataModalVisible(subItem);
                            }}
                            style={{
                              marginLeft: "auto",
                              marginRight: 40,
                              paddingHorizontal: 5,
                              backgroundColor: theme.bg.backgroundColor,
                            }}
                          >
                            <Text>
                              <Svg
                                width="17"
                                height="15"
                                viewBox="0 0 17 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <Path
                                  d="M11.8672 10.1836L12.7422 9.30859C12.8151 9.23568 12.8971 9.21745 12.9883 9.25391C13.0794 9.29036 13.125 9.36328 13.125 9.47266V13.4375C13.125 13.8021 12.9974 14.112 12.7422 14.3672C12.487 14.6224 12.1771 14.75 11.8125 14.75H2.1875C1.82292 14.75 1.51302 14.6224 1.25781 14.3672C1.0026 14.112 0.875 13.8021 0.875 13.4375V3.8125C0.875 3.44792 1.0026 3.13802 1.25781 2.88281C1.51302 2.6276 1.82292 2.5 2.1875 2.5H9.67969C9.77083 2.5 9.83464 2.54557 9.87109 2.63672C9.90755 2.72786 9.88932 2.8099 9.81641 2.88281L8.94141 3.75781C8.90495 3.79427 8.85938 3.8125 8.80469 3.8125H2.1875V13.4375H11.8125V10.3203C11.8125 10.2656 11.8307 10.2201 11.8672 10.1836ZM16.1602 4.66016L8.96875 11.8516L6.50781 12.125C6.14323 12.1615 5.83333 12.0521 5.57812 11.7969C5.32292 11.5417 5.21354 11.2318 5.25 10.8672L5.52344 8.40625L12.7148 1.21484C13.0247 0.904948 13.3984 0.75 13.8359 0.75C14.2734 0.75 14.6562 0.904948 14.9844 1.21484L16.1602 2.39062C16.4701 2.70052 16.625 3.08333 16.625 3.53906C16.625 3.97656 16.4701 4.35026 16.1602 4.66016ZM13.4531 5.50781L11.8672 3.92188L6.78125 9.00781L6.58984 10.7852L8.36719 10.5938L13.4531 5.50781ZM15.2305 3.32031L14.0547 2.14453C13.9089 2.01693 13.7721 2.01693 13.6445 2.14453L12.7969 2.99219L14.3828 4.57812L15.2305 3.73047C15.3581 3.60286 15.3581 3.46615 15.2305 3.32031Z"
                                  fill="#4E5969"
                                />
                              </Svg>
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              toggleDeleteDataModalVisible(subItem);
                            }}
                            style={{ marginLeft: "auto", marginRight: 40 }}
                          >
                            <Text>
                              <Svg
                                width="13"
                                height="15"
                                viewBox="0 0 13 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <Path
                                  d="M11.9375 2.9375C12.0651 2.9375 12.1654 2.98307 12.2383 3.07422C12.3294 3.14714 12.375 3.2474 12.375 3.375V3.8125C12.375 3.9401 12.3294 4.04948 12.2383 4.14062C12.1654 4.21354 12.0651 4.25 11.9375 4.25H11.5L10.9258 13.5195C10.9076 13.8659 10.7708 14.1576 10.5156 14.3945C10.2604 14.6315 9.95964 14.75 9.61328 14.75H2.88672C2.54036 14.75 2.23958 14.6315 1.98438 14.3945C1.72917 14.1576 1.59245 13.8659 1.57422 13.5195L1 4.25H0.5625C0.434896 4.25 0.325521 4.21354 0.234375 4.14062C0.161458 4.04948 0.125 3.9401 0.125 3.8125V3.375C0.125 3.2474 0.161458 3.14714 0.234375 3.07422C0.325521 2.98307 0.434896 2.9375 0.5625 2.9375H2.80469L3.73438 1.37891C3.98958 0.959635 4.3724 0.75 4.88281 0.75H7.61719C8.1276 0.75 8.51042 0.959635 8.76562 1.37891L9.69531 2.9375H11.9375ZM4.88281 2.0625L4.33594 2.9375H8.16406L7.61719 2.0625H4.88281ZM9.61328 13.4375L10.1875 4.25H2.3125L2.88672 13.4375H9.61328Z"
                                  fill="#E34935"
                                />
                              </Svg>
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}

                      <TouchableOpacity
                        onPress={() => {
                          toggleMenuPanel(subItem.id);
                        }}
                        style={{
                          marginLeft: "auto",
                          marginRight: 10,
                          borderLeftWidth: menuPanels[subItem.id] ? 1 : 0,
                          borderColor: "#C9CDD4",
                          paddingLeft: 5,
                          width: 30,
                          alignItems: "flex-end",
                        }}
                      >
                        <Text>
                          <Ionicons
                            name="ellipsis-vertical"
                            size={20}
                            color={theme.btnColor.ellipsis}
                          ></Ionicons>
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {expandedSubItems.includes(subItem.id) && (
                    <>
                      {item.category === "Bank cards" ? (
                        <View style={styles.cardData}>
                          <View style={styles.cardFront}>
                            {subItem.icon && (
                              <Image
                                source={subItem.icon}
                                style={[styles.subItemImage, { width: 40 }]}
                              />
                            )}
                            <Image
                              source={chips}
                              style={[
                                styles.subItemImage,
                                { width: 40, height: 35 },
                              ]}
                            />
                            <TouchableOpacity
                              onPress={() => copyToClipboard(subItem.number)}
                            >
                              <Text
                                style={{
                                  fontSize: 19,
                                  opacity: 0.6,
                                  textShadowColor: "rgba(0, 0, 0, 0.4)",
                                  textShadowOffset: { width: 1, height: 1 },
                                  textShadowRadius: 2,
                                }}
                              >
                                {subItem.number
                                  ? subItem.number
                                  : "XXXX XXXX XXXX XXXX"}
                              </Text>
                            </TouchableOpacity>
                            <Text
                              style={{
                                marginLeft: "auto",
                                marginRight: 20,
                                opacity: 0.5,
                              }}
                            >
                              {subItem.date
                                ? subItem.date.includes("/")
                                  ? subItem.date
                                  : subItem.date.length >= 5
                                  ? subItem.date.slice(0, 2) +
                                    "/" +
                                    subItem.date.slice(2, 4)
                                  : subItem.date.slice(0, 2) +
                                    "/" +
                                    subItem.date.slice(2)
                                : "XX/XX"}
                            </Text>
                            <TouchableOpacity
                              onPress={() => copyToClipboard(subItem.owner)}
                            >
                              <Text
                                style={{
                                  textTransform: "uppercase",
                                  opacity: 0.4,
                                  textShadowColor: "rgba(0, 0, 0, 0.3)",
                                  textShadowOffset: { width: 1, height: 1 },
                                  textShadowRadius: 2,
                                }}
                              >
                                {subItem.owner ? subItem.owner : "XXXXXXX XXXX"}
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <View style={styles.cardBack}>
                            <View
                              style={{
                                marginTop: 20,
                                backgroundColor: "black",
                                height: 40,
                                width: "100%",
                              }}
                            ></View>
                            <View style={{ flexDirection: "row" }}>
                              <Text
                                style={{
                                  marginBottom: 10,
                                  marginLeft: 10,
                                  opacity: 0.4,
                                }}
                              >
                                {`CVC2/CVV2:`}
                              </Text>
                              <Text
                                style={{
                                  marginBottom: 10,
                                  marginLeft: 10,
                                  marginRight: 15,
                                  textAlign: "center",
                                  opacity: 0.7,
                                }}
                              >
                                {`${subItem.cv ? subItem.cv : "***"}`}
                              </Text>
                            </View>
                          </View>
                        </View>
                      ) : (
                        <View
                          style={[
                            styles.userData,
                            { backgroundColor: theme.bg.FlatList },
                          ]}
                        >
                          <>
                            {item.category === "Websites" ? (
                              <>
                                <TouchableOpacity
                                  onPress={() => openURL(subItem.url)}
                                >
                                  <View
                                    style={{
                                      fontSize: 14,
                                      marginBottom: 10,
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flexDirection: "row",
                                      borderBottomWidth: 1,
                                      borderColor: "#a6a9ba",
                                      paddingBottom: 10,
                                    }}
                                  >
                                    <Text>
                                      {translation.homeScreen.openLink}
                                    </Text>
                                    <Ionicons
                                      size={20}
                                      name="globe-outline"
                                      style={{ marginLeft: 5 }}
                                    ></Ionicons>
                                  </View>
                                </TouchableOpacity>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    width: "100%",
                                    justifyContent: "space-between",
                                    alignItems: "",
                                    height: 30,
                                  }}
                                >
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "start",
                                      alignItems: "center",
                                      alignItems: "",
                                    }}
                                  >
                                    <Text>{translation.homeScreen.login}</Text>
                                    <Text
                                      style={{ marginLeft: 10, width: "70%" }}
                                      numberOfLines={1}
                                      ellipsizeMode="tail"
                                    >{`${subItem.login}`}</Text>
                                  </View>
                                  <TouchableOpacity
                                    onPress={() =>
                                      copyToClipboard(subItem.login)
                                    }
                                  >
                                    <Ionicons
                                      name="copy-outline"
                                      size={20}
                                      style={{ marginLeft: "auto" }}
                                    ></Ionicons>
                                  </TouchableOpacity>
                                </View>

                                <View
                                  style={{
                                    flexDirection: "row",
                                    width: "100%",
                                    justifyContent: "space-between",
                                    alignItems: "",
                                  }}
                                >
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      alignItems: "",
                                    }}
                                  >
                                    <Text>
                                      {translation.homeScreen.password}
                                    </Text>
                                    <Text style={{ marginLeft: 10 }}>
                                      {passwordVisibility[subItem.id]
                                        ? subItem.password
                                        : "******"}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "center",
                                      alignItems: "",
                                    }}
                                  >
                                    <TouchableOpacity
                                      style={{ marginLeft: "auto" }}
                                      onPress={() => {
                                        setPasswordVisibility(
                                          (prevVisibility) => ({
                                            ...prevVisibility,
                                            [subItem.id]:
                                              !prevVisibility[subItem.id],
                                          })
                                        );
                                      }}
                                    >
                                      <Ionicons
                                        name={
                                          passwordVisibility[subItem.id]
                                            ? "eye-off-outline"
                                            : "eye-outline"
                                        }
                                        size={20}
                                        color="black"
                                        style={{ marginRight: 10 }}
                                      ></Ionicons>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                      onPress={() =>
                                        copyToClipboard(subItem.password)
                                      }
                                    >
                                      <Ionicons
                                        name="copy-outline"
                                        size={20}
                                        style={{ marginLeft: "auto" }}
                                      ></Ionicons>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </>
                            ) : (
                              <>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    width: "100%",
                                    justifyContent: "space-between",
                                    alignItems: "",
                                    height: 30,
                                  }}
                                >
                                  <Text
                                    style={{ width: "80%" }}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                  >{`${translation.homeScreen.login} ${subItem.login}`}</Text>
                                  <TouchableOpacity
                                    onPress={() =>
                                      copyToClipboard(subItem.login)
                                    }
                                  >
                                    <Ionicons
                                      name="copy-outline"
                                      size={20}
                                      style={{ marginLeft: "auto" }}
                                    ></Ionicons>
                                  </TouchableOpacity>
                                </View>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    width: "100%",
                                    justifyContent: "space-between",
                                    alignItems: "",
                                  }}
                                >
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      alignItems: "",
                                    }}
                                  >
                                    <Text>
                                      {translation.homeScreen.password}
                                    </Text>
                                    <Text style={{ marginLeft: 10 }}>
                                      {passwordVisibility[subItem.id]
                                        ? subItem.password
                                        : "******"}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "center",
                                      alignItems: "",
                                    }}
                                  >
                                    <TouchableOpacity
                                      style={{ marginLeft: "auto" }}
                                      onPress={() => {
                                        setPasswordVisibility(
                                          (prevVisibility) => ({
                                            ...prevVisibility,
                                            [subItem.id]:
                                              !prevVisibility[subItem.id],
                                          })
                                        );
                                      }}
                                    >
                                      <Ionicons
                                        name={
                                          passwordVisibility[subItem.id]
                                            ? "eye-off-outline"
                                            : "eye-outline"
                                        }
                                        size={20}
                                        color="black"
                                        style={{ marginRight: 10 }}
                                      ></Ionicons>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                      onPress={() =>
                                        copyToClipboard(subItem.password)
                                      }
                                    >
                                      <Ionicons
                                        name="copy-outline"
                                        size={20}
                                        style={{ marginLeft: "auto" }}
                                      ></Ionicons>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </>
                            )}
                          </>
                        </View>
                      )}
                    </>
                  )}
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )
    );
  };

  return (
    <>
      {loading ? (
        <Modal visible={loading} transparent={false} animationType="fade">
          <Loader
            theme={theme}
            status={loadingStatus}
            message={errorSaveDataModal}
          ></Loader>
        </Modal>
      ) : (
        <TouchableWithoutFeedback
          onPress={closeComposeBtn}
          style={[
            {
              zIndex: 500,
              top: 0,
              flex: 5,
              backgroundColor: theme.bg.backgroundColor,
            },
          ]}
        >
          <View
            style={[
              styles.container,
              {
                backgroundColor: theme.bg.backgroundColor,
              },
            ]}
          >
            {data.some((category) => category.items.length > 0) ? (
              <FlatList
                data={data}
                keyExtractor={(item, index) => `${index}`}
                renderItem={renderItem}
                style={{ paddingTop: 10 }}
                overScrollMode="never"
              />
            ) : (
              <View
                style={{
                  marginTop: 300,
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <DocumentPickerBotton
                  pickDocument={pickDocument}
                  showFAQ={handleShowFAQ}
                ></DocumentPickerBotton>
              </View>
            )}

            <MenuBotton
              expanded={expanded}
              openModal={openModal}
              pickDocument={pickDocument}
              saveDataToBlockchain={saveDataToBlockchain}
              handlePress={handlePress}
              showFAQ={handleShowFAQ}
              theme={theme}
            ></MenuBotton>
          </View>
        </TouchableWithoutFeedback>
      )}
      {showFAQ === true && (
        <Modal visible={showFAQ} style={{ backgroundColor: theme.bg.mainBg }}>
          <Faq theme={theme}></Faq>
          <TouchableOpacity
            onPress={() => setShowFAQ(false)}
            style={{
              marginLeft: "auto",
              marginBottom: 0,
              marginRight: 10,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              backgroundColor: theme.bg.mainBg,
            }}
            activeOpacity={1}
          >
            <Text
              style={{ marginLeft: "auto", marginRight: 20, marginBottom: 20 }}
            >
              {translation.appNavigator.skip}
            </Text>
          </TouchableOpacity>
        </Modal>
      )}
      <Modal
        animationType="none"
        transparent={false}
        visible={addModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalHeader,
              {
                backgroundColor: theme.bg.darkColor,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
              <Svg
                width="40"
                height="16"
                viewBox="0 0 10 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginTop: 15 }}
              >
                <Path
                  d="M7.23047 6.25L11.5898 10.6094C11.707 10.7266 11.707 10.8555 11.5898 10.9961L10.7812 11.8047C10.6406 11.9219 10.5117 11.9219 10.3945 11.8047L9.65625 11.0312L6.03516 7.44531L1.67578 11.8047C1.55859 11.9219 1.42969 11.9219 1.28906 11.8047L0.480469 10.9961C0.363281 10.8555 0.363281 10.7266 0.480469 10.6094L4.83984 6.25L0.480469 1.89062C0.363281 1.77344 0.363281 1.64453 0.480469 1.50391L1.28906 0.695312C1.42969 0.578125 1.55859 0.578125 1.67578 0.695312L6.03516 5.05469L10.3945 0.695312C10.5117 0.578125 10.6406 0.578125 10.7812 0.695312L11.5898 1.50391C11.707 1.64453 11.707 1.77344 11.5898 1.89062L10.8164 2.62891L7.23047 6.25Z"
                  fill="#4E5969"
                />
              </Svg>
            </TouchableOpacity>
          </View>
          <AddForm
            onClose={closeModal}
            theme={theme}
            language={language}
            style={{ paddingHorizontal: 20 }}
          />
        </View>
      </Modal>

      {selectKeyModalVisible && (
        <Modal
          animationType="none"
          transparent={false}
          visible={selectKeyModalVisible}
          onRequestClose={toggleSelectKeyModalVisible}
          style={{ position: "relative" }}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={toggleSelectKeyModalVisible}
              style={styles.closeBtn}
            >
              <Svg
                width="40"
                height="16"
                viewBox="0 0 10 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginTop: 15 }}
              >
                <Path
                  d="M7.23047 6.25L11.5898 10.6094C11.707 10.7266 11.707 10.8555 11.5898 10.9961L10.7812 11.8047C10.6406 11.9219 10.5117 11.9219 10.3945 11.8047L9.65625 11.0312L6.03516 7.44531L1.67578 11.8047C1.55859 11.9219 1.42969 11.9219 1.28906 11.8047L0.480469 10.9961C0.363281 10.8555 0.363281 10.7266 0.480469 10.6094L4.83984 6.25L0.480469 1.89062C0.363281 1.77344 0.363281 1.64453 0.480469 1.50391L1.28906 0.695312C1.42969 0.578125 1.55859 0.578125 1.67578 0.695312L6.03516 5.05469L10.3945 0.695312C10.5117 0.578125 10.6406 0.578125 10.7812 0.695312L11.5898 1.50391C11.707 1.64453 11.707 1.77344 11.5898 1.89062L10.8164 2.62891L7.23047 6.25Z"
                  fill="#4E5969"
                />
              </Svg>
            </TouchableOpacity>
          </View>
          <SelectKeys
            importedPasswords={selectedPasswords}
            handleSelectedPasswords={getSelectedPasswords}
          ></SelectKeys>
        </Modal>
      )}
      {editDataModalVisible && (
        <Modal
          animationType="none"
          transparent={false}
          visible={editDataModalVisible}
          onRequestClose={toggleEditDataModalVisible}
          style={{ position: "relative", backgroundColor: theme.bg.darkColor }}
        >
          <View
            style={[
              styles.modalHeader,
              {
                backgroundColor: theme.bg.darkColor,
                borderColor: theme.borderColor,
                zIndex: 20000,
              },
            ]}
          >
            <Text
              style={{
                position: "absolute",
                bottom: 15,
                left: 20,
                fontSize: 20,
                color: theme.mainTitle,
                fontSize: 18,
                fontWeight: "500",
                backgroundColor: theme.bg.darkColor,
              }}
            >
              {translation.homeScreen.editData}
            </Text>
            <TouchableOpacity
              onPress={toggleEditDataModalVisible}
              style={styles.closeBtn}
            >
              <Svg
                width="40"
                height="16"
                viewBox="0 0 10 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginTop: 15, opacity: 0.7 }}
              >
                <Path
                  d="M7.23047 6.25L11.5898 10.6094C11.707 10.7266 11.707 10.8555 11.5898 10.9961L10.7812 11.8047C10.6406 11.9219 10.5117 11.9219 10.3945 11.8047L9.65625 11.0312L6.03516 7.44531L1.67578 11.8047C1.55859 11.9219 1.42969 11.9219 1.28906 11.8047L0.480469 10.9961C0.363281 10.8555 0.363281 10.7266 0.480469 10.6094L4.83984 6.25L0.480469 1.89062C0.363281 1.77344 0.363281 1.64453 0.480469 1.50391L1.28906 0.695312C1.42969 0.578125 1.55859 0.578125 1.67578 0.695312L6.03516 5.05469L10.3945 0.695312C10.5117 0.578125 10.6406 0.578125 10.7812 0.695312L11.5898 1.50391C11.707 1.64453 11.707 1.77344 11.5898 1.89062L10.8164 2.62891L7.23047 6.25Z"
                  fill="#4E5969"
                />
              </Svg>
            </TouchableOpacity>
          </View>
          <EditDataForm
            selectedData={selectedData}
            onClose={toggleEditDataModalVisible}
            theme={theme}
          ></EditDataForm>
        </Modal>
      )}
      {errorSaveDataModal.isError === true && (
        <Modal
          visible={errorModalVisible}
          animationType="fade"
          transparent={true}
        >
          <View style={styles.modalErrContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={[
                  styles.closeButtonContainer,
                  { position: "absolute", top: 4, right: 4 },
                ]}
                onPress={() => {
                  setErrorSaveDataModal({ isError: false, errorMessage: "" });
                  setErrorModalVisible(false);
                }}
              >
                <Ionicons
                  name="close-outline"
                  size={20}
                  style={{ opacity: 0.5 }}
                ></Ionicons>
              </TouchableOpacity>
              <Text style={{ textAlign: "center" }}>
                {errorSaveDataModal.errorMessage}
              </Text>
            </View>
          </View>
        </Modal>
      )}
      <Modal visible={deleteDataModal} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={[
                styles.closeButtonContainer,
                { position: "absolute", top: 4, right: 4 },
              ]}
              onPress={() => setDeleteDataModal(false)}
            >
              <Ionicons
                name="close-outline"
                size={20}
                style={{ opacity: 0.5 }}
              ></Ionicons>
            </TouchableOpacity>

            <Text style={{ opacity: 0.7 }}>
              {translation.homeScreen.deleteData}
            </Text>

            <View style={[styles.btnContainer, { width: "100%" }]}>
              <TouchableOpacity
                style={[
                  styles.closeButtonContainer,
                  {
                    width: "100%",
                    borderTopWidth: 1,
                    borderColor: "#E5E6EB",
                    marginTop: 10,
                    alignItems: "center",
                    paddingTop: 10,
                  },
                ]}
              >
                <Text
                  style={[styles.closeButton, { opacity: 0.3 }]}
                  onPress={() => {
                    store.dispatch({
                      type: "DELETE",
                      payload: {
                        id: selectedData.id,
                      },
                    });
                    setDeleteDataModal(false);
                  }}
                >
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    justifyContent: "space-around",
    width: screenWidth,
    maxWidth: 800,
    alignSelf: "center",
  },
  itemCategory: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    fontSize: "24px",
    borderWidth: 1,
    borderStyle: "solid",
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  itemImage: {
    width: 25,
    height: 25,
    marginRight: 10,
    marginLeft: 15,
  },
  subItemImage: {
    width: 25,
    height: 25,
    marginRight: 10,
    resizeMode: "contain",
  },
  subItem: {
    width: "100%",
    paddingLeft: 65,
    padding: 10,
    borderTopWidth: 1,
    borderStyle: "solid",
  },
  lastSubItem: {
    marginBottom: 10,
  },
  arrow: {
    marginTop: 0,
    marginLeft: 5,
  },
  userData: {
    justifyContent: "space-around",
    width: 270,
    opacity: 0.5,
    borderRadius: 5,
    padding: 10,
  },
  cardData: {
    position: "relative",
    marginTop: 50,
    paddingLeft: 30,
  },

  cardFront: {
    position: "absolute",
    zIndex: 5,
    left: -15,
    top: -40,
    justifyContent: "space-around",
    width: 250,
    backgroundColor: "#dae1e7",
    borderRadius: 5,
    padding: 10,
    height: 150,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      android: {
        elevation: 18,
      },
    }),
  },
  cardBack: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: 250,
    backgroundColor: "#5b818f",
    borderRadius: 5,
    height: 150,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.62,
    elevation: 10,
  },

  title: {
    fontSize: 18,
  },
  subtitle: {
    width: "70%",
    fontSize: 16,
  },
  subItemName: {
    marginLeft: 10,
    opacity: 0.5,
  },
  closeBtn: {
    width: 40,
    height: 40,
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
  addFormContainer: {
    paddingHorizontal: 20,
  },

  modalErrContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    color: "blue",
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
    marginTop: 90,
  },
});

export default HomeScreen;
