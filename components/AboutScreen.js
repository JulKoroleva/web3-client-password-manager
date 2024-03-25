/*
  Links to the repositories from which the imported packages are taken, as well as the name of the license 
  for each package used, are given in the file "license-checker-output.json" (obtained as a result of the 
  command output: "npx license-checker --json > license-checker-output.json"), located in the project root.
  The texts of all licenses used by the imported packages are presented in the "Licenses" directory, also 
  located in the root of this project.
  If the file "LICENSE__<license_name>___<package name>" has no content, then it corresponds to the standard 
  text of the corresponding license.
*/

import * as React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

export default function AboutScreen({ theme }) {
  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.bg.backgroundColor,
          },
        ]}
      ></View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    width: screenWidth,
    alignSelf: "center",
  },
});
