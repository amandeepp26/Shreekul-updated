//import liraries
import React, { Component, useId, useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, SafeAreaView, TouchableOpacity, Platform } from "react-native";
import styles from "../navigation/styles";
import RNSTextInput from "../../components/RNSTextInput";
import Button from "../../components/Button";
import { colors, fonts } from "../../styles";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import signin, { setPhoneNumber, requestOtp, setEmail } from "./signin";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Icon } from "react-native-elements";
import { setAuthData } from "./session";
import apiClient from "../../utils/apiClient";

GoogleSignin.configure({
  webClientId:
    "960152802121-5s5p8975k1r48fu4fc6722ctsmilhhna.apps.googleusercontent.com",
});
// create a component
const Login = ({ navigation }) => {
  const phone_number = useSelector((state) => state.signin.phone_number);
  const email = useSelector((state) => state.signin.email);
  const [inputType, setInputType] = useState("phone");
  const loading = useSelector((state) => state.signin.loading);
  const dispatch = useDispatch();

  const googleSignInButton = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("user info is--->", userInfo);
      googleSignin(userInfo.idToken);
      // dispatch(setAuthData(userInfo.idToken, userInfo.user));
      // setState({ userInfo });
    } catch (error) {
      console.log("error is--->", error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  const googleSignin = async (e) => {
    try {
      const response = await apiClient.post(`${apiClient.Urls.googleSignin}`, {
        idToken: e,
      });
      console.warn(response);
      if (response.success) {
        dispatch(setAuthData(response.accessToken, response.user));
        Toast.show({
          text1: response.message || e || "Added Successfully",
          type: "success",
        });
      } else {
        Toast.show({
          text1: response.message || e || "Something went wrong!",
          type: "error",
        });
      }
    } catch (e) {
      Toast.show({
        text1: e.message || e || "Something went wrong!",
        type: "error",
      });
    }
  };
  const sendOtp = () => {
    // Check if the phone number is empty
    if (inputType === "phone") {
      if (phone_number === "") {
        Toast.show({
          text1: "Please enter a phone number",
          type: "error",
        });
        return null;
      }
      const phoneRegex = /^[6-9]\d{9}$/; // This example assumes a 10-digit number

      if (!phoneRegex.test(phone_number)) {
        Toast.show({
          text1: "Please enter a valid phone number",
          type: "error",
        });
        return null;
      }
    } else {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
        Toast.show({
          text1: "Please enter a valid email address",
          type: "error",
        });
        return null;
      }
    }

    // If the phone number is valid, dispatch the requestOtp action
    dispatch(
      requestOtp(function () {
        navigation.navigate("Otp", {
          phone_number: phone_number,
        });
      })
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={style.container}>
        <View>
          <Image
            source={require("../auth/images/login.png")}
            resizeMode="contain"
            style={{ width: "100%", height: 250 }}
          />
        </View>
        <View>
          <Text style={[styles.h1, { textAlign: "left" }]}>Hello,</Text>
          <Text style={[styles.h1, { textAlign: "left" }]}>Welcome Back!</Text>

          {inputType === "phone" ? (
            <View style={{ width: "100%", paddingTop: 40 }}>
              <Text
                style={[styles.h6, { paddingBottom: 10, color: colors.black }]}
              >
                Phone Number
              </Text>
              <RNSTextInput
                placeHolder={"Enter Your Mobile Number"}
                onChangeText={(e) => dispatch(setPhoneNumber(e))}
                maxLength={10}
                keyboard={"numeric"}
                value={phone_number}
              />
              <Text
                onPress={() => {
                  setInputType("email"), dispatch(setPhoneNumber(""));
                }}
                style={[
                  styles.h6,
                  { color: colors.primaryColor, marginTop: 10 },
                ]}
              >
                Continue with E-mail
              </Text>
            </View>
          ) : (
            <View style={{ width: "100%", paddingTop: 40 }}>
              <Text
                style={[styles.h6, { paddingBottom: 10, color: colors.black }]}
              >
                Email
              </Text>
              <RNSTextInput
                placeHolder={`Enter your Email`}
                keyboardType={"email-address"}
                onChangeText={(e) => dispatch(setEmail(e))}
                value={email}
                autoCapitalize="none"
              />
              <Text
                onPress={() => {
                  setInputType("phone"), dispatch(setEmail(""));
                }}
                style={[
                  styles.h6,
                  { color: colors.primaryColor, marginTop: 10 },
                ]}
              >
                Continue with Phone number
              </Text>
            </View>
          )}

          {/* <Text style={[styles.h6,{paddingTop:40}]}>A 4 digit OTP will be send via SMS to verify your mobile number.</Text> */}
          {loading ? (
            <Button load={true} backgroundColor={colors.primaryColor} />
          ) : (
            <Button
              text={"Login"}
              backgroundColor={colors.primaryColor}
              color={false}
              onpress={() => sendOtp()}
            />
          )}
          <View
            style={{
              paddingTop: 40,
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Text
              style={[styles.h6, { textAlign: "center", color: colors.gray }]}
            >
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={[styles.h6, { color: colors.primaryColor }]}>
                Signup
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: "95%", alignSelf: "center", marginTop: 20 }}>
            <Pressable
              style={{
                marginTop: 20,
                flexDirection: "row",
                alignItems:'center',
                justifyContent:'center',
                borderWidth: 1,
                borderColor:colors.primaryColor,
                paddingHorizontal: 10,
                paddingVertical: 12,
                borderRadius: 50,
                width: "100%",
              }}
              onPress={() => googleSignInButton()}
            >
              <Image
                source={require("./../../../assets/images/google.png")}
                style={{ width: 20, height: 20 }}
              />
              <Text
                style={[
                  styles.p,
                  {
                    fontSize: 16,
                    marginLeft:20,
                    fontWeight: 600,
                    color:  colors.primaryColor ,
                    fontFamily: fonts.primaryMedium,
                  },
                ]}
              >
                Sign in with Google
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// define your styles
const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "start",
    backgroundColor: "#fff",
    paddingHorizontal: 25,
  },
});

//make this component available to the app
export default Login;
