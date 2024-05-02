import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  useWindowDimensions,
  SafeAreaView,
} from "react-native";
import { Icon, colors } from "react-native-elements";
import apiClient from "../../utils/apiClient";
import RenderHtml from "react-native-render-html";
import styles from "../navigation/styles";

const AboutUs = ({ navigation }) => {
  const [data, setData] = useState(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await apiClient.get(apiClient.Urls.aboutUs, {});
      console.log("response is--->", response);
      if (response.success) {
        setData(response.content);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:colors.white}} >
    <View style={style.container}>
      {/* Header */}
      <View style={style.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="chevron-back-outline" type="ionicon" size={20} />
        </Pressable>
        <Text style={[styles.h4, { marginLeft: 10 }]}>About Us</Text>
      </View>
      <ScrollView style={style.scrollContainer}>
        <RenderHtml contentWidth={width} source={{ html: data }} />
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  h4: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20, // Adjust the padding based on your design
    paddingVertical: 10, // Adjust the padding based on your design
  },
});

export default AboutUs;
