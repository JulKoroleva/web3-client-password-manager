/*
  Links to the repositories from which the imported packages are taken, as well as the name of the license 
  for each package used, are given in the file "license-checker-output.json" (obtained as a result of the 
  command output: "npx license-checker --json > license-checker-output.json"), located in the project root.
  The texts of all licenses used by the imported packages are presented in the "Licenses" directory, also 
  located in the root of this project.
  If the file "LICENSE__<license_name>___<package name>" has no content, then it corresponds to the standard 
  text of the corresponding license.
*/

import React, { useState, useRef, useContext } from "react";
import store from "../store/store";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ColorPicker from "react-native-wheel-color-picker";
import TranslationContext from "../translation/TranslationContext";

const screenWidth = Dimensions.get("window").width;
const NewCategoryForm = ({ onClose, theme }) => {
  const translation = useContext(TranslationContext);
  const [modalValidation, setModalValidation] = useState({});
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [newCategory, setNewCategory] = useState({
    category: "",
    categoryIcon: "",
    categoryIconColor: "#68b8ff",
    items: [],
  });
  const [numColumns, setNumColumns] = useState(7);
  const [icons, setIcons] = useState([
    "earth-outline",
    "airplane-outline",
    "at-outline",
    "alert-circle-outline",
    "american-football-outline",
    "attach-outline",
    "battery-charging-outline",
    "beer-outline",
    "bicycle-outline",
    "briefcase-outline",
    "bulb-outline",
    "camera-outline",
    "cash-outline",
    "chatbox-ellipses-outline",
    "color-filter-outline",
    "heart-outline",
    "flash-outline",
    "flower-outline",
  ]);
  const palette = [
    "#000000",
    "#888888",
    "#ed1c24",
    "#d11cd5",
    "#1633e6",
    "#00aeef",
    "#00c85d",
    "#57ff0a",
    "#ffde17",
    "#f26522",
  ];

  const handleInputChange = (key, text) => {
    setNewCategory((prevData) => ({
      ...prevData,
      [key]: text,
    }));
    if (modalValidation[key]) {
      setModalValidation((prevValidation) => ({
        ...prevValidation,
        [key]: "",
      }));
    }
  };

  const onColorChange = (color) => {
    handleInputChange("categoryIconColor", color);
  };

  const addCategory = () => {
    let isValid = true;
    if (newCategory.category.trim() === "") {
      setModalValidation({
        ...modalValidation,
        category: "Заполните поле",
      });
      isValid = false;
    }
    if (newCategory.categoryIcon.trim() === "") {
      onColorChange("#ed1c23");
      isValid = false;
    }
    if (isValid) {
      store.dispatch({
        type: "ADD_CATEGORY",
        payload: {
          newCategory: newCategory.category,
          categoryIcon: newCategory.categoryIcon,
          categoryIconColor: newCategory.categoryIconColor,
          items: [],
        },
      });

      setNewCategory({
        category: "",
        categoryIcon: "",
        categoryIconColor: "#000000",
        items: [],
      });
      onClose();
    }
  };

  const renderIconItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleInputChange("categoryIcon", item)}>
      <Ionicons
        name={item}
        size={30}
        color={newCategory.categoryIconColor}
        style={[
          styles.icon,
          {
            backgroundColor:
              newCategory.categoryIcon === item
                ? "rgba(0, 0, 0, 0.07)"
                : "transparent",
            padding: 2,
            borderRadius: 5,
          },
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        contentContainerStyle={styles.scrollViewContainer}
        scrollEnabled={scrollEnabled}
        endFillColor={theme.bg.mainBg}
        overScrollMode="never"
        style={{ backgroundColor: theme.bg.mainBg }}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.bg.mainBg,
            },
          ]}
        >
          <View
            style={{ justifyContent: "start", width: "90%", maxWidth: 500 }}
          >
            <View>
              <TextInput
                placeholder={translation.newCategoryForm.name}
                onChangeText={(text) => handleInputChange("category", text)}
                style={[
                  styles.textInput,
                  {
                    borderColor: modalValidation.category
                      ? "red"
                      : theme.borderColor,
                    backgroundColor: theme.bg.mainBg,
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
              {modalValidation.category && (
                <Text style={styles.validationError}>
                  {modalValidation.category}
                </Text>
              )}
            </View>

            <FlatList
              data={icons}
              numColumns={numColumns}
              renderItem={renderIconItem}
              keyExtractor={(item) => item}
              key={numColumns}
            />

            <View style={styles.colorContainer}>
              <ColorPicker
                color={newCategory.categoryIconColor}
                onColorChange={onColorChange}
                thumbSize={40}
                noSnap={true}
                row={false}
                sliderHidden={true}
                swatches={true}
                swatchesLast={true}
                style={{ marginBottom: 10, marginTop: 0, padding: 0 }}
                onTouchStart={() => setScrollEnabled(false)}
                onTouchEnd={() => setScrollEnabled(true)}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.btnColor.primary }]}
          onPress={() => addCategory()}
          activeOpacity={1}
        >
          <Text style={{ color: "white" }}>
            {translation.newCategoryForm.confirmBtn}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  textInput: {
    borderWidth: 1,
    padding: 9,
    borderRadius: 5,
    marginBottom: 20,
  },
  inputTitle: {
    position: "absolute",
    top: -40,
    opacity: 0.7,
    marginBottom: 10,
  },
  icon: {
    margin: 4,
  },
  colorContainer: {},
  scrollViewContainer: {
    flex: 1,
  },
  addBtn: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: screenWidth,
    maxWidth: 800,
    alignSelf: "center",
  },
  validationError: {
    position: "absolute",
    bottom: 0,
    color: "red",
  },
});

export default NewCategoryForm;
