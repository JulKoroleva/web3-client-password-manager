/*
  Links to the repositories from which the imported packages are taken, as well as the name of the license 
  for each package used, are given in the file "license-checker-output.json" (obtained as a result of the 
  command output: "npx license-checker --json > license-checker-output.json"), located in the project root.
  The texts of all licenses used by the imported packages are presented in the "Licenses" directory, also 
  located in the root of this project.
  If the file "LICENSE__<license_name>___<package name>" has no content, then it corresponds to the standard 
  text of the corresponding license.
*/

import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Svg, {
  Circle,
  Polyline,
  Line,
  Path,
  SafeAreaView,
} from "react-native-svg";
import * as Progress from "react-native-progress";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);
const AnimatedLine = Animated.createAnimatedComponent(Line);

const SuccessIcon = () => {
  const circleDashOffset = useRef(new Animated.Value(900)).current;
  const polylineDashOffset = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(circleDashOffset, {
        toValue: 0,
        duration: 900,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(polylineDashOffset, {
        toValue: 0,
        duration: 800,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={{ alignItems: "center" }}>
      <Svg width={50} height={50} viewBox="0 0 130.2 130.2">
        <AnimatedCircle
          class="path circle"
          fill="none"
          stroke="#73AF55"
          strokeWidth={6}
          strokeMiterlimit={10}
          cx="65.1"
          cy="65.1"
          r="62.1"
          strokeDasharray={1000}
          strokeDashoffset={circleDashOffset}
        />
        <AnimatedPolyline
          class="path check"
          fill="none"
          stroke="#73AF55"
          strokeWidth={6}
          strokeLinecap="round"
          strokeMiterlimit={10}
          points="100.2,40.2 51.5,88.8 29.8,67.5"
          strokeDasharray={1000}
          strokeDashoffset={polylineDashOffset}
        />
      </Svg>
    </View>
  );
};

const ErrorIcon = ({ message }) => {
  const { errorMessage } = message !== undefined ? message : "";
  const circleDashOffset = useRef(new Animated.Value(1000)).current;
  const line1DashOffset = useRef(new Animated.Value(1000)).current;
  const line2DashOffset = useRef(new Animated.Value(1000)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(circleDashOffset, {
        toValue: 0,
        duration: 900,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(line1DashOffset, {
        toValue: 0,
        duration: 900,
        easing: Easing.ease,
        useNativeDriver: true,
        delay: 350,
      }),
      Animated.timing(line2DashOffset, {
        toValue: 0,
        duration: 900,
        easing: Easing.ease,
        useNativeDriver: true,
        delay: 350,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
        delay: 300,
      }),
    ]).start();
  }, []);

  const colorizeNumbers = (text) => {
    if (!text || text.trim() === "") {
      return "";
    }

    const regex = /\d+/g;
    const matches = text.match(regex) || [];

    const parts = text.split(regex);
    const hasSlash = text.includes("/");

    return parts.reduce((result, part, index) => {
      result.push(
        <Text key={`part_${index}`} style={{ color: "rgba(0,0,0,0.5)" }}>
          {part}
        </Text>
      );
      if (!text || text.trim() === "") {
        return "";
      }
      if (matches[index]) {
        let numberColor;
        if (hasSlash) {
          numberColor = index % 2 === 0 ? "red" : "green";
        } else {
          numberColor = index === 0 ? "green" : "red";
        }
        result.push(
          <Text key={`number_${index}`} style={{ color: numberColor }}>
            {matches[index]}
          </Text>
        );
      }
      return result;
    }, []);
  };

  return (
    <View style={{ alignItems: "center" }}>
      <Svg width={50} height={50} viewBox="0 0 130.2 130.2">
        <AnimatedCircle
          class="path circle"
          fill="none"
          stroke="#D06079"
          strokeWidth={6}
          strokeMiterlimit={10}
          cx="65.1"
          cy="65.1"
          r="62.1"
          strokeDasharray={1000}
          strokeDashoffset={circleDashOffset}
        />
        <AnimatedLine
          class="path line"
          fill="none"
          stroke="#D06079"
          strokeWidth={6}
          strokeLinecap="round"
          strokeMiterlimit={10}
          x1="34.4"
          y1="37.9"
          x2="95.8"
          y2="92.3"
          strokeDasharray={1000}
          strokeDashoffset={line1DashOffset}
        />
        <AnimatedLine
          class="path line"
          fill="none"
          stroke="#D06079"
          strokeWidth={6}
          strokeLinecap="round"
          strokeMiterlimit={10}
          x1="95.8"
          y1="38"
          x2="34.4"
          y2="92.2"
          strokeDasharray={1000}
          strokeDashoffset={line2DashOffset}
        />
      </Svg>
      {errorMessage !== "" && (
        <Animated.View
          style={{
            opacity: textOpacity,
            position: "absolute",
            bottom: -50,
            width: "60%",
            marginTop: 20,
          }}
        >
          <Text style={{ color: "black", opacity: 0.5, textAlign: "center" }}>
            {colorizeNumbers(errorMessage)}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const ArcLoader = ({ theme }) => {
  let update = 1;
  setInterval(() => {
    update += 1;
  }, 500);
  const circleLength = new Animated.Value(0);
  const circleDashOffset = new Animated.Value(0);
  const maxCircleLength = 2 * Math.PI * 50.1;

  const spinValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  return (
    <View>
      <Animated.View
        style={{
          transform: [{ rotate: spin }],
        }}
      >
        <Svg width={50} height={50} viewBox="0 0 130.2 130.2">
          <Circle
            class="path circle"
            fill="none"
            stroke={theme.activityIndicator}
            strokeWidth={6}
            strokeMiterlimit={10}
            cx="65.1"
            cy="65.1"
            r="62.1"
            strokeDasharray={[maxCircleLength]}
            strokeDashoffset={circleDashOffset}
            strokeLength={circleLength}
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

export default function Loader({ theme, status, message }) {
  const [loaderStatus, setLoaderStatus] = useState(status);
  const [err, setErr] = useState({ message });
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.bg.mainBg,
      }}
    >
      {status === "loading" && <ArcLoader theme={theme} />}
      {/* {status === "loading" &&  <Progress.CircleSnail progress={0} size={53} thickness={2} direction={"clockwise"}duration={800} indeterminate={true} color={theme.activityIndicator}/>} */}
      {status === "success" && <SuccessIcon />}
      {status === "error" && <ErrorIcon message={message} />}
    </View>
  );
}
