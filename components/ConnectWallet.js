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
import CryptoJS from "react-native-crypto-js";
import store from "../store/store.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { verifyKeyPair } from "../scripts/dataStorageSmartContractInterface";
import TranslationContext from "../translation/TranslationContext";
import * as Haptics from "expo-haptics";
import Svg, { Path } from "react-native-svg";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Modal,
  Image,
  Dimensions,
} from "react-native";

import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Loader from "./Loader";

const screenWidth = Dimensions.get("window").width;
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard";

const ConnectWallet = ({
  masterPassword,
  onDecryptData,
  getAllAccounts,
  changeWallet,
  onLoading,
  walletError,
  onCloseModal,
  handleMasterPassword,
  theme,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("loading");
  const translation = useContext(TranslationContext);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [modalValidation, setModalValidation] = useState({});
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [addNewWalletForm, setAddNewWalletForm] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [userAddress, setUserAddress] = useState(
    store.getState().items.userAddress
  );

  const [privateKey, setPrivateKey] = useState(
    store.getState().items.privateKey
  );

  const savedNetworkName = useSelector((state) => state.items.networkName);
  const walletList = useSelector((state) => state.items.walletList);
  const [walletErrorStatus, setWalletErrorStatus] = useState(walletError);

  const [newWalletStatus, setNewWalletStatus] = useState(true);
  const [networkName, setNetworkName] = useState("");
  const [nodeUrl, setNodeUrl] = useState("");
  const [newUserAddress, setNewUserAddress] = useState("");
  const [newPrivateKey, setNewPrivateKey] = useState("");

  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes, setRoutes] = React.useState([]);

  useEffect(() => {
    store.dispatch({
      type: "SET_CURRENT_WALLET_INDEX",
      payload: index,
    });
    setNewWalletStatus(true);
  }, [index]);

  useEffect(() => {
    setAddNewWalletForm(false);
    if (store.getState().items.allUserRoutes.length == 0) {
      setLoading(true);
      downloadWalletsData();
      setIndex(0);
      setLoading(false);
    } else {
      setLoading(true);
      setRoutes(store.getState().items.allUserRoutes);
      setIndex(0);
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  }, []);

  const downloadWalletsData = async () => {
    if (newWalletStatus === true) {
      setRoutes([]);
      let allAccounts;
      try {
        allAccounts = await getAllAccounts();
      } catch (error) {}
      const newRoutes = [...routes];
      for (let i = 0; i < allAccounts.length; i++) {
        newRoutes.push(allAccounts[i]);
      }
      setRoutes(newRoutes);
      newRoutes.forEach((item) => {});
      store.dispatch({
        type: "SET_ALL_WALLET",
        payload: newRoutes,
      });
    }
  };

  useEffect(() => {
    downloadWalletsData();
  }, [walletList]);

  function getPureDataSize(data) {
    return data.length;
  }

  function getCompressedDataSize(data) {
    const compressedData = pako.deflate(data, { to: "string" });
    return compressedData.length;
  }

  function encryptObject(obj, key) {
    const jsonString = JSON.stringify(obj);
    const cipherText = CryptoJS.AES.encrypt(jsonString, key).toString();
    return cipherText;
  }

  const saveWalletData = async () => {
    const newFileName = `encryptedUserData0`;
    let isValid = true;

    if (networkName.trim() === "" || networkName.length < 3) {
      setModalValidation((prevState) => ({
        ...prevState,
        networkName: "Заполните поле",
      }));
      isValid = false;
    }
    if (nodeUrl.trim() === "") {
      setModalValidation((prevState) => ({
        ...prevState,
        nodeUrl: "Заполните поле",
      }));
      isValid = false;
    }
    if (contractAddress.trim() === "") {
      setModalValidation((prevState) => ({
        ...prevState,
        contractAddress: "Заполните поле",
      }));
      isValid = false;
    }
    if (newUserAddress.trim() === "") {
      setModalValidation((prevState) => ({
        ...prevState,
        newUserAddress: "Заполните поле",
      }));
      isValid = false;
    }
    if (newPrivateKey.trim() === "") {
      setModalValidation((prevState) => ({
        ...prevState,
        newPrivateKey: "Заполните поле",
      }));
      isValid = false;
    }

    if (isValid === true) {
      const userData = {
        userAddress: newUserAddress,
        privateKey: newPrivateKey,
        contractAddress: contractAddress,
        networkName: networkName,
        nodeUrl: nodeUrl,
        flag: "evrica!",
      };

      let encryptedUserData = encryptObject(userData, masterPassword);
      await AsyncStorage.setItem(newFileName, encryptedUserData);

      store.dispatch({
        type: "ADD_NEW_WALLET",
        payload: { networkName: networkName, fileName: newFileName },
      });

      let encryptedWallet = encryptObject(
        store.getState().items.walletList,
        masterPassword
      );

      await AsyncStorage.setItem("walletList", encryptedWallet);
      try {
        await onDecryptData(masterPassword);
      } catch (error) {}
    }
  };

  const addNewWalletData = async () => {
    setLoading(true);
    const newFileName = `encryptedUserData${
      store.getState().items.walletList.length
    }`;

    let isValid = true;

    if (networkName.trim() === "" || networkName.length < 3) {
      setModalValidation((prevState) => ({
        ...prevState,
        networkName: "Заполните поле",
      }));
      isValid = false;
    }
    if (nodeUrl.trim() === "") {
      setModalValidation((prevState) => ({
        ...prevState,
        nodeUrl: "Заполните поле",
      }));
      isValid = false;
    }
    if (contractAddress.trim() === "") {
      setModalValidation((prevState) => ({
        ...prevState,
        contractAddress: "Заполните поле",
      }));
      isValid = false;
    }
    if (newUserAddress.trim() === "") {
      setModalValidation((prevState) => ({
        ...prevState,
        newUserAddress: "Заполните поле",
      }));
      isValid = false;
    }
    if (newPrivateKey.trim() === "") {
      setModalValidation((prevState) => ({
        ...prevState,
        newPrivateKey: "Заполните поле",
      }));
      isValid = false;
    }

    if (isValid === true) {
      const userData = {
        userAddress: newUserAddress,
        privateKey: newPrivateKey,
        contractAddress: contractAddress,
        networkName: networkName,
        nodeUrl: nodeUrl,
        flag: "evrica!",
      };

      const walletVerification = verifyKeyPair(newUserAddress, newPrivateKey);

      if (walletVerification === false) {
        setModalValidation((prevState) => ({
          ...prevState,
          newUserAddress: "Заполните поле",
        }));

        setModalValidation((prevState) => ({
          ...prevState,
          newPrivateKey: "Заполните поле",
        }));

        return;
      }

      let encryptedUserData;
      if (masterPassword !== undefined) {
        encryptedUserData = encryptObject(userData, masterPassword);
      } else {
        encryptedUserData = encryptObject(
          userData,
          store.getState().items.masterPassword
        );
      }

      await AsyncStorage.setItem(newFileName, encryptedUserData);

      store.dispatch({
        type: "ADD_NEW_WALLET",
        payload: { networkName: networkName, fileName: newFileName },
      });

      let encryptedWallet;

      if (masterPassword !== undefined) {
        encryptedWallet = encryptObject(
          store.getState().items.walletList,
          masterPassword
        );
      } else {
        encryptedWallet = encryptObject(
          store.getState().items.walletList,
          store.getState().items.masterPassword
        );
      }

      await AsyncStorage.setItem("walletList", encryptedWallet);

      if (masterPassword !== undefined) {
        try {
          setLoading(true);
          const res = await onDecryptData(newFileName, masterPassword);

          setNewWalletStatus(res);
          if (res === true) {
            setAddNewWalletForm(false);
            onCloseModal();
          } else {
            setModalValidation((prevState) => ({
              ...prevState,
              newUserAddress: "Заполните поле",
            }));
          }

          setLoading(false);
        } catch (error) {
          return;
        }
      } else {
        try {
          setLoading(true);
          handleMasterPassword(
            newFileName,
            store.getState().items.masterPassword
          );
          const res = await onDecryptData(
            newFileName,
            store.getState().items.masterPassword
          );

          setNewWalletStatus(res);
          if (res === true) {
            setAddNewWalletForm(false);
            onCloseModal();
          }
          setLoading(false);
        } catch (error) {
          return;
        }
      }
    }
  };

  const addNewRoute = async () => {
    setLoading(true);
    await addNewWalletData();
    setLoading(false);
  };

  const copyToClipboard = (textToCopy) => {
    try {
      Clipboard.setString(textToCopy);
      Haptics.selectionAsync();
    } catch (error) {
      // console.error("Error copying to clipboard:", error);
    }
  };

  const changeCurrentWallet = async () => {
    setLoading(true);
    await changeWallet(
      store.getState().items.walletList[index].fileName,
      store.getState().items.masterPassword
    );
    setAddNewWalletForm(false);
    setLoading(false);
  };

  const FirstRoute = ({ route }) => (
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
        <View key={route.key} style={styles.container}>
          <>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                opacity: 0.3,
                marginBottom: 0,
                marginRight: "auto",
              }}
            >
              URL:
            </Text>
            <TouchableOpacity
              onPress={() => copyToClipboard(route.nodeUrl)}
              style={{
                marginRight: "auto",
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  borderBottomWidth: 1,
                  borderColor: "#E5E6EB",
                  opacity: 0.6,
                  marginBottom: 70,
                  marginRight: "auto",
                }}
              >
                {route.nodeUrl}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                justifyContent: "start",
                width: "100%",
                maxWidth: 500,
                position: "relative",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: -10,
                  left: 5,
                  backgroundColor: theme.bg.mainBg,
                  zIndex: 99,
                  paddingHorizontal: 5,
                }}
              >
                <Text style={styles.inputTitle}>
                  {translation.connectWallet.contractAddress}
                </Text>
              </View>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.innerText,
                  {
                    borderColor: theme.borderColor,
                    color: theme.mainTitle,
                  },
                ]}
              >
                {route.contractAddress}
              </Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(route.contractAddress)}
                style={styles.copyBtn3}
              >
                <Ionicons
                  name="copy-outline"
                  size={20}
                  style={{ marginLeft: "auto", opacity: 0.5 }}
                ></Ionicons>
              </TouchableOpacity>

              <View
                style={{
                  position: "absolute",
                  top: 58,
                  left: 5,
                  backgroundColor: theme.bg.mainBg,
                  zIndex: 99,
                  paddingHorizontal: 5,
                }}
              >
                <Text style={styles.inputTitle}>
                  {translation.connectWallet.userAddress}
                </Text>
              </View>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.innerText,
                  {
                    borderColor: theme.borderColor,
                    color: theme.mainTitle,
                  },
                ]}
              >
                {route.userAddress}
              </Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(route.userAddress)}
                style={styles.copyBtn1}
              >
                <Ionicons
                  name="copy-outline"
                  size={20}
                  style={{ marginLeft: "auto", opacity: 0.5 }}
                ></Ionicons>
              </TouchableOpacity>
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
                  {translation.connectWallet.privateKey}
                </Text>
              </View>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.innerText,
                  {
                    borderColor: theme.borderColor,
                    color: theme.mainTitle,
                  },
                ]}
              >
                {route.privateKey}
              </Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(route.privateKey)}
                style={styles.copyBtn2}
              >
                <Ionicons
                  name="copy-outline"
                  size={20}
                  style={{ marginLeft: "auto", opacity: 0.5 }}
                ></Ionicons>
              </TouchableOpacity>
            </View>
          </>
        </View>
      </ScrollView>
      {route.networkName !== savedNetworkName && (
        <TouchableOpacity
          style={[
            styles.changeWallet,
            { backgroundColor: theme.btnColor.primary },
          ]}
          onPress={() => changeCurrentWallet()}
        >
          <Text style={{ color: "white" }}>
            {translation.connectWallet.switchBtn}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );

  const renderScene = ({ route }) => {
    switch (route.key) {
      default:
        return <FirstRoute route={route} />;
    }
  };

  const openAddNewWalletForm = () => {
    setAddNewWalletForm(true);
  };

  return (
    <>
      {store.getState().items.hasEncryptedPublicPrivetKeysLocalData ? (
        <>
          {walletList.length < 3 && (
            <TouchableOpacity
              style={{ position: "absolute", top: 12, right: 20 }}
              onPress={openAddNewWalletForm}
            >
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="black"
                width="22"
                height="22"
                style={{ opacity: 0.7 }}
              >
                <Path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 0 1 0 2h-6v6a1 1 0 0 1-2 0v-6H5a1 1 0 0 1 0-2h6V5a1 1 0 0 1 1-1z" />
              </Svg>
            </TouchableOpacity>
          )}
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={(props) => (
              <View style={{ shadowColor: "red" }}>
                <TabBar
                  {...props}
                  indicatorStyle={{ backgroundColor: theme.borderColor }}
                  style={{
                    backgroundColor: theme.bg.backgroundColor,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 7,
                    },
                    shadowOpacity: 0.41,
                    shadowRadius: 9.11,

                    elevation: 8,
                  }}
                  renderLabel={({ route, focused }) => (
                    <Text
                      style={{ color: focused ? "#425C89" : "grey" }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {route.title}
                    </Text>
                  )}
                  pressColor="66, 92, 137, 0.1"
                />
              </View>
            )}
          />
        </>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={false}
            contentContainerStyle={styles.scrollViewContainer}
            scrollEnabled={scrollEnabled}
            style={{ backgroundColor: theme.bg.mainBg }}
          >
            <View
              style={[
                styles.container,
                { paddingTop: 30, backgroundColor: theme.bg.mainBg },
              ]}
            >
              <>
                <View
                  style={{
                    justifyContent: "start",
                    width: "100%",
                    maxWidth: 500,
                    position: "relative",
                    marginBottom: 50,
                  }}
                >
                  <TextInput
                    placeholder={translation.connectWallet.networkName}
                    value={networkName}
                    style={[
                      styles.textInput,
                      {
                        borderColor:
                          modalValidation.networkName ||
                          walletErrorStatus === false
                            ? "red"
                            : theme.borderColor,
                        backgroundColor: theme.bg.backgroundColor,
                        maxWidth: screenWidth,
                      },
                    ]}
                    editable={true}
                    onChangeText={(text) => {
                      setNetworkName(text);
                      const newDataValidation = { ...modalValidation };
                      delete newDataValidation.networkName;
                      setModalValidation(newDataValidation);
                    }}
                    minLength={3}
                    maxLength={15}
                    onFocus={() => {
                      if (typeof document !== "undefined") {
                        let inputs = document.getElementsByTagName("input");
                        for (let i = 0; i < inputs.length; i++) {
                          inputs[i].style.outline = "none";
                        }
                      }
                    }}
                  />

                  <TextInput
                    placeholder="URL"
                    value={nodeUrl}
                    style={[
                      styles.textInput,
                      {
                        borderColor:
                          modalValidation.nodeUrl || walletErrorStatus === false
                            ? "red"
                            : theme.borderColor,
                        backgroundColor: theme.bg.backgroundColor,
                        maxWidth: screenWidth,
                      },
                    ]}
                    editable={true}
                    onChangeText={(text) => {
                      setNodeUrl(text);
                      const newDataValidation = { ...modalValidation };
                      delete newDataValidation.nodeUrl;
                      setModalValidation(newDataValidation);
                    }}
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

                <View
                  style={{
                    justifyContent: "start",
                    width: "100%",
                    maxWidth: 500,
                    position: "relative",
                  }}
                >
                  <View
                    style={{
                      position: "absolute",
                      top: -10,
                      left: 5,
                      backgroundColor: theme.bg.mainBg,
                      zIndex: 99,
                      paddingHorizontal: 5,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.inputTitle}>
                      {translation.connectWallet.contractAddress}
                    </Text>
                    <TouchableOpacity
                      style={styles.infoBtn}
                      onPress={() => setInfoModalVisible(true)}
                    >
                      <Image
                        source={require("../assets/faq.png")}
                        style={{ width: 20, height: 20, marginLeft: "auto" }}
                      ></Image>
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    placeholder=""
                    value={contractAddress}
                    style={[
                      styles.textInput,
                      {
                        borderColor:
                          modalValidation.contractAddress ||
                          walletErrorStatus === false
                            ? "red"
                            : theme.borderColor,
                        backgroundColor: theme.bg.mainBg,
                        maxWidth: screenWidth,
                      },
                    ]}
                    editable={true}
                    onChangeText={(text) => {
                      setContractAddress(text);
                      const newDataValidation = { ...modalValidation };
                      delete newDataValidation.contractAddress;
                      setModalValidation(newDataValidation);
                    }}
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
                    onPress={() => copyToClipboard(contractAddress)}
                    style={styles.copyBtn3}
                  >
                    <Ionicons
                      name="copy-outline"
                      size={20}
                      style={{ marginLeft: "auto", opacity: 0.5 }}
                    ></Ionicons>
                  </TouchableOpacity>

                  <View
                    style={{
                      position: "absolute",
                      top: 58,
                      left: 5,
                      backgroundColor: theme.bg.mainBg,
                      zIndex: 99,
                      paddingHorizontal: 5,
                    }}
                  >
                    <Text style={styles.inputTitle}>
                      {translation.connectWallet.userAddress}
                    </Text>
                  </View>
                  <TextInput
                    placeholder=""
                    value={newUserAddress}
                    onChangeText={(text) => {
                      setNewUserAddress(text);
                      const newDataValidation = { ...modalValidation };
                      delete newDataValidation.newUserAddress;
                      setModalValidation(newDataValidation);
                    }}
                    style={[
                      styles.textInput,
                      {
                        borderColor:
                          modalValidation.newUserAddress ||
                          walletErrorStatus === false
                            ? "red"
                            : theme.borderColor,
                        backgroundColor: theme.bg.mainBg,
                        maxWidth: screenWidth,
                      },
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
                    onPress={() => copyToClipboard(newUserAddress)}
                    style={styles.copyBtn1}
                  >
                    <Ionicons
                      name="copy-outline"
                      size={20}
                      style={{ marginLeft: "auto", opacity: 0.5 }}
                    ></Ionicons>
                  </TouchableOpacity>
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
                      {translation.connectWallet.privateKey}
                    </Text>
                  </View>
                  <TextInput
                    placeholder=""
                    value={newPrivateKey}
                    onChangeText={(text) => {
                      setNewPrivateKey(text);
                      const newDataValidation = { ...modalValidation };
                      delete newDataValidation.newPrivateKey;
                      setModalValidation(newDataValidation);
                    }}
                    style={[
                      styles.textInput,
                      {
                        borderColor:
                          modalValidation.newPrivateKey ||
                          walletErrorStatus === false
                            ? "red"
                            : theme.borderColor,
                        backgroundColor: theme.bg.mainBg,
                        maxWidth: screenWidth,
                      },
                    ]}
                    onFocus={() => {
                      if (typeof document !== "undefined") {
                        let inputs = document.getElementsByTagName("input");
                        for (let i = 0; i < inputs.length; i++) {
                          inputs[i].style.outline = "none";
                        }
                      }
                    }}
                  ></TextInput>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(newPrivateKey)}
                    style={styles.copyBtn2}
                  >
                    <Ionicons
                      name="copy-outline"
                      size={20}
                      style={{ marginLeft: "auto", opacity: 0.5 }}
                    ></Ionicons>
                  </TouchableOpacity>
                </View>
                <View style={styles.btnContainer}>
                  <TouchableOpacity
                    style={[
                      styles.connectBtn,
                      { backgroundColor: theme.btnColor.primary },
                    ]}
                    onPress={() => saveWalletData()}
                  >
                    <Text style={{ color: theme.textColor.subtitle }}>
                      {translation.connectWallet.mainBtn}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            </View>
          </ScrollView>
        </>
      )}
      <Modal visible={infoModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={[
                styles.closeButtonContainer,
                { position: "absolute", top: 4, right: 4 },
              ]}
              onPress={() => setInfoModalVisible(false)}
            >
              <Ionicons
                name="close-outline"
                size={20}
                style={{ opacity: 0.5 }}
              ></Ionicons>
            </TouchableOpacity>

            <Text style={{ opacity: 0.7 }}>
              {translation.connectWallet.infoModalTitle}
            </Text>
            <TouchableOpacity
              onPress={() =>
                copyToClipboard("0xe270225cde0d82c0a111ab82aefcda6a8ab16994")
              }
            >
              <Text
                style={{
                  width: 200,
                  flexWrap: "wrap",
                  flexDirection: "row",
                  opacity: 0.3,
                  marginTop: 10,
                }}
              >
                0xe270225cde0d82c0a111ab82aefcda6a8ab16994
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={addNewWalletForm}
        animationType="none"
        transparent={false}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <View
          style={[
            styles.modalContent,
            {
              flex: 1,
              width: "100%",
              backgroundColor: theme.bg.backgroundColor,
              borderRadius: 0,
              padding: 0,
              borderBottomWidth: 1,
              borderColor: theme.borderColor,
              paddingHorizontal: 0,
            },
          ]}
        >
          <Text
            style={{
              width: "100%",
              height: 50,
              paddingBottom: 10,
              paddingTop: 15,
              fontSize: 18,
              fontWeight: "500",
              color: theme.mainTitle,
              backgroundColor: theme.bg.darkColor,
              paddingHorizontal: 20,
            }}
          >
            {translation.connectWallet.addNewWalletForm}
          </Text>
          <TouchableOpacity
            style={[
              styles.closeButtonContainer,
              { position: "absolute", top: 4, right: 15 },
            ]}
            onPress={() => {
              setAddNewWalletForm(false);
              setNewWalletStatus(true);
            }}
          >
            <Svg
              width="40"
              height="16"
              viewBox="0 0 10 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginTop: 18, opacity: 0.7 }}
            >
              <Path
                d="M7.23047 6.25L11.5898 10.6094C11.707 10.7266 11.707 10.8555 11.5898 10.9961L10.7812 11.8047C10.6406 11.9219 10.5117 11.9219 10.3945 11.8047L9.65625 11.0312L6.03516 7.44531L1.67578 11.8047C1.55859 11.9219 1.42969 11.9219 1.28906 11.8047L0.480469 10.9961C0.363281 10.8555 0.363281 10.7266 0.480469 10.6094L4.83984 6.25L0.480469 1.89062C0.363281 1.77344 0.363281 1.64453 0.480469 1.50391L1.28906 0.695312C1.42969 0.578125 1.55859 0.578125 1.67578 0.695312L6.03516 5.05469L10.3945 0.695312C10.5117 0.578125 10.6406 0.578125 10.7812 0.695312L11.5898 1.50391C11.707 1.64453 11.707 1.77344 11.5898 1.89062L10.8164 2.62891L7.23047 6.25Z"
                fill="#4D5969"
              />
            </Svg>
          </TouchableOpacity>

          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              alwaysBounceVertical={false}
              contentContainerStyle={styles.scrollViewContainer}
              scrollEnabled={scrollEnabled}
              style={{ backgroundColor: theme.bg.backgroundColor }}
              endFillColor="#000"
              overScrollMode="never"
            >
              <View
                style={[
                  styles.container,
                  {
                    paddingTop: 30,
                    paddingHorizontal: 20,
                    width: screenWidth,
                    maxWidth: 800,
                    zIndex: 40000000,
                  },
                ]}
              >
                <>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "start",
                      width: "100%",
                      maxWidth: 500,
                      position: "relative",
                    }}
                  >
                    <TextInput
                      placeholder={translation.connectWallet.networkName}
                      autoCorrect={false}
                      value={networkName}
                      style={[
                        styles.textInput,
                        {
                          borderColor:
                            modalValidation.networkName ||
                            newWalletStatus === false
                              ? "red"
                              : theme.borderColor,
                          backgroundColor: theme.bg.mainBg,
                        },
                      ]}
                      editable={true}
                      onChangeText={(text) => {
                        setNetworkName(text);
                        const newDataValidation = { ...modalValidation };
                        delete newDataValidation.networkName;
                        setModalValidation(newDataValidation);
                        setNewWalletStatus(true);
                      }}
                      minLength={3}
                      maxLength={15}
                      onFocus={() => {
                        if (typeof document !== "undefined") {
                          let inputs = document.getElementsByTagName("input");
                          for (let i = 0; i < inputs.length; i++) {
                            inputs[i].style.outline = "none";
                          }
                        }
                      }}
                    />

                    <TextInput
                      placeholder="URL"
                      value={nodeUrl}
                      style={[
                        styles.textInput,
                        {
                          borderColor:
                            modalValidation.nodeUrl || newWalletStatus === false
                              ? "red"
                              : theme.borderColor,
                          backgroundColor: theme.bg.mainBg,
                        },
                      ]}
                      editable={true}
                      onChangeText={(text) => {
                        setNodeUrl(text);
                        const newDataValidation = { ...modalValidation };
                        delete newDataValidation.nodeUrl;
                        setModalValidation(newDataValidation);
                        setNewWalletStatus(true);
                      }}
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

                  <View
                    style={{
                      justifyContent: "start",
                      width: "100%",
                      maxWidth: 500,
                      position: "relative",
                    }}
                  >
                    <View
                      style={{
                        position: "absolute",
                        top: -10,
                        left: 5,
                        backgroundColor: theme.bg.backgroundColor,
                        zIndex: 99,
                        paddingHorizontal: 5,
                      }}
                    >
                      <Text
                        style={[
                          styles.inputTitle,
                          { backgroundColor: theme.bg.backgroundColor },
                        ]}
                      >
                        {translation.connectWallet.contractAddress}
                      </Text>
                    </View>
                    <TextInput
                      placeholder=""
                      value={contractAddress}
                      style={[
                        styles.textInput,
                        {
                          borderColor:
                            modalValidation.contractAddress ||
                            newWalletStatus === false
                              ? "red"
                              : theme.borderColor,
                        },
                      ]}
                      editable={true}
                      onChangeText={(text) => {
                        setContractAddress(text);
                        const newDataValidation = { ...modalValidation };
                        delete newDataValidation.contractAddress;
                        setModalValidation(newDataValidation);
                        setNewWalletStatus(true);
                      }}
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
                      onPress={() => copyToClipboard(contractAddress)}
                      style={styles.copyBtn3}
                    >
                      <Ionicons
                        name="copy-outline"
                        size={20}
                        style={{ marginLeft: "auto", opacity: 0.5 }}
                      ></Ionicons>
                    </TouchableOpacity>

                    <View
                      style={{
                        position: "absolute",
                        top: 58,
                        left: 5,
                        backgroundColor: theme.bg.backgroundColor,
                        zIndex: 99,
                        paddingHorizontal: 5,
                      }}
                    >
                      <Text style={styles.inputTitle}>
                        {translation.connectWallet.userAddress}
                      </Text>
                    </View>
                    <TextInput
                      placeholder=""
                      value={newUserAddress}
                      onChangeText={(text) => {
                        setNewUserAddress(text);
                        const newDataValidation = { ...modalValidation };
                        delete newDataValidation.newUserAddress;
                        setModalValidation(newDataValidation);
                        setNewWalletStatus(true);
                      }}
                      style={[
                        styles.textInput,
                        {
                          borderColor:
                            modalValidation.newUserAddress ||
                            newWalletStatus === false
                              ? "red"
                              : theme.borderColor,
                          backgroundColor: theme.bg.backgroundColor,
                        },
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
                      onPress={() => copyToClipboard(newUserAddress)}
                      style={styles.copyBtn1}
                    >
                      <Ionicons
                        name="copy-outline"
                        size={20}
                        style={{ marginLeft: "auto", opacity: 0.5 }}
                      ></Ionicons>
                    </TouchableOpacity>
                    <View
                      style={{
                        position: "absolute",
                        bottom: 60,
                        left: 5,
                        backgroundColor: theme.bg.backgroundColor,
                        zIndex: 99,
                        paddingHorizontal: 5,
                      }}
                    >
                      <Text style={styles.inputTitle}>
                        {translation.connectWallet.privateKey}
                      </Text>
                    </View>
                    <TextInput
                      placeholder=""
                      value={newPrivateKey}
                      onChangeText={(text) => {
                        setNewPrivateKey(text);
                        const newDataValidation = { ...modalValidation };
                        delete newDataValidation.newPrivateKey;
                        setModalValidation(newDataValidation);
                        setNewWalletStatus(true);
                      }}
                      style={[
                        styles.textInput,
                        {
                          borderColor:
                            modalValidation.newPrivateKey ||
                            newWalletStatus === false
                              ? "red"
                              : theme.borderColor,
                          backgroundColor: theme.bg.backgroundColor,
                        },
                      ]}
                      onFocus={() => {
                        if (typeof document !== "undefined") {
                          let inputs = document.getElementsByTagName("input");
                          for (let i = 0; i < inputs.length; i++) {
                            inputs[i].style.outline = "none";
                          }
                        }
                      }}
                    ></TextInput>
                    <TouchableOpacity
                      onPress={() => copyToClipboard(newPrivateKey)}
                      style={styles.copyBtn2}
                    >
                      <Ionicons
                        name="copy-outline"
                        size={20}
                        style={{ marginLeft: "auto", opacity: 0.5 }}
                      ></Ionicons>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.btnContainer}>
                    <TouchableOpacity
                      style={[
                        styles.connectBtn,
                        {
                          marginBottom: 30,
                          backgroundColor: theme.btnColor.primary,
                        },
                      ]}
                      onPress={() => addNewRoute()}
                    >
                      <Text style={{ color: theme.textColor.subtitle }}>
                        {translation.connectWallet.newMainBtn}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              </View>
            </ScrollView>
          </>
        </View>
      </Modal>
      {loading && (
        <Modal visible={loading} transparent={false}>
          <Loader theme={theme} status={loadingStatus}></Loader>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 30,
  },
  containerCenter: {
    position: "relative",
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E6EB",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    paddingRight: 40,
    height: 50,
  },
  innerText: {
    borderWidth: 1,
    padding: 10,
    paddingTop: 15,
    borderRadius: 5,
    marginBottom: 20,
    paddingRight: 40,
    height: 50,
    fontWeight: "300",
  },
  inputTitle: {
    opacity: 0.7,
  },
  btnContainer: {
    position: "relative",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },

  connectBtn: {
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
  },
  copyBtn1: {
    position: "absolute",
    top: 82,
    right: 10,
  },
  copyBtn2: {
    position: "absolute",
    bottom: 35,
    right: 10,
  },
  copyBtn3: {
    position: "absolute",
    top: 15,
    right: 10,
  },
  copyBtn4: {
    position: "absolute",
    top: 15,
    right: 10,
  },
  copyBtn5: {
    position: "absolute",
    top: 15,
    right: 10,
  },
  copyBtn6: {
    position: "absolute",
    top: 15,
    right: 10,
  },
  inputTitle: {
    fontSize: 16,
    opacity: 0.5,
  },
  dropdownRowChildStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  changeWallet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
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
    width: 250,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  infoBtn: {
    opacity: 0.5,
    marginLeft: 10,
  },
});

export default ConnectWallet;
