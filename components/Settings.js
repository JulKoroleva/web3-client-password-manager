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
 Image:   Moon 01 SVG Vector 
 Source:  "https://www.svgrepo.com/svg/471716/moon-01"; (date: 19.03.24)
 License: CC Attribution License 
*/
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  Image,
  ScrollView,
  Switch,
  FlatList,
} from "react-native";
import { Svg, Path } from "react-native-svg";
import SelectDropdown from "react-native-select-dropdown";

const screenWidth = Dimensions.get("window").width;

const Settings = ({
  theme,
  onPressTheme,
  isDarkTheme,
  onChangeLanguage,
  selectedLanguage,
}) => {
  const [isLight, setIsLight] = useState(isDarkTheme);
  const languages = [
    { key: "ru", name: "Русский" },
    { key: "en", name: "English" },
    { key: "fr", name: "Français" },
  ];
  const [language, setLanguage] = useState(null);

  const changeTheme = () => {
    setIsLight(!isDarkTheme);
    onPressTheme();
  };
  const changeLanguage = (lang) => {
    setLanguage(lang);
    onChangeLanguage(lang);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.bg.backgroundColor }]}
    >
      <View style={[styles.container, { maxWidth: 800 }]}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            backgroundColor: theme.bg.darkColor,
            borderColor: theme.borderColor,
            paddingHorizontal: 10,
            paddingVertical: 2,
            borderRadius: 5,
          }}
        >
          <Svg
            style={{ zIndex: 200 }}
            xmlns="http://www.w3.org/2000/svg"
            fill="black"
            class="bi bi-moon"
            width="40px"
            height="40px"
            viewBox="0 0 24 24"
          >
            <Path
              d="M22 15.8442C20.6866 16.4382 19.2286 16.7688 17.6935 16.7688C11.9153 16.7688 7.23116 12.0847 7.23116 6.30654C7.23116 4.77135 7.5618 3.3134 8.15577 2C4.52576 3.64163 2 7.2947 2 11.5377C2 17.3159 6.68414 22 12.4623 22C16.7053 22 20.3584 19.4742 22 15.8442Z"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
          <Switch
            trackColor={{ false: "#81b0ff", true: "#4d4d4d" }}
            thumbColor={isLight ? "#f4f3f4" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={changeTheme}
            value={isLight}
            style={{
              transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
              marginRight: 10,
            }}
          />
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginTop: 30,
          }}
        >
          <SelectDropdown
            defaultButtonText={
              languages.find((lang) => lang.key === selectedLanguage).name
            }
            data={languages.map((language) => language.name)}
            onSelect={(selectedItem, index) =>
              changeLanguage(languages[index].key)
            }
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            buttonStyle={{
              width: "100%",
              borderRadius: 5,
              backgroundColor: theme.bg.darkColor,
              borderColor: theme.borderColor,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
            buttonTextStyle={{
              color: "black",
              textAlign: "left",
            }}
            dropdownStyle={{
              borderRadius: 5,
              backgroundColor: theme.bg.backgroundColor,
              borderColor: theme.borderColor,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 15,
              height: 181,
            }}
            dropdownTextStyle={{
              color: theme.bg.darkColor,
              textAlign: "left",
            }}
            dropdownTextHighlightStyle={{
              color: "#fff",
            }}
            rowTextStyle={{
              textAlign: "left",
              height: 48,
              lineHeight: 48,
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    width: screenWidth,
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

export default Settings;
