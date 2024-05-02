import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "../navigation/styles";
import { colors } from "../../styles";
import Button from "../../components/Button";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { requestOtp, setOTP, validateMailOtp, validateSignupOtp } from "./signin";
import { useDispatch, useSelector } from "react-redux";

export default function SignupMailVerification({ navigation }) {
  const { otp, loading } = useSelector((state) => state.signin);
  const [resendCounter, setResendCounter] = useState(60); // Set the initial value to 60 seconds
  const [resendDisabled, setResendDisabled] = useState(false);

  // Function to start the countdown
  const startResendCounter = () => {
    setResendDisabled(true);
    let seconds = 60;
    const countdownInterval = setInterval(() => {
      seconds -= 1;
      setResendCounter(seconds);
      if (seconds === 0) {
        clearInterval(countdownInterval);
        setResendDisabled(false);
      }
    }, 1000);
  };

  const handleResendCode = () => {
    dispatch(requestOtp());
    startResendCounter();
  };
  useEffect(() => {
    dispatch(setOTP(otp));
  }, [otp]);
  useEffect(() => {
    if (resendCounter === 0) {
      setResendDisabled(false);
    }
  }, [resendCounter]);

  const dispatch = useDispatch();
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
        <Text style={[styles.h1, { textAlign: "center" }]}>
          Verfiy Your Email
        </Text>
        <Text
          style={[
            styles.h6,
            { paddingBottom: 10, color: colors.gray, textAlign: "center" },
          ]}
        >
          Verification code has been sent to your email.
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
          code={otp}
          onCodeChanged={(e)=>dispatch(setOTP(e))}
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
            onpress={() => dispatch(validateMailOtp())}
          />
        )}
        {resendDisabled ? (
          <Text
            style={[
              styles.h6,
              {
                paddingBottom: 10,
                marginTop: 20,
                alignSelf: "center",
                color: colors.primaryColor,
              },
            ]}
          >
            Try again after {resendCounter} s
          </Text>
        ) : (
          <Text
            onPress={() => handleResendCode()}
            style={[
              styles.h6,
              {
                paddingBottom: 10,
                marginTop: 20,
                alignSelf: "center",
                color: colors.primaryColor,
              },
            ]}
          >
            Resend Code
          </Text>
        )}
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
