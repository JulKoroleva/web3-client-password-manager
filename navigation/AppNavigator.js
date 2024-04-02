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
 Image:   Wallet SVG Vector   
 Source:  "https://www.svgrepo.com/svg/30601/wallet"; (date: 19.03.24)
 License: Creative Commons CC0
*/

import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import store from "../store/store.js";
import * as Haptics from "expo-haptics";
import TranslationContext from "../translation/TranslationContext";

import {
  getMyBalance,
  getUserTokenAmount,
  isUserOwnerSmartContract,
  getCurrentCommissionSize,
} from "../scripts/dataStorageSmartContractInterface";

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

import { NavigationContainer } from "@react-navigation/native";

import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

import { downloadBlob } from "../utils/utils.js";
import { Button } from "react-native-paper";
import { Svg, Path, G } from "react-native-svg";
import Ionicons from "react-native-vector-icons/Ionicons";

import HomeScreen from "../components/HomeScreen";
import AboutScreen from "../components/AboutScreen";
import Settings from "../components/Settings";
import Faq from "../components/Faq.js";
import AdminPanel from "../components/AdminPanel";
import ConnectWallet from "../components/ConnectWallet";
import PasswordGeneration from "../components/PasswordGeneration.js";

const screenWidth = Dimensions.get("window").width;
const Drawer = createDrawerNavigator();

const AppNavigator = ({
  onDecryptData,
  handleMasterPassword,
  getAllAccounts,
  changeWallet,
  onLoading,
  walletError,
  onPressTheme,
  theme,
  isDarkTheme,
  onChangeLanguage,
  language,
}) => {
  const translation = useContext(TranslationContext);
  const [isRegistrationOpen, setRegistrationOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [exportModal, setExportModal] = useState(false);

  const userBalance = useSelector((state) => state.items.userBalance);
  const tokens = useSelector((state) => state.items.userTokens);
  const comission = useSelector((state) => state.items.currentComission);

  const savedNetworkName = useSelector((state) => state.items.networkName);
  const isAdmin = useSelector((state) => state.items.isAdmin);

  const getBalance = async () => {
    const balance = await getMyBalance();
    const tokens = await getUserTokenAmount();
    const comission = await getCurrentCommissionSize();
  };

  useEffect(() => {
    getBalance();
  }, [comission]);

  useEffect(() => {
    getBalance();
  }, [userBalance]);

  const openRegistration = () => {
    setRegistrationOpen(true);
  };

  const closeRegistration = () => {
    setRegistrationOpen(false);
  };

  const toggleExportModal = () => {
    setExportModal(!exportModal);
  };

  const exportToCSV = async () => {
    Haptics.selectionAsync();
    const categories = await store.getState().items.data;
    try {
      let csvContent = `name,url,username,password,note` + "\r\n";
      categories.forEach((category) => {
        category.items.forEach((item) => {
          const { name, url, login, password, note } = item;

          const username = item.hasOwnProperty("login") ? item.login : null;

          const row = [name, url, username, password, note]
            .map((field) => {
              return field ? field : "";
            })
            .join(",");
          csvContent += row + "\r\n";
        });
      });

      downloadBlob(csvContent, "export.csv", "text/csv;charset=utf-8;");
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      return null;
    }
    toggleExportModal();
  };

  const downloadCSV = async () => {
    exportToCSV();
  };

  return (
    <>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            drawerStyle: {
              backgroundColor: theme.bg.backgroundColor,
            },
            drawerActiveBackgroundColor: theme.activeItem,
            drawerActiveTintColor: theme.activeItemTint,
          }}
          initialRouteName="Home"
          drawerContent={(props) => {
            return (
              <DrawerContentScrollView>
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
                <View
                  style={[
                    { theme },
                    { alignItems: "center", padding: 16, marginTop: 40 },
                  ]}
                >
                  <TouchableOpacity
                    onPress={openRegistration}
                    style={{
                      height: 90,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Svg
                      fill={theme.walletIcon}
                      height="70px"
                      width="70px"
                      version="1.1"
                      id="Layer_1"
                      viewBox="0 0 458.531 458.531"
                      name={"wallet-icon"}
                    >
                      <G id="XMLID_830_">
                        <G>
                          <G>
                            <Path
                              d="M336.688,343.962L336.688,343.962c-21.972-0.001-39.848-17.876-39.848-39.848v-66.176
				c0-21.972,17.876-39.847,39.848-39.847h103.83c0.629,0,1.254,0.019,1.876,0.047v-65.922c0-16.969-13.756-30.725-30.725-30.725
				H30.726C13.756,101.49,0,115.246,0,132.215v277.621c0,16.969,13.756,30.726,30.726,30.726h380.943
				c16.969,0,30.725-13.756,30.725-30.726v-65.922c-0.622,0.029-1.247,0.048-1.876,0.048H336.688z"
                            />
                            <Path
                              d="M440.518,219.925h-103.83c-9.948,0-18.013,8.065-18.013,18.013v66.176c0,9.948,8.065,18.013,18.013,18.013h103.83
				c9.948,0,18.013-8.064,18.013-18.013v-66.176C458.531,227.989,450.466,219.925,440.518,219.925z M372.466,297.024
				c-14.359,0-25.999-11.64-25.999-25.999s11.64-25.999,25.999-25.999c14.359,0,25.999,11.64,25.999,25.999
				C398.465,285.384,386.825,297.024,372.466,297.024z"
                            />
                            <Path d="M358.169,45.209c-6.874-20.806-29.313-32.1-50.118-25.226L151.958,71.552h214.914L358.169,45.209z" />
                          </G>
                        </G>
                      </G>
                    </Svg>
                    <Text
                      style={{
                        color: "#6d6d70",
                        fontSize: 18,
                        fontWeight: "400",
                      }}
                    >
                      {savedNetworkName}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      alignItems: "flex-start",
                      width: "100%",
                      marginTop: 20,
                      opacity: 0.6,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        borderColor: theme.borderColor,
                        borderBottomWidth: 1,
                        width: "100%",
                      }}
                    >
                      <Text
                        style={{
                          color: theme.textColor.title,
                          fontWeight: "bold",
                          marginRight: 10,
                        }}
                      >
                        {translation.appNavigator.balance}
                      </Text>
                      <Text
                        style={{
                          color: "#545454",
                        }}
                      >
                        {userBalance.toLocaleString()}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        borderColor: theme.borderColor,
                        borderBottomWidth: 1,
                        width: "100%",
                      }}
                    >
                      <Text
                        style={{
                          color: theme.textColor.title,
                          fontWeight: "bold",
                          marginRight: 7,
                        }}
                      >
                        {translation.appNavigator.tokens}
                      </Text>
                      <Text
                        style={{
                          color: "#545454",
                        }}
                      >
                        {tokens.toLocaleString()}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        borderColor: theme.borderColor,
                        borderBottomWidth: 1,
                        width: "100%",
                      }}
                    >
                      <Text
                        style={{
                          color: theme.textColor.title,
                          fontWeight: "bold",
                          marginRight: 10,
                        }}
                      >
                        {translation.appNavigator.commission}
                      </Text>
                      <Text
                        style={{
                          color: "#545454",
                        }}
                      >
                        {comission.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>
                <DrawerItemList {...props} />
              </DrawerContentScrollView>
            );
          }}
        >
          <Drawer.Screen
            name={translation.appNavigator.HomeScreen}
            children={() => (
              <HomeScreen
                onLoading={onLoading}
                theme={theme}
                language={language}
              />
            )}
            options={{
              headerTitle: savedNetworkName,
              headerStyle: { backgroundColor: theme.bg.darkColor },
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => {
                    toggleExportModal();
                  }}
                  style={{ marginRight: 20 }}
                >
                  <Ionicons size={25} name="archive-outline" />
                </TouchableOpacity>
              ),
              drawerIcon: ({ focused, color, size }) => (
                <Ionicons name={"key-sharp"} size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name={translation.appNavigator.PasswordGeneration}
            children={() => <PasswordGeneration theme={theme} />}
            options={{
              headerTitle: "",
              headerStyle: { backgroundColor: theme.bg.darkColor },
              drawerIcon: ({ color, size }) => (
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="ionicon"
                  viewBox="0 0 512 512"
                  width="25"
                  height="25"
                  fill={color}
                >
                  <Path d="M208 512l-52.38-139.62L16 320l139.62-52.38L208 128l52.38 139.62L400 320l-139.62 52.38zM88 176l-23.57-64.43L0 88l64.43-23.57L88 0l23.57 64.43L176 88l-64.43 23.57zM400 256l-31.11-80.89L288 144l80.89-31.11L400 32l31.11 80.89L512 144l-80.89 31.11z" />
                </Svg>
              ),
            }}
          />
          <Drawer.Screen
            name={translation.appNavigator.AboutScreen}
            children={() => <Faq theme={theme} />}
            options={{
              // headerShown: screenWidth > 800 ? true : false,
              headerTitle: "",
              headerStyle: { backgroundColor: theme.bg.darkColor },
              drawerIcon: ({ focused, color, size }) => (
                <Ionicons name={"aperture-sharp"} size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name={translation.appNavigator.License}
            children={() => <AboutScreen theme={theme} />}
            options={{
              headerTitle: "",
              headerStyle: { backgroundColor: theme.bg.darkColor },
              drawerIcon: ({ focused, color, size }) => (
                <Ionicons name={"warning"} size={size} color={color} />
              ),
            }}
          />
          {isAdmin === true && (
            <Drawer.Screen
              name={translation.appNavigator.AdminPanel}
              children={() => (
                <AdminPanel onLoading={onLoading} theme={theme} />
              )}
              options={{
                headerTitle: "",
                headerStyle: { backgroundColor: theme.bg.darkColor },
                drawerIcon: ({ focused, color, size }) => (
                  <Ionicons
                    name={"construct-sharp"}
                    size={size}
                    color={color}
                  />
                ),
              }}
            />
          )}
        </Drawer.Navigator>
      </NavigationContainer>

      <Modal
        animationType="none"
        transparent={false}
        visible={isRegistrationOpen}
        onRequestClose={() => setRegistrationOpen(false)}
        style={{ width: 200, backgroundColor: theme.bg.backgroundColor }}
        activeOpacity={1}
      >
        <View
          style={[
            styles.modalHeader,
            { backgroundColor: theme.bg.backgroundColor },
          ]}
        >
          <TouchableOpacity onPress={closeRegistration} style={styles.closeBtn}>
            <Ionicons
              name="arrow-back-outline"
              size={30}
              style={{ marginRight: "auto", opacity: 0.5 }}
            ></Ionicons>
          </TouchableOpacity>
        </View>
        <ConnectWallet
          onLoading={onLoading}
          onDecryptData={onDecryptData}
          handleMasterPassword={handleMasterPassword}
          getAllAccounts={getAllAccounts}
          changeWallet={changeWallet}
          walletError={walletError}
          onCloseModal={closeRegistration}
          theme={theme}
        ></ConnectWallet>
      </Modal>

      <Modal
        animationType="none"
        transparent={false}
        visible={openSettings}
        onRequestClose={() => setOpenSettings(false)}
      >
        <View
          style={[
            styles.modalHeader,
            { backgroundColor: theme.bg.darkColor, paddingBottom: 5 },
          ]}
        >
          <TouchableOpacity
            onPress={() => setOpenSettings(false)}
            style={styles.closeBtn}
          >
            <Ionicons
              name="arrow-back-outline"
              size={30}
              style={{ marginRight: "auto", opacity: 0.5 }}
            ></Ionicons>
          </TouchableOpacity>
        </View>
        <Settings
          theme={theme}
          onPressTheme={onPressTheme}
          isDarkTheme={isDarkTheme}
          onChangeLanguage={onChangeLanguage}
          selectedLanguage={language}
        ></Settings>
      </Modal>

      <Modal visible={exportModal} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={[
                styles.closeButtonContainer,
                { position: "absolute", top: 4, right: 4 },
              ]}
              onPress={() => toggleExportModal()}
            >
              <Ionicons
                name="close-outline"
                size={20}
                style={{ opacity: 0.5 }}
              ></Ionicons>
            </TouchableOpacity>

            <Text style={{ opacity: 0.7, textAlign: "center" }}>
              {translation.appNavigator.downloadPasswords}
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
                  style={[styles.closeButton, { opacity: 0.3, width: 30 }]}
                  onPress={downloadCSV}
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
    paddingTop: 50,
    paddingHorizontal: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    position: "relative",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    width: "90%",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E5E6EB",
    borderStyle: "solid",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  loginBtn: {
    backgroundColor: "#E5E6EB",
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    marginLeft: "auto",
    marginRight: 20,
  },
  showPasswordBtn: {
    position: "absolute",
    right: 35,
    top: "50%",
  },
  closeBtn: {
    width: 40,
    marginTop: 10,
    marginRight: "auto",
    marginLeft: 10,
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
});

export default AppNavigator;
