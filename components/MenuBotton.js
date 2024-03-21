/*
  Links to the repositories from which the imported packages are taken, as well as the name of the license 
  for each package used, are given in the file "license-checker-output.json" (obtained as a result of the 
  command output: "npx license-checker --json > license-checker-output.json"), located in the project root.
  The texts of all licenses used by the imported packages are presented in the "Licenses" directory, also 
  located in the root of this project.
  If the file "LICENSE__<license_name>___<package name>" has no content, then it corresponds to the standard 
  text of the corresponding license.
*/

import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";

const MenuBotton = ({
  expanded,
  openModal,
  pickDocument,
  saveDataToBlockchain,
  handlePress,
  showFAQ,
  theme,
}) => {
  return (
    <>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          top: "85%",
          left: "50%",
          transform: [{ translateX: -30 }, { translateY: 0 }],
          justifyContent: "center",
          alignItems: "center",
          width: 60,
          marginHorizontal: "auto",
          backgroundColor: "rgba(0, 0, 0, 0)",
        }}
      >
        <View style={{ position: "relative" }}>
          {expanded && (
            <Animatable.View
              animation={expanded ? "fadeIn" : "fadeOut"}
              duration={700}
              style={{
                flexDirection: "row",
                position: "",
                top: 0,
                left: 0,
                zIndex: 1,
                transform: [{ rotate: expanded ? "0deg" : "90deg" }],

                backgroundColor: "rgba(0, 0, 0, 0)",
              }}
            >
              <TouchableOpacity onPress={showFAQ}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    top: 30,
                    left: -5,
                    borderRadius: 50,
                    backgroundColor: theme.btnColor.mainMenu,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="information-outline"
                    size={20}
                    color={"white"}
                  ></Ionicons>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={openModal}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    top: -10,
                    left: 0,
                    borderRadius: 50,
                    backgroundColor: theme.btnColor.mainMenu,
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 10,
                  }}
                >
                  <Ionicons
                    name="add-outline"
                    size={25}
                    color={"white"}
                  ></Ionicons>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 50,
                  top: 30,
                  left: 5,
                  borderRadius: 50,
                  backgroundColor: theme.btnColor.mainMenu,
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 10,
                }}
                onPress={pickDocument}
              >
                <Ionicons
                  name="download-outline"
                  size={20}
                  color={"white"}
                ></Ionicons>
              </TouchableOpacity>
            </Animatable.View>
          )}
          {expanded === true && (
            <TouchableOpacity
              style={{
                alignItems: "center",
              }}
              onPress={saveDataToBlockchain}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                  marginBottom: 50,
                  backgroundColor: theme.btnColor.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  marginHorizontal: "auto",
                }}
              >
                <Ionicons
                  color={"white"}
                  size={40}
                  name="cloud-upload-outline"
                ></Ionicons>
              </View>
            </TouchableOpacity>
          )}
          {expanded === false && (
            <TouchableOpacity
              onPress={handlePress}
              style={{
                backgroundColor: "transparent",
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                  backgroundColor: theme.btnColor.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={20}
                  color={"white"}
                ></Ionicons>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

export default MenuBotton;
