/*
  Links to the repositories from which the imported packages are taken, as well as the name of the license 
  for each package used, are given in the file "license-checker-output.json" (obtained as a result of the 
  command output: "npx license-checker --json > license-checker-output.json"), located in the project root.
  The texts of all licenses used by the imported packages are presented in the "Licenses" directory, also 
  located in the root of this project.
  If the file "LICENSE__<license_name>___<package name>" has no content, then it corresponds to the standard 
  text of the corresponding license.
*/

import Web3 from "./web3.js";
import CryptoJS from "rn-crypto-js";
import React, { useState, useEffect, useCallback } from "react";
import * as Localization from "expo-localization";
import theme from "./styles/theme.js";
import {
  updateData,
  getData,
  connectToNode,
  isUserOwnerSmartContract,
  verifyKeyPair,
  getMyBalance,
  getUserTokenAmount,
  getCurrentCommissionSize,
} from "./scripts/dataStorageSmartContractInterface";
import {
  convertStringToFormatForSmartContract,
  convertStringSmartContractFormatToSimpleString,
  convertToViewFormat,
  prettyPrint,
  decryptStructuredData,
  getRemovedEmptyNameFields,
} from "./utils/utils.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppNavigator from "./navigation/AppNavigator";

import store from "./store/store.js";
import { Provider } from "react-redux";

import Login from "./components/Login";
import Loader from "./components/Loader";
import Faq from "./components/Faq";
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Keyboard,
  Dimensions,
  StatusBar,
} from "react-native";
import ConnectWallet from "./components/ConnectWallet.js";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogBox } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

import translations from "./translation/translations.js";
import TranslationContext from "./translation/TranslationContext.js";

const screenWidth = Dimensions.get("window").width;

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const currentTheme = isDarkTheme ? theme.DarkTheme : theme.DefaultTheme;
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const [masterPassword, setMasterPassword] = useState("");
  const [localData, setLocalData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [errorLoginMessage, setErrorLoginMessage] = useState(false);
  const [walletError, setWalletError] = useState(true);
  const [loading, setLoading] = useState(false);
  const [decryptedUserData, setDecryptedUserData] = useState(null);
  const [decryptionSuccess, setDecryptionSuccess] = useState(false);
  const [firstTimeLogin, setFirstTimeLogin] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

  useEffect(() => {
    setLoading(true);
    const loadSettings = async () => {
      try {
        const settingsString = await AsyncStorage.getItem("settingsKeyKeepper");
        const currentLocale = Localization.locale;

        if (settingsString !== null) {
          const settings = JSON.parse(settingsString);
          setSelectedLanguage(settings.lang);
          setIsDarkTheme(settings.theme);
        } else {
          if (currentLocale.startsWith("ru")) {
            setSelectedLanguage("ru");
          } else {
            setSelectedLanguage("en");
          }
        }
      } catch (error) {}
    };

    loadSettings();
    setLoading(false);
  }, []);

  const toggleTheme = useCallback(async () => {
    setIsDarkTheme((prevIsDarkTheme) => !prevIsDarkTheme);
    const settings = JSON.stringify({
      lang: selectedLanguage,
      theme: !isDarkTheme,
    });
    await AsyncStorage.setItem("settingsKeyKeepper", settings);
  }, [selectedLanguage, isDarkTheme]);

  const changeLanguage = async (languageKey) => {
    setSelectedLanguage(languageKey);

    const settings = JSON.stringify({
      lang: languageKey,
      theme: isDarkTheme,
    });
    await AsyncStorage.setItem("settingsKeyKeepper", settings);
  };
  const getBalance = async () => {
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

    const comission = await getCurrentCommissionSize();
    store.dispatch({
      type: "SET_CURRENT_COMISSION",
      payload: {
        comission: comission,
      },
    });
  };

  const handleMasterPassword = async (data) => {
    Keyboard.dismiss();
    setMasterPassword(data);
    await getLocalData(data);
  };

  const handleLoading = (status) => {
    setLoading(status);
  };

  function decryptAndDecompress(encryptedData, key) {
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, key).toString(
      CryptoJS.enc.Utf8
    );
    const decompressedData = pako.inflate(decryptedData, { to: "string" });
    return decompressedData;
  }

  function decryptObject(cipherText, key) {
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    const decryptedObject = JSON.parse(decryptedText);
    return decryptedObject;
  }

  function encryptObject(obj, key) {
    const jsonString = JSON.stringify(obj);
    const cipherText = CryptoJS.AES.encrypt(jsonString, key).toString();
    return cipherText;
  }

  const getLocalData = async (key) => {
    setLoading(true);
    const flag = "evrica!";
    try {
      const userData = await AsyncStorage.getItem(`encryptedUserData0`);
      store.dispatch({
        type: "CHECK_DATA",
        payload: {
          isExisted: userData !== null,
        },
      });

      if (userData !== null && key !== null) {
        setLocalData(true);
        try {
          const decryptedUserData = decryptObject(userData, key);

          if (decryptedUserData.flag && decryptedUserData.flag === flag) {
            store.dispatch({
              type: "SET_LOCAL_DATA",
              payload: {
                privateKey: decryptedUserData.privateKey,
                userAddress: decryptedUserData.userAddress,
                contractAddress: decryptedUserData.contractAddress,
                networkName: decryptedUserData.networkName,
                nodeUrl: decryptedUserData.nodeUrl,
              },
            });

            try {
              await connectToNode();
              const walletVerification = verifyKeyPair(
                decryptedUserData.userAddress,
                decryptedUserData.privateKey
              );

              if (walletVerification === false) {
                setWalletError(false);
                throw "walletVerification = false";
              }
            } catch (error) {
              setWalletError(false);
              setShowFAQ(false);
              await AsyncStorage.removeItem(`encryptedUserData0`);
              await AsyncStorage.removeItem("walletList");
              setLocalData(false);
              store.dispatch({
                type: "CHECK_DATA",
                payload: {
                  isExisted: false,
                },
              });

              store.dispatch({
                type: "REMOVE_WALLET_LIST",
              });
              return;
            }

            setWalletError(true);
            const walletList = await AsyncStorage.getItem("walletList");
            const decryptedWalletList = decryptObject(walletList, key);

            store.dispatch({
              type: "REMOVE_WALLET_LIST",
            });

            store.dispatch({
              type: "SET_LOCAL_WALLET",
              payload: decryptedWalletList,
            });

            if (firstTimeLogin === true) {
              setShowFAQ(true);
            }

            setDecryptedUserData(decryptedUserData);
            setDecryptionSuccess(true);
            setModalVisible(false);

            await getDataFromBlockchain(key);
            const result = await isUserOwnerSmartContract();
            await getBalance();
            store.dispatch({
              type: "SET_ADMIN_STATUS",
              payload: result,
            });
            if (firstTimeLogin === true) {
              // setLoading(false);
            }
            setLoading(false);
          } else {
            setErrorLoginMessage(true);
            setModalVisible(true);
          }
        } catch (error) {
          setErrorLoginMessage(true);
          setDecryptionSuccess(false);
          setShowFAQ(false);
        }
      } else {
        setModalVisible(true);
        setFirstTimeLogin(true);
      }
    } catch (error) {
      setDecryptionSuccess(false);
    }
    setLoading(false);
  };

  const handleMasterPasswordForMultipleAccounts = async (newFileName, key) => {
    await getLocalDataForMultipleAccounts(newFileName, key);
    setMasterPassword(key);
  };

  const getLocalDataForMultipleAccounts = async (newFileName, key) => {
    const savedLocalData = {
      privateKey: store.getState().items.privateKey,
      userAddress: store.getState().items.userAddress,
      contractAddress: store.getState().items.contractAddress,
      networkName: store.getState().items.networkName,
      nodeUrl: store.getState().items.nodeUrl,
    };
    const flag = "evrica!";
    try {
      const userData = await AsyncStorage.getItem(newFileName);
      store.dispatch({
        type: "CHECK_DATA",
        payload: {
          isExisted: userData !== null,
        },
      });

      if (userData !== null && key !== null) {
        setLocalData(true);
        setMasterPassword(key);
        try {
          const decryptedUserData = decryptObject(userData, key);
          if (decryptedUserData.flag && decryptedUserData.flag === flag) {
            store.dispatch({
              type: "SET_LOCAL_DATA",
              payload: {
                privateKey: decryptedUserData.privateKey,
                userAddress: decryptedUserData.userAddress,
                contractAddress: decryptedUserData.contractAddress,
                networkName: decryptedUserData.networkName,
                nodeUrl: decryptedUserData.nodeUrl,
              },
            });

            try {
              await connectToNode();
              await getDataFromBlockchain(key);
            } catch (error) {
              await AsyncStorage.removeItem(newFileName);

              store.dispatch({
                type: "SET_LOCAL_DATA",
                payload: { ...savedLocalData },
              });

              store.dispatch({
                type: "SET_WALLET_STATUS",
                payload: false,
              });

              return false;
            }

            const walletList = await AsyncStorage.getItem("walletList");
            const decryptedWalletList = decryptObject(walletList, key);

            store.dispatch({
              type: "REMOVE_WALLET_LIST",
            });

            store.dispatch({
              type: "SET_LOCAL_WALLET",
              payload: decryptedWalletList,
            });

            const result = await isUserOwnerSmartContract();
            await getBalance();
            await getUserTokenAmount();
            await getCurrentCommissionSize();

            store.dispatch({
              type: "SET_ADMIN_STATUS",
              payload: result,
            });

            return true;
          } else {
          }
        } catch (error) {
          setShowFAQ(false);
        }
      } else {
      }
    } catch (error) {}
  };

  const getDataFromBlockchain = async (key) => {
    const data = [
      {
        category: "Social Media",
        categoryName: "Социальные медиа",
        categoryIcon: "chatbubbles-outline",
        categoryIconColor: "#000000",
        items: [],
      },
      {
        category: "Applications",
        categoryName: "Приложения",
        categoryIcon: "rocket-outline",
        categoryIconColor: "#000000",
        items: [],
      },
      {
        category: "Websites",
        categoryName: "Сайты",
        categoryIcon: "globe-outline",
        categoryIconColor: "#000000",
        items: [],
      },
      {
        category: "Bank cards",
        categoryName: "Банковские карты",
        categoryIcon: "cash-outline",
        categoryIconColor: "#000000",
        items: [],
      },
    ];

    let structuredData_;
    try {
      structuredData_ = await getData();
    } catch (error) {
      setWalletError(true);
    }
    const structuredData = getRemovedEmptyNameFields(structuredData_);
    const salt = "salt_for_data_for_blockchain";
    const jsonStructuredObject = decryptStructuredData(
      structuredData,
      key,
      salt
    );

    const jsonObjectView = convertToViewFormat(jsonStructuredObject);
    jsonObjectView.forEach((item) => {
      const existingCategoryIndex = data.findIndex(
        (category) => category.category === item.category
      );
      if (existingCategoryIndex !== -1) {
        data[existingCategoryIndex].items = item.items;
      } else {
        data.push({
          category: item.category,
          categoryName: item.categoryName,
          categoryIcon: item.categoryIcon,
          categoryIconColor: item.categoryIconColor,
          items: item.items,
        });
      }
    });

    store.dispatch({
      type: "DOWNLOAD_DATA_FROM_BLOCKCHAIN",
      payload: {
        blockchainData: data,
      },
    });
  };

  function generateUUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }

  async function getAllUserAccounts() {
    if (localData === true) {
      const userAccountsData = [];
      const key = store.getState().items.masterPassword;
      const listAccountsNames = store.getState().items.walletList;
      for (let i = 0; i < listAccountsNames.length; i++) {
        const currentAccountName = listAccountsNames[i].networkName;
        const currentAccountFileName = listAccountsNames[i].fileName;
        try {
          const userData = await AsyncStorage.getItem(currentAccountFileName);

          if (userData !== null) {
            try {
              const decryptedUserData = decryptObject(userData, key);
              decryptedUserData.title = currentAccountName;
              decryptedUserData.key = generateUUID();
              userAccountsData.push(decryptedUserData);
            } catch (error) {
              setDecryptionSuccess(false);
              setShowFAQ(false);
            }
          }
        } catch (error) {
          return;
        }
      }
      handleLoading(false);
      return userAccountsData;
    }
  }

  const changeCurrentWallet = async (newFileName, key) => {
    const flag = "evrica!";
    try {
      const userData = await AsyncStorage.getItem(newFileName);
      if (userData !== null) {
        try {
          const decryptedUserData = decryptObject(userData, key);
          if (decryptedUserData.flag && decryptedUserData.flag === flag) {
            store.dispatch({
              type: "SET_LOCAL_DATA",
              payload: {
                privateKey: decryptedUserData.privateKey,
                userAddress: decryptedUserData.userAddress,
                contractAddress: decryptedUserData.contractAddress,
                networkName: decryptedUserData.networkName,
                nodeUrl: decryptedUserData.nodeUrl,
              },
            });
            await connectToNode();
            await getDataFromBlockchain(key);
            const result = await isUserOwnerSmartContract();
            store.dispatch({
              type: "SET_ADMIN_STATUS",
              payload: result,
            });
            await getBalance();
            await getUserTokenAmount();
            await getCurrentCommissionSize();
          } else {
          }
        } catch (error) {}
      } else {
      }
    } catch (error) {}
  };

  const resetAllKeys = () => {
    setDecryptionSuccess(false);
    setLocalData(false);
    setMasterPassword("");
  };
  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: currentTheme.bg.mainBg }}
    >
      <TranslationContext.Provider value={translations[selectedLanguage]}>
        <Provider store={store}>
          {screenWidth < 750 && <StatusBar backgroundColor="#969393" />}

          {showFAQ === true && (
            <Modal visible={showFAQ}>
              <Faq theme={currentTheme}></Faq>
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
                  backgroundColor: currentTheme.bg.mainBg,
                }}
                activeOpacity={1}
              >
                <Text
                  style={{
                    marginLeft: "auto",
                    marginRight: 20,
                    marginBottom: 20,
                  }}
                >
                  {translations[selectedLanguage].appNavigator.skip}
                </Text>
                {/* <Ionicons
                name="close-outline"
                size={30}
                style={{  opacity: 0.5 }}
              ></Ionicons> */}
              </TouchableOpacity>
            </Modal>
          )}
          {loading === true && (
            <Modal visible={loading} transparent={false}>
              <Loader theme={currentTheme} status={"loading"}></Loader>
            </Modal>
          )}
          {localData ? (
            masterPassword && loading === false ? (
              decryptionSuccess ? (
                <AppNavigator
                  onDecryptData={getLocalDataForMultipleAccounts}
                  handleMasterPassword={handleMasterPasswordForMultipleAccounts}
                  getAllAccounts={getAllUserAccounts}
                  changeWallet={changeCurrentWallet}
                  onLoading={handleLoading}
                  walletError={walletError}
                  onPressTheme={toggleTheme}
                  theme={currentTheme}
                  isDarkTheme={isDarkTheme}
                  onChangeLanguage={changeLanguage}
                  language={selectedLanguage}
                />
              ) : !loading ? (
                <Login
                  error={errorLoginMessage}
                  onDataReceived={handleMasterPassword}
                  onResetKey={resetAllKeys}
                  onPressTheme={toggleTheme}
                  theme={currentTheme}
                  isDarkTheme={isDarkTheme}
                  onChangeLanguage={changeLanguage}
                  language={selectedLanguage}
                />
              ) : (
                <></>
              )
            ) : !loading ? (
              <Login
                error={errorLoginMessage}
                onDataReceived={handleMasterPassword}
                onResetKey={resetAllKeys}
                onPressTheme={toggleTheme}
                theme={currentTheme}
                isDarkTheme={isDarkTheme}
                onChangeLanguage={changeLanguage}
                language={selectedLanguage}
              />
            ) : (
              <></>
            )
          ) : masterPassword && modalVisible ? (
            <Modal visible={modalVisible}>
              <View
                style={[
                  {
                    backgroundColor: currentTheme.bg.darkColor,
                    paddingTop: 10,
                  },
                ]}
              >
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons
                    name="arrow-back-outline"
                    size={30}
                    style={{
                      marginRight: "auto",
                      opacity: 0.5,
                      marginLeft: 10,
                    }}
                  ></Ionicons>
                </TouchableOpacity>
              </View>
              <ConnectWallet
                onDecryptData={getLocalData}
                onDecryptDataAndDecompress={decryptAndDecompress}
                masterPassword={masterPassword}
                onLoading={handleLoading}
                getAllAccounts={getAllUserAccounts}
                walletError={walletError}
                theme={currentTheme}
                language={selectedLanguage}
              />
            </Modal>
          ) : !loading ? (
            <Login
              error={errorLoginMessage}
              onDataReceived={handleMasterPassword}
              onResetKey={resetAllKeys}
              onPressTheme={toggleTheme}
              theme={currentTheme}
              isDarkTheme={isDarkTheme}
              onChangeLanguage={changeLanguage}
              language={selectedLanguage}
            />
          ) : (
            <></>
          )}
        </Provider>
      </TranslationContext.Provider>
    </GestureHandlerRootView>
  );
}
