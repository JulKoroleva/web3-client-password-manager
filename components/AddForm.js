/*
  Links to the repositories from which the imported packages are taken, as well as the name of the license 
  for each package used, are given in the file "license-checker-output.json" (obtained as a result of the 
  command output: "npx license-checker --json > license-checker-output.json"), located in the project root.
  The texts of all licenses used by the imported packages are presented in the "Licenses" directory, also 
  located in the root of this project.
  If the file "LICENSE__<license_name>___<package name>" has no content, then it corresponds to the standard 
  text of the corresponding license.
*/

import React, { useState, useRef, useEffect, useContext } from "react";

import { addAction } from "../store/actions";
import store from "../store/store";
import NewCategoryForm from "./NewCategoryForm";
import TranslationContext from "../translation/TranslationContext";

import Svg, { Path } from "react-native-svg";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Dimensions,
  ScrollView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SelectDropdown from "react-native-select-dropdown";

import Ionicons from "react-native-vector-icons/Ionicons";

import applicationsList from "../fixture/applications";
import paymentsCards from "../fixture/paymentsCards";

const screenWidth = Dimensions.get("window").width;
const AboutScreen = ({ onClose, theme, language }) => {
  const translation = useContext(TranslationContext);
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [isNameSelected, setIsNameSelected] = useState(false);
  const [dataM, setDataM] = useState("");
  const [isAdditionalFieldsVisible, setAdditionalFieldsVisibility] =
    useState(false);
  const [isNewCategoryFormVisible, setNewCategoryFormVisibility] =
    useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [itemData, setItemData] = useState({
    id: Math.random().toString(36).substring(7),
    category: "",
    url: "",
    icon: "",
    name: "",
    itemName: "",
    login: "",
    password: "",
    number: "",
    date: "",
    owner: "",
    cv: "",
    additionalInfo: {
      bankName: "",
      bankTel: "",
      emailAdress: "",
    },
  });

  const [isModalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const input1Ref = useRef(null);
  const input2Ref = useRef(null);

  const [modalValidation, setModalValidation] = useState({});

  const toggleNewCategoryForm = () => {
    setNewCategoryFormVisibility(!isNewCategoryFormVisible);
  };

  const toggleAdditionalFields = () => {
    setAdditionalFieldsVisibility(!isAdditionalFieldsVisible);
  };

  const focusNextInput = (nextInputRef) => {
    nextInputRef.current.focus();
  };

  useEffect(() => {
    const newData = store.getState().items.data.map((item) => ({
      category: item.category,
      categoryName: item.categoryName,
      icon: item.categoryIcon,
      color: item.categoryIconColor,
    }));
    newData.push({ category: "", icon: "" });
    setCategories(newData);
  }, [store.getState().items.data]);

  useEffect(() => {
    setItemData((prevData) => ({
      id: Math.random().toString(36).substring(7),
      category: selectedValue ? selectedValue.category : "",
      url: "",
      icon: "",
      name: "",
      itemName: "",
      login: "",
      password: "",
      number: "",
      date: "",
      owner: "",
      cv: "",
      additionalInfo: {
        bankName: "",
        bankTel: "",
        emailAdress: "",
      },
    }));
  }, [selectedValue]);

  const formatCardNumber = (input) => {
    const cleanInput = input.replace(/[^\d]/g, "");
    const formattedInput = cleanInput.replace(/(.{4})/g, "$1 ");
    handleInputChange("number", formattedInput);
  };

  const filteredApplications = applicationsList.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );
  const filteredPaymentsCards = paymentsCards.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );
  const handleInputChange = (key, text) => {
    if (key === "name") {
      setIsNameSelected(true);
    }

    setItemData((prevData) => {
      if (key === "bankName" || key === "bankTel" || key === "emailAdress") {
        return {
          ...prevData,
          additionalInfo: {
            ...prevData.additionalInfo,
            [key]: text,
          },
        };
      } else {
        return {
          ...prevData,
          [key]: text,
        };
      }
    });
    if (modalValidation[key]) {
      setModalValidation((prevValidation) => ({
        ...prevValidation,
        [key]: "",
      }));
    }
  };
  const handleCategorySelect = (selectedItem, index) => {
    setIsCategorySelected(true);
    setSelectedValue(selectedItem);
    handleInputChange("category", selectedItem.category);
    setModalValidation({});
  };

  const handleAdd = () => {
    let isValid = true;

    if (!isCategorySelected) {
      setModalValidation({
        ...modalValidation,
        isCategorySelected: "Заполните поле",
      });
      isValid = false;
      return;
    }

    if (!itemData.name) {
      setModalValidation({
        ...modalValidation,
        name: "Заполните поле",
      });
      isValid = false;
      return;
    }

    if (isValid) {
      const selectedCategory = store
        .getState()
        .items.data.find((category) => category.category === itemData.category);

      if (selectedCategory) {
        const itemWithName = selectedCategory.items.find(
          (item) => item.name === itemData.name
        );

        if (itemWithName) {
          if (itemData.itemName === "") {
            setModalValidation({
              ...modalValidation,
              itemName: "Заполните поле",
            });
            isValid = false;
            return;
          } else {
            if (itemData.category === "Bank cards") {
              store.dispatch(
                addAction(itemData.category, {
                  id: itemData.id,
                  itemName: itemData.itemName,
                  icon: itemData.icon,
                  name: itemData.itemName,
                  number: itemData.number,
                  date: itemData.date,
                  owner: itemData.owner,
                  cv: itemData.cv,
                  additionalInfo: itemData.additionalInfo,
                })
              );
            } else if (itemData.category === "Websites") {
              store.dispatch(
                addAction(itemData.category, {
                  id: itemData.id,
                  url: itemData.url,
                  itemName: itemData.itemName,
                  icon: itemData.icon,
                  name: itemData.itemName,
                  login: itemData.login,
                  password: itemData.password,
                })
              );
            } else {
              store.dispatch(
                addAction(itemData.category, {
                  id: itemData.id,
                  itemName: itemData.itemName,
                  icon: itemData.icon,
                  name: itemData.itemName,
                  login: itemData.login,
                  password: itemData.password,
                })
              );
            }

            setIsCategorySelected(false);
            setIsNameSelected(false);
            onClose();
          }
        } else {
          if (itemData.category === "Bank cards") {
            store.dispatch(
              addAction(itemData.category, {
                id: itemData.id,
                itemName: itemData.itemName,
                icon: itemData.icon,
                name: itemData.name,
                number: itemData.number,
                date: itemData.date,
                owner: itemData.owner,
                cv: itemData.cv,
                additionalInfo: itemData.additionalInfo,
              })
            );
          } else if (itemData.category === "Websites") {
            store.dispatch(
              addAction(itemData.category, {
                id: itemData.id,
                url: itemData.url,
                itemName: itemData.itemName,
                icon: itemData.icon,
                name: itemData.name,
                login: itemData.login,
                password: itemData.password,
              })
            );
          } else {
            store.dispatch(
              addAction(itemData.category, {
                id: itemData.id,
                itemName: itemData.itemName,
                icon: itemData.icon,
                name: itemData.name,
                login: itemData.login,
                password: itemData.password,
              })
            );
          }

          setIsCategorySelected(false);
          setIsNameSelected(false);
          onClose();
        }
      }
    }
  };

  const acceptAppName = (searchText) => {
    if (searchText) {
      handleInputChange("name", searchText);
      setItemData((prevData) => ({
        ...prevData,
        name: searchText,
      }));
      setModalVisible(false);
    }
  };
  const renderCustomDropdownIcon = () => (
    <Svg
      width="18"
      height="18"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginRight: 10, width: 30, height: 30 }}
    >
      <Path
        d="M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z"
        fill="#6c757d"
      />
    </Svg>
  );

  return (
    <>
      <View style={styles.container}>
        <TextInput
          placeholder={
            modalValidation.itemName
              ? translation.addForm.nameTitleErr
              : translation.addForm.nameTitle
          }
          value={itemData.itemName}
          onChangeText={(text) => handleInputChange("itemName", text)}
          style={[styles.absoluteInput]}
          placeholderTextColor={
            modalValidation.itemName ? "red" : "rgba(0,0,0,0.5)"
          }
          onFocus={() => {
            if (typeof document !== "undefined") {
              let inputs = document.getElementsByTagName("input");
              for (let i = 0; i < inputs.length; i++) {
                inputs[i].style.outline = "none";
              }
            }
          }}
        />
        <ScrollView
          style={{
            flex: 1,
            width: screenWidth,
            maxWidth: 800,
            backgroundColor: theme.bg.backgroundColor,
          }}
          showsVerticalScrollIndicator={false}
          endFillColor="#000"
          overScrollMode="never"
        >
          <View
            style={{
              position: "relative",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 10,
            }}
          >
            <SelectDropdown
              data={categories}
              onSelect={handleCategorySelect}
              defaultButtonText={translation.addForm.selectBtn}
              renderDropdownIcon={renderCustomDropdownIcon}
              dropdownIconPosition="right"
              buttonStyle={{
                backgroundColor: "transparent",
                borderWidth: 1,
                borderRadius: 5,
                width: "90%",
                marginTop: 40,
                borderColor: modalValidation.isCategorySelected
                  ? "red"
                  : theme.borderColor,
                backgroundColor: theme.bg.mainBg,
              }}
              buttonTextStyle={{
                textAlign: "left",
                width: 100,
              }}
              dropdownStyle={{
                borderRadius: 5,
                height: "auto",
                maxHeight: 400,
              }}
              rowTextStyle={{
                textAlign: "left",
                color: "black",
              }}
              renderCustomizedButtonChild={(selectedItem, index) => {
                return (
                  <View style={styles.dropdownBtnChildStyle}>
                    {selectedItem && (
                      <Ionicons
                        color={selectedItem.color}
                        size={25}
                        name={selectedItem.icon}
                      ></Ionicons>
                    )}
                    <Text style={styles.dropdownBtnTxt}>
                      {selectedItem
                        ? language === "ru"
                          ? !selectedItem.categoryName
                            ? selectedItem.category
                            : selectedItem.categoryName
                          : selectedItem.category
                        : translation.addForm.selectBtn}
                    </Text>
                  </View>
                );
              }}
              renderCustomizedRowChild={(item, index) => {
                const isLastItem = index === categories.length - 1;
                return (
                  <>
                    <View style={styles.dropdownRowChildStyle}>
                      <Ionicons
                        color={item.color}
                        size={25}
                        name={item.icon}
                      ></Ionicons>
                      <Text style={styles.dropdownRowTxt}>
                        {language === "ru"
                          ? !item.categoryName
                            ? item.category
                            : item.categoryName
                          : item.category}
                      </Text>
                    </View>
                    {isLastItem && (
                      <TouchableOpacity
                        style={[
                          styles.newCategoryBtn,
                          { backgroundColor: theme.btnColor.primary },
                        ]}
                        onPress={toggleNewCategoryForm}
                      >
                        <Ionicons
                          name="add-outline"
                          size={40}
                          color={"white"}
                        ></Ionicons>
                      </TouchableOpacity>
                    )}
                  </>
                );
              }}
            />

            <View style={{ width: "100%" }}>
              {isCategorySelected &&
                itemData.category !== "Websites" &&
                itemData.category !== "Bank cards" && (
                  <View>
                    <TouchableOpacity
                      onPress={() => setModalVisible(true)}
                      style={[
                        styles.select,
                        {
                          borderColor: modalValidation.name
                            ? "red"
                            : theme.borderColor,
                          alignSelf: "center",
                          backgroundColor: theme.bg.mainBg,
                        },
                      ]}
                    >
                      {applicationsList.map((item) =>
                        item.title === itemData.name ? (
                          <Image
                            key={item.title}
                            source={item.image}
                            style={styles.dropdownBtnImage}
                          />
                        ) : null
                      )}
                      <Text style={styles.dropdownBtnTxt}>
                        {itemData.name
                          ? itemData.name
                          : translation.addForm.name}
                      </Text>
                    </TouchableOpacity>

                    <Modal
                      visible={isModalVisible}
                      animationType="fade"
                      transparent={true}
                      onRequestClose={() => setModalVisible(false)}
                    >
                      <View
                        style={[
                          styles.modalContainer,
                          {
                            backgroundColor: theme.bg.mainBg,
                            width: screenWidth,
                          },
                        ]}
                      >
                        <View
                          style={[
                            {
                              backgroundColor: theme.bg.mainBg,
                              maxWidth: 800,
                              width: "100%",
                              alignSelf: "center",
                            },
                          ]}
                        >
                          <View
                            style={[
                              styles.searchContainer,
                              { backgroundColor: theme.bg.backgroundColor },
                            ]}
                          >
                            <Text style={{ marginHorizontal: 5 }}>
                              <FontAwesome
                                name={"search"}
                                color={"#000000"}
                                size={18}
                              />
                            </Text>
                            <TextInput
                              style={[
                                styles.searchInput,
                                { borderColor: theme.borderColor },
                              ]}
                              placeholder={translation.addForm.search}
                              onChangeText={(text) => setSearchText(text)}
                              onFocus={() => {
                                if (typeof document !== "undefined") {
                                  let inputs =
                                    document.getElementsByTagName("input");
                                  for (let i = 0; i < inputs.length; i++) {
                                    inputs[i].style.outline = "none";
                                  }
                                }
                              }}
                            />
                          </View>

                          <ScrollView
                            showsVerticalScrollIndicator={false}
                            alwaysBounceVertical={false}
                            contentContainerStyle={styles.scrollViewContainer}
                            endFillColor="#000"
                            overScrollMode="never"
                          >
                            {filteredApplications.map((item, index) => (
                              <TouchableOpacity
                                key={index}
                                style={[
                                  styles.option,
                                  { borderColor: theme.borderColor },
                                ]}
                                onPress={() => {
                                  setModalVisible(false);
                                  handleInputChange("name", item.title);
                                  setItemData((prevData) => ({
                                    ...prevData,
                                    icon: item.image,
                                  }));
                                }}
                              >
                                <Image
                                  key={item.title}
                                  source={item.image}
                                  style={styles.optionImage}
                                />
                                <Text style={styles.dropdownRowTxt}>
                                  {item.title}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            acceptAppName(searchText);
                          }}
                          style={{
                            position: "absolute",
                            bottom: 30,
                            right: 30,
                            alignItems: "center",
                            borderRadius: 50,
                            backgroundColor: "#668cad",
                            width: 65,
                            height: 65,
                            opacity: searchText.length > 0 ? 1 : 0.5,
                          }}
                        >
                          <Ionicons
                            size={60}
                            color={"white"}
                            name="checkmark-outline"
                          />
                        </TouchableOpacity>
                      </View>
                    </Modal>
                  </View>
                )}

              {isCategorySelected && itemData.category === "Websites" && (
                <View>
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={[
                      styles.select,
                      {
                        borderColor: modalValidation.name
                          ? "red"
                          : theme.borderColor,
                        alignSelf: "center",
                        backgroundColor: theme.bg.mainBg,
                      },
                    ]}
                  >
                    {applicationsList.map((item) =>
                      item.title === itemData.name ? (
                        <Image
                          key={item.title}
                          source={item.image}
                          style={styles.dropdownBtnImage}
                        />
                      ) : null
                    )}
                    <Text style={styles.dropdownBtnTxt}>
                      {itemData.name ? itemData.name : translation.addForm.name}
                    </Text>
                  </TouchableOpacity>

                  <Modal
                    visible={isModalVisible}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                  >
                    <View
                      style={[
                        styles.modalContainer,
                        { backgroundColor: theme.bg.mainBg },
                      ]}
                    >
                      <View
                        style={[
                          {
                            backgroundColor: theme.bg.mainBg,
                            maxWidth: 800,
                            width: "100%",
                            alignSelf: "center",
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.searchContainer,
                            { backgroundColor: theme.bg.backgroundColor },
                          ]}
                        >
                          <Text style={{ marginHorizontal: 5 }}>
                            <FontAwesome
                              name={"search"}
                              color={"#000000"}
                              size={18}
                            />
                          </Text>
                          <TextInput
                            style={[
                              styles.searchInput,
                              { borderColor: theme.borderColor },
                            ]}
                            placeholder={translation.addForm.search}
                            onChangeText={(text) => setSearchText(text)}
                            maxLength={10}
                            onFocus={() => {
                              if (typeof document !== "undefined") {
                                let inputs =
                                  document.getElementsByTagName("input");
                                for (let i = 0; i < inputs.length; i++) {
                                  inputs[i].style.outline = "none";
                                }
                              }
                            }}
                          />
                        </View>

                        <ScrollView
                          showsVerticalScrollIndicator={false}
                          alwaysBounceVertical={false}
                          contentContainerStyle={styles.scrollViewContainer}
                          endFillColor="#000"
                          overScrollMode="never"
                        >
                          {filteredApplications.map((item, index) => (
                            <TouchableOpacity
                              key={index}
                              style={[
                                styles.option,
                                { borderColor: theme.borderColor },
                              ]}
                              onPress={() => {
                                setModalVisible(false);
                                handleInputChange("name", item.title);
                                setItemData((prevData) => ({
                                  ...prevData,
                                  icon: item.image,
                                }));
                              }}
                            >
                              <Image
                                key={item.title}
                                source={item.image}
                                style={styles.optionImage}
                              />
                              <Text style={styles.dropdownRowTxt}>
                                {item.title}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          acceptAppName(searchText);
                        }}
                        style={{
                          position: "absolute",
                          bottom: 30,
                          right: 30,
                          alignItems: "center",
                          borderRadius: 50,
                          backgroundColor: "#668cad",
                          width: 65,
                          height: 65,
                          opacity: searchText.length > 0 ? 1 : 0.5,
                        }}
                      >
                        <Ionicons
                          size={60}
                          color={"white"}
                          name="checkmark-outline"
                        />
                      </TouchableOpacity>
                    </View>
                  </Modal>
                </View>
              )}
              {isNameSelected &&
                itemData.name.length >= 2 &&
                isCategorySelected &&
                itemData.category !== "Bank cards" && (
                  <>
                    {itemData.category === "Websites" && (
                      <TextInput
                        placeholder={translation.addForm.link}
                        value={itemData.url}
                        onChangeText={(text) => handleInputChange("url", text)}
                        style={[
                          styles.textInput,
                          { borderColor: theme.borderColor },
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
                    )}
                    <TextInput
                      placeholder={translation.addForm.login}
                      value={itemData.login}
                      onChangeText={(text) => handleInputChange("login", text)}
                      style={[
                        styles.textInput,
                        { borderColor: theme.borderColor },
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
                    <TextInput
                      placeholder={translation.addForm.password}
                      value={itemData.password}
                      onChangeText={(text) =>
                        handleInputChange("password", text)
                      }
                      secureTextEntry
                      style={[
                        styles.textInput,
                        { borderColor: theme.borderColor },
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
                  </>
                )}
            </View>
            <View style={{ width: "100%" }}>
              {isCategorySelected && itemData.category === "Bank cards" && (
                <View>
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={[
                      styles.select,
                      {
                        borderColor: modalValidation.name
                          ? "red"
                          : theme.borderColor,
                        alignSelf: "center",
                        backgroundColor: theme.bg.mainBg,
                      },
                    ]}
                  >
                    {paymentsCards.map((item) =>
                      item.title === itemData.name ? (
                        <Image
                          key={item.title}
                          source={item.image}
                          style={styles.dropdownBtnImage}
                        />
                      ) : null
                    )}
                    <Text style={styles.dropdownBtnTxt}>
                      {itemData.name ? itemData.name : translation.addForm.name}
                    </Text>
                  </TouchableOpacity>

                  <Modal
                    visible={isModalVisible}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                  >
                    <View
                      style={[
                        styles.modalContainer,
                        { backgroundColor: theme.bg.mainBg },
                      ]}
                    >
                      <View
                        style={[
                          {
                            backgroundColor: theme.bg.mainBg,
                            maxWidth: 800,
                            width: "100%",
                            alignSelf: "center",
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.searchContainer,
                            { backgroundColor: theme.bg.backgroundColor },
                          ]}
                        >
                          <Text style={{ marginHorizontal: 5 }}>
                            <FontAwesome
                              name={"search"}
                              color={"#000000"}
                              size={18}
                            />
                          </Text>
                          <TextInput
                            style={[
                              styles.searchInput,
                              { borderColor: theme.borderColor },
                            ]}
                            placeholder={translation.addForm.search}
                            onChangeText={(text) => setSearchText(text)}
                            maxLength={10}
                            onFocus={() => {
                              if (typeof document !== "undefined") {
                                let inputs =
                                  document.getElementsByTagName("input");
                                for (let i = 0; i < inputs.length; i++) {
                                  inputs[i].style.outline = "none";
                                }
                              }
                            }}
                          />
                        </View>

                        <ScrollView
                          showsVerticalScrollIndicator={false}
                          alwaysBounceVertical={false}
                          contentContainerStyle={styles.scrollViewContainer}
                          endFillColor="#000"
                          overScrollMode="never"
                        >
                          {filteredPaymentsCards.map((item, index) => (
                            <TouchableOpacity
                              key={index}
                              style={[
                                styles.option,
                                { borderColor: theme.borderColor },
                              ]}
                              onPress={() => {
                                setModalVisible(false);
                                handleInputChange("name", item.title);
                                setItemData((prevData) => ({
                                  ...prevData,
                                  icon: item.image,
                                }));
                              }}
                            >
                              <Image
                                key={item.title}
                                source={item.image}
                                style={styles.optionImage}
                              />
                              <Text style={styles.dropdownRowTxt}>
                                {item.title}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          acceptAppName(searchText);
                        }}
                        style={{
                          position: "absolute",
                          bottom: 30,
                          right: 30,
                          alignItems: "center",
                          borderRadius: 50,
                          backgroundColor: theme.btnColor.primary,
                          width: 65,
                          height: 65,
                          opacity: searchText.length > 0 ? 1 : 0.5,
                        }}
                      >
                        <Ionicons
                          size={60}
                          color={"white"}
                          name="checkmark-outline"
                        />
                      </TouchableOpacity>
                    </View>
                  </Modal>
                </View>
              )}
            </View>
            {isNameSelected &&
              itemData.name.length >= 2 &&
              isCategorySelected &&
              itemData.category === "Bank cards" && (
                <>
                  <TextInput
                    style={[
                      styles.numberInput,
                      { borderColor: theme.borderColor },
                    ]}
                    placeholder="XXXX XXXX XXXX XXXX"
                    keyboardType="numeric"
                    maxLength={23}
                    value={itemData.number}
                    onChangeText={(text) => formatCardNumber(text)}
                    onFocus={() => {
                      if (typeof document !== "undefined") {
                        let inputs = document.getElementsByTagName("input");
                        for (let i = 0; i < inputs.length; i++) {
                          inputs[i].style.outline = "none";
                        }
                      }
                    }}
                  />
                  <View style={styles.dateContainer}>
                    <TextInput
                      ref={input1Ref}
                      placeholder="MM"
                      keyboardType="numeric"
                      maxLength={2}
                      onChangeText={(text) => {
                        if (text.length === 2) {
                          setDataM(text);
                          focusNextInput(input2Ref);
                        }
                      }}
                      style={[
                        styles.dateInput,
                        { borderColor: theme.borderColor },
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
                    <Text>{`/`}</Text>
                    <TextInput
                      ref={input2Ref}
                      placeholder="YY"
                      keyboardType="numeric"
                      maxLength={2}
                      onChangeText={(text) =>
                        handleInputChange("date", dataM + "/" + text)
                      }
                      style={[
                        styles.dateInput,
                        { borderColor: theme.borderColor },
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
                  </View>
                  <TextInput
                    placeholder={translation.addForm.bankOwnerName}
                    value={itemData.owner}
                    onChangeText={(text) => handleInputChange("owner", text)}
                    style={[
                      styles.textInput,
                      { borderColor: theme.borderColor },
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
                  <TextInput
                    placeholder="CVC2/CVV2"
                    value={itemData.cv}
                    onChangeText={(text) => handleInputChange("cv", text)}
                    secureTextEntry
                    style={[
                      styles.textInput,
                      { borderColor: theme.borderColor },
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
                    onPress={toggleAdditionalFields}
                    style={[
                      styles.additionalInfoBtn,
                      { marginBottom: isAdditionalFieldsVisible ? 0 : 50 },
                    ]}
                  >
                    <Text style={styles.textButton}>
                      {translation.addForm.bankAddInfo}
                    </Text>
                    {isAdditionalFieldsVisible === true && (
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
                    {isAdditionalFieldsVisible === false && (
                      <Svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          ...styles.arrow,
                          transform: [{ rotate: "90deg" }],
                        }}
                      >
                        <Path
                          d="M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z"
                          fill="#6c757d"
                        />
                      </Svg>
                    )}
                  </TouchableOpacity>
                </>
              )}

            {isAdditionalFieldsVisible && (
              <>
                <TextInput
                  placeholder={translation.addForm.bankName}
                  value={itemData.additionalInfo.bankName}
                  onChangeText={(text) => handleInputChange("bankName", text)}
                  style={[
                    styles.textInput,
                    { marginTop: 0, borderColor: theme.borderColor },
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

                <TextInput
                  placeholder={translation.addForm.bankTel}
                  value={itemData.additionalInfo.bankTel}
                  onChangeText={(text) => handleInputChange("bankTel", text)}
                  style={[styles.textInput, { borderColor: theme.borderColor }]}
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
                  placeholder={translation.addForm.bankMailAdress}
                  value={itemData.additionalInfo.mailAdress}
                  onChangeText={(text) => handleInputChange("mailAdress", text)}
                  style={[
                    styles.textInput,
                    { marginBottom: 50, borderColor: theme.borderColor },
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
              </>
            )}
          </View>
        </ScrollView>
      </View>
      <TouchableOpacity
        onPress={handleAdd}
        style={[styles.addBtn, { backgroundColor: theme.btnColor.primary }]}
      >
        <Text style={{ color: "white" }}>{translation.addForm.addBtn}</Text>
      </TouchableOpacity>
      {isNewCategoryFormVisible && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={isNewCategoryFormVisible}
          onRequestClose={toggleNewCategoryForm}
          style={{
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 100,
            backgroundColor: theme.bg.backgroundColor,
          }}
        >
          <View
            style={[
              styles.modalHeader,
              {
                backgroundColor: theme.bg.darkColor,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <TouchableOpacity
              onPress={toggleNewCategoryForm}
              style={styles.closeBtn}
              activeOpacity={1}
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
          <NewCategoryForm
            onClose={toggleNewCategoryForm}
            theme={theme}
          ></NewCategoryForm>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "start",
    width: screenWidth,
    maxWidth: 800,
  },
  addBtn: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: screenWidth,
    maxWidth: 740,
  },
  dropdownBtnChildStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  dropdownBtnImage: { width: 40, height: 30, resizeMode: "cover" },
  dropdownBtnTxt: {
    color: "#444",
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
    marginRight: "auto",
  },
  dropdownRowChildStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  dropdownRowImage: { width: 30, height: 30, resizeMode: "cover" },
  dropdownRowTxt: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginHorizontal: 12,
    height: 50,
    lineHeight: 50,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingVertical: 15,
  },
  dropDownRowStyle: {},

  select: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 5,
    width: "90%",
    height: 50,
    marginTop: 20,
    paddingLeft: 20,
    alignItems: "left",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  option: {
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    marginTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    maxHeight: 50,
    borderStyle: "solid",
  },

  optionImage: { width: 35, height: 35, resizeMode: "contain", marginLeft: 30 },
  modalContainer: {
    position: "relative",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    height: 70,
    alignItems: "center",
    padding: 10,
  },
  searchInput: {
    borderBottomWidth: 1,
    borderStyle: "solid",
    padding: 0,
    width: "90%",
  },
  textInput: {
    width: "90%",
    marginTop: 20,
    borderBottomWidth: 1,
    borderStyle: "solid",
    paddingTop: 20,
    paddingHorizontal: 5,
    alignSelf: "center",
  },
  absoluteInput: {
    position: "absolute",
    top: -70,
    width: "70%",
    marginTop: 20,
    marginLeft: 20,
    paddingTop: 10,
    paddingHorizontal: 5,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 40,
    marginRight: "auto",
    marginLeft: 15,
  },
  dateInput: {
    borderBottomWidth: 1,
    borderStyle: "solid",
    paddingHorizontal: 5,
  },
  numberInput: {
    width: "90%",
    marginTop: 20,
    borderBottomWidth: 1,
    borderStyle: "solid",
    paddingTop: 20,
    paddingHorizontal: 5,
  },
  additionalInfoBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: 20,
    marginTop: 40,
  },
  textButton: {
    color: "#6b97b4",
    fontWeight: "bold",
    opacity: 0.7,
  },
  arrow: {
    marginTop: 0,
    marginLeft: 5,
  },
  newCategoryBtn: {
    width: "100%",
    height: 51,
    alignItems: "center",
    justifyContent: "center",
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderStyle: "solid",
    padding: 10,
  },
  closeBtn: {
    width: 40,
    height: 40,
    marginLeft: "auto",
    zIndex: 100,
  },
});
export default AboutScreen;
