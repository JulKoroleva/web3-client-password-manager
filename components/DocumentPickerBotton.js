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
 Image:   Folder SVG Vector  
 Source:  "https://www.svgrepo.com/svg/514322/folder"; (date: 19.03.24)
 License: Creative Commons CC0 
*/
import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import TranslationContext from "../translation/TranslationContext";
import { Svg, Path, G } from "react-native-svg";

const DocumentPickerBotton = ({ pickDocument, showFAQ }) => {
  const translation = useContext(TranslationContext);
  return (
    <>
      <View style={styles.downloadBtn}>
        <TouchableOpacity onPress={pickDocument}>
          <Svg
            width="75px"
            height="75px"
            viewBox="0 0 1024 1024"
            class="icon"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
          >
            <G id="SVGRepo_bgCarrier" stroke-width="0" />

            <G
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <G id="SVGRepo_iconCarrier">
              <Path
                d="M242.3 743.4h603.4c27.8 0 50.3-22.5 50.3-50.3V192H192v501.1c0 27.8 22.5 50.3 50.3 50.3z"
                fill="#7a8ea8"
              />

              <Path
                d="M178.3 807.4h603.4c27.8 0 50.3-22.5 50.3-50.3V256H128v501.1c0 27.8 22.5 50.3 50.3 50.3z"
                fill="#e8e8e8"
              />

              <Path
                d="M960 515v384c0 35.3-28.7 64-64 64H128c-35.3 0-64-28.7-64-64V383.8c0-35.3 28.7-64 64-64h344.1c24.5 0 46.8 13.9 57.5 35.9l46.5 95.3H896c35.3 0 64 28.7 64 64z"
                fill="#ffb638"
              />

              <Path
                d="M704 512c0-20.7-1.4-41.1-4.1-61H576.1l-46.5-95.3c-10.7-22-33.1-35.9-57.5-35.9H128c-35.3 0-64 28.7-64 64V899c0 6.7 1 13.2 3 19.3C124.4 945 188.5 960 256 960c247.4 0 448-200.6 448-448z"
                fill="#ffd257"
              />
            </G>
          </Svg>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            position: "absolute",
            flexDirection: "row",
            zIndex: 300,
            bottom: -30,
            left: -30,
            justifyContent: "center",
            alignContent: "center",
            width: 150,
          }}
          onPress={showFAQ}
        >
          <Text style={{ marginRight: 10 }}>
            {translation.documentPickerBotton.upload}
          </Text>
          <Image
            source={require("../assets/faq.png")}
            style={{ width: 20, height: 20, opacity: 0.2 }}
          ></Image>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  downloadBtn: {
    position: "absolute",
    top: 0,
    left: "47%",
    transform: [{ translateX: -30 }, { translateY: -280 }],
    justifyContent: "center",
    alignItems: "center",
  },
  downloadBtnImage: {
    width: 50,
    height: 50,
  },
});

export default DocumentPickerBotton;
