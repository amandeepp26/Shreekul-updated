import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "../navigation/styles";
import { colors } from "../../styles";
import Button from "../../components/Button";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import apiClient from "../../utils/apiClient";
import { useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../redux/Matrimony/Search";
import { setAuthData } from "../auth/session";
import { skipNow } from "../auth/signin";

export default function ReverifyOtp({ navigation }) {
  const userId = useSelector((state) => state.session?.profile?._id);
  const token = useSelector((state) => state.session.authToken);
  const route = useRoute();
  const [Otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // Function to start the countdown
  //   const startResendCounter = () => {
  //     setResendDisabled(true);
  //     let seconds = 60;
  //     const countdownInterval = setInterval(() => {
  //       seconds -= 1;
  //       setResendCounter(seconds);
  //       if (seconds === 0) {
  //         clearInterval(countdownInterval);
  //         setResendDisabled(false);
  //       }
  //     }, 1000);
  //   };

  //   const handleResendCode = () => {
  //     dispatch(requestOtp());
  //     startResendCounter();
  //   };

  //   useEffect(() => {
  //     if (resendCounter === 0) {
  //       setResendDisabled(false);
  //     }
  //   }, [resendCounter]);

  //   const dispatch = useDispatch();

  const verify = async () => {
    if (Otp == "") {
      Toast.show({ text1: `Please enter verification code`, type: "error" });
      return;
    }
    try {
      console.warn(apiClient.Urls.changeEmailPhoneVerifyOtp);
      setLoading(true);
      let requestBody = {
        otp: Otp,
      };

      if (route.params.phone) {
        requestBody.phone = parseInt(route.params.phone);
      } else if (route.params.email) {
        requestBody.email = route.params.email;
      }

      const response = await apiClient.post(
        `${apiClient.Urls.changeEmailPhoneVerifyOtp}/${userId}`,
        requestBody
      );

      console.log("Log in---------->", response);

      if (response.success) {
        Toast.show({ text1: "Verified successfully", type: "success" });
        dispatch(getProfile(token));
        navigation.navigate("Menu");
        setLoading(false);
      } else {
        Toast.show({
          text1: response.message || "Something went wrong!",
          type: "error",
        });
        setLoading(false);
      }
    } catch (e) {
      Toast.show({
        text1: e.message || e || "Something went wrong!",
        type: "error",
      });
      setLoading(false);
    }
  };
  return (
    <View style={style.container}>
      <View>
        <Image
          source={require("../auth/images/lock.jpg")}
          resizeMode="contain"
          style={{ width: "100%", height: 200 }}
        />
      </View>
      <View>
        <Text style={[styles.h1, { textAlign: "center" }]}>Please Verify</Text>
        <Text
          style={[
            styles.h6,
            { paddingBottom: 10, color: colors.gray, textAlign: "center" },
          ]}
        >
          Verification code has been sent
        </Text>
        <OTPInputView
          style={{
            width: "70%",
            alignSelf: "center",
            marginTop: 30,
            alignItems: "center",
            justifyContent: "center",
            height: 30,
            marginBottom: 20,
          }}
          pinCount={4}
          autoFocusOnLoad
          keyboardType="number-pad"
          onCodeChanged={(e) => setOTP(e)}
          code={Otp}
          codeInputFieldStyle={style.underlineStyleBase}
          codeInputHighlightStyle={style.underlineStyleHighLighted}
        />
        {loading ? (
          <Button load={true} backgroundColor={colors.primaryColor} />
        ) : (
          <Button
            text={"Verify"}
            backgroundColor={colors.primaryColor}
            color={false}
            onpress={() => verify()}
          />
        )}
        {/* {resendDisabled ?
          <Text
            style={[styles.h6, { paddingBottom: 10, marginTop: 20, alignSelf: 'center', color: colors.primaryColor }]}>
            Try again after {resendCounter} s
          </Text>
          :
          <Text onPress={() => handleResendCode()}
            style={[styles.h6, { paddingBottom: 10, marginTop: 20, alignSelf: 'center', color: colors.primaryColor }]}>
            Resend Code
          </Text>
        } */}
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "start",
    backgroundColor: "#fff",
    paddingHorizontal: 25,
  },
  underlineStyleBase: {
    width: 50,
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: "#FAFCFF",
    borderColor: "#D3DAE6",
    color: colors.black,
    fontFamily: "Poppins-Medium",
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  underlineStyleHighLighted: {
    borderColor: colors.gray,
  },
});
