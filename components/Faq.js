/*
  Links to the repositories from which the imported packages are taken, as well as the name of the license 
  for each package used, are given in the file "license-checker-output.json" (obtained as a result of the 
  command output: "npx license-checker --json > license-checker-output.json"), located in the project root.
  The texts of all licenses used by the imported packages are presented in the "Licenses" directory, also 
  located in the root of this project.
  If the file "LICENSE__<license_name>___<package name>" has no content, then it corresponds to the standard 
  text of the corresponding license.
*/

import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Text,
  Image,
  FlatList,
  Dimensions,
} from "react-native";

import TranslationContext from "../translation/TranslationContext";

const screenWidth = Dimensions.get("window").width;

const Faq = ({ theme }) => {
  const translation = useContext(TranslationContext);
  const stories = translation.stories;
  const [activeIndex, setActiveIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % stories.length);
    }, 60000);

    return () => clearInterval(interval);
  }, [stories.length]);

  useEffect(() => {
    animateProgressBar();
  }, [activeIndex]);

  const animateProgressBar = () => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 60000,
      useNativeDriver: false,
    }).start(() => {
      progressAnim.setValue(0);
    });
  };
  const handlePressIn = (event) => {
    setStartX(event.nativeEvent.locationX);
  };

  const handlePressOut = (event) => {
    const endX = event.nativeEvent.locationX;
    const deltaX = endX - startX;
    const threshold = 20;

    if (deltaX > threshold) {
      setActiveIndex((prevIndex) =>
        prevIndex === 0 ? stories.length - 1 : prevIndex - 1
      );
    } else if (deltaX < -threshold) {
      setActiveIndex((prevIndex) => (prevIndex + 1) % stories.length);
    }
  };
  const handlePress = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % stories.length);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.mainBg }]}>
      <TouchableOpacity
        onPress={handlePressOut}
        style={{
          height: 20,
          position: "absolute",
          width: screenWidth / 4,
          top: 0,
          left: 0,
          height: "100%",
          zIndex: 3000,
        }}
        activeOpacity={1}
      ></TouchableOpacity>

      <TouchableOpacity
        onPress={handlePress}
        style={{
          width: 20,
          height: 20,
          position: "absolute",
          width: screenWidth / 4,
          top: 0,
          right: 0,
          height: "100%",
          zIndex: 3000,
        }}
        activeOpacity={1}
      ></TouchableOpacity>
      <View style={styles.progressContainer}>
        {stories.map((story, index) => (
          <View
            key={index}
            style={[
              styles.progressIndicator,
              index === activeIndex ? styles.activeProgress : null,
            ]}
          >
            {index === activeIndex && (
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressBarWidth,
                  },
                ]}
              />
            )}
          </View>
        ))}
      </View>
      {stories[activeIndex].image && (
        <Image source={stories[activeIndex].image} style={styles.image}></Image>
      )}
      <View
        style={{
          width: "80%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 250,
        }}
      >
        <Text style={styles.description}>{stories[activeIndex].caption}</Text>
        {stories[activeIndex].instruction && (
          <FlatList
            data={stories[activeIndex].instruction}
            renderItem={({ item }) => (
              <Text style={{ marginBottom: 10, textAlign: "justify", height: item.icon ? 45 : ""}}>
                {item.text}
                {item.icon && (
                  <Image
                    source={item.icon}
                    style={{ width: 20, height: 20}}
                    resizeMode="cover"
                  ></Image>
                )}
              </Text>
            )}
            keyExtractor={(item, index) => index.toString()}
            style={styles.instruction}
          />
        )}
        {stories[activeIndex].description && (
          <FlatList
            data={stories[activeIndex].description}
            renderItem={({ item }) => (
              <>
                <Text
                  style={{
                    textAlign: "justify",
                    fontWeight: "bold",
                    color: theme.btnColor.primary,
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    marginBottom: 5,
                    textAlign: "justify",
                    opacity: 0.8,
                  }}
                >
                  {item.text}
                  {item.icon && (
                    <Image
                      source={item.icon}
                      style={{ width: 20, height: 20 }}
                    ></Image>
                  )}
                </Text>
              </>
            )}
            keyExtractor={(item, index) => index.toString()}
            style={[styles.description, { marginTop: 0, height:400}]}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    width: screenWidth,
    maxWidth: 800,
    alignSelf: "center",
  },
  progressContainer: {
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 40,
  },
  progressIndicator: {
    width: "12%",
    height: 5,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
    overflow: "hidden",
    opacity: 0.6,
  },
  activeProgress: {
    backgroundColor: "#ccc",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "grey",
    position: "absolute",
    top: 0,
    left: 0,
  },
  description: {
    width: "100%",
    opacity: 0.5,
    textAlign: "justify",
    fontSize: 13,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 30,
    marginBottom: 20,
  },
  instruction: {
    marginTop: 20,
  },
});

export default Faq;
