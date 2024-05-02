import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../styles";
import styles from "../navigation/styles";
import Button from "../../components/Button";
import { Icon } from "react-native-elements";
import { useRoute } from "@react-navigation/native";
import MatrimonyCard from "./components/MatrimonyCard";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "../../utils/apiClient";
import MatrimonyTabs from "../navigation/TopTabs";

export default function Shortlist({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={style.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="chevron-back-outline" type="ionicon" size={20} />
          </Pressable>
          
        </View>
        <MatrimonyTabs />
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  circle: {
    height: 220,
    width: 200,
    backgroundColor: "#f5d142",
    borderRadius: 70,
    position: "absolute",
    top: -100,
    left: -70,
  },
  pricingText: {
    fontSize: 70,
    fontWeight: "600",
    paddingTop: 35,
  },
  infoText: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
  },
});
