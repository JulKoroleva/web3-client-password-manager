/*
  Links to the repositories from which the imported packages are taken, as well as the name of the license 
  for each package used, are given in the file "license-checker-output.json" (obtained as a result of the 
  command output: "npx license-checker --json > license-checker-output.json"), located in the project root.
  The texts of all licenses used by the imported packages are presented in the "Licenses" directory, also 
  located in the root of this project.
  If the file "LICENSE__<license_name>___<package name>" has no content, then it corresponds to the standard 
  text of the corresponding license.
*/

import { StyleSheet } from "react-native";

const theme = StyleSheet.create({
  DarkTheme: {
    bg: {
      backgroundColor: "#a8a5a5",
      FlatList: "#c4c0c0",mainBg: "#c4c0c0",
      darkColor: "#969393",
    },
    borderColor: "#999496",
    textColor: {
      title: "#f1f1f1",
      subtitle: "#dedede",
    },
    btnColor: {
        primary: "#353535",
        base: "#4e4e4e",
        mainMenu:"#4e4e4e",
        modalBtn:"#353535",
        ellipsis:"#353535"
      },
      defaultIcon: "#f0b616",
      activeItem:  "#c5c5c5",
      activeItemTint:  "#757778",
      walletIcon: "walletDarkTheme",
      activityIndicator: "#353535",
      mainTitle: "#edebeb",
      walletIcon:"#fff",
      logoText:"#fff",
  },
  DefaultTheme: {
    bg: { backgroundColor: "#f2f2f2", FlatList: "#E5E6EB", mainBg: "#fff", darkColor: "#fff" },
    borderColor: "#E5E6EB",
    textColor: {
        title: "#8f8f8f",
        subtitle: "#fff",
      },
      btnColor: {
        primary: "#0071b8",
        mainMenu: "#0087db",
        ellipsis:"#86909C"
      },
      defaultIcon: "#0071b8",
      
      activeItem:  "#d5e0eb",
      activeItemTint:  "#395573",
      walletIcon: "walletIcon",
      activityIndicator: "#2f6d9f",
      mainTitle: "#a6a4a4",
      walletIcon:"#006aed",
      logoText:"#4c89d9",
  },
 
});

export default theme;
