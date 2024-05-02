//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { colors, fonts } from "../styles";
import { Icon } from "react-native-elements";

// create a component
const RNSTextInput = ({
  label,
  value,
  placeHolder,
  isSecure,
  onChangeText,
  icon,
  image,
  tintColor,
  keyboard,
  ...props
}) => {
  return (
    <View>
      <TextInput
        style={[style.textinput, { paddingLeft: icon ? 30 : 10 }]}
        placeholder={placeHolder}
        value={value}
        keyboardType={keyboard}
        onChangeText={onChangeText}
        placeholderTextColor={colors.darkGray}
        {...props}
      />
      <Pressable style={style.icon}>
        <Image
          source={image}
          style={{ height: 22, width: 22, tintColor: { tintColor } }}
        />
      </Pressable>
    </View>
  );
};

// define your styles
const style = StyleSheet.create({
  icon: {
    position: "absolute",
    right: 15,
    top: 10,
  },

  textinput: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d3d3d3",
    paddingHorizontal: 15,
    // paddingRight: 50,
    fontSize: 14,
    paddingVertical: 10,
    color: colors.gray,
    fontFamily: fonts.primaryRegular,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});

//make this component available to the app
export default RNSTextInput;
