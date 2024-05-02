import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  SafeAreaView,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "../navigation/styles";
import RNSTextInput from "../../components/RNSTextInput";
import { colors, fonts } from "../../styles";
import Button from "../../components/Button";
import { Icon } from "react-native-elements";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import apiClient from "../../utils/apiClient";

export default function ChangeEmail({ navigation }) {
  const userId = useSelector((state) => state.session.profile._id);
  const profile = useSelector((state) => state.session.profile);
  const [loading, setLoading] = useState(false);
  console.warn("profile is", profile);

  const [email, setEmail] = useState(profile.email);
  const [emailValid, setEmailValid] = useState(null);

  // useEffect(()=>{
  //   if(profile.matrimony_registered == "1") {
  //   setPhoneNumber(profile?.matrimony_registration?.phone);
  //   }else{
  //     setPhoneNumber(profile?.phone)
  //   }
  // },[])
  const verify = () => {
    
      if (email == profile.email) {
        Toast.show({
          text1: "Enter a different email to update",
          type: "error",
        });
        return null;
      }
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
        Toast.show({
          text1: "Please enter a valid email address",
          type: "error",
        });
      }
    // If the phone number is valid, dispatch the requestOtp action
    updateProfile();
  };
  const updateProfile = async () => {
    console.warn(email);
    setLoading(true);
    try {
      const response = await apiClient.post(
        `${apiClient.Urls.changePhoneEmailAPi}/${userId}`,
        {
          email: email,
        }
      );
      console.warn("resssssss issss------->", response);
      if (response.success) {
        navigation.navigate("ReverifyOtp", {
          email: email,
        });
        setLoading(false);
        Toast.show({
          text1: "Otp sent successfully",
          type: "success",
        });
      } else {
        Toast.show({
          text1: response.message || e || "Something went wrong!",
          type: "error",
        });
        setLoading(false);
      }
    } catch (e) {
      Toast.show({
        text1: e.message || e || "Something went wrong!",
        type: "error",
      });
    }
  };

  useEffect(() => {
    checkValidation();
  }, [email]);

  const checkValidation = () => {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setEmailValid(false);
    } else {
      setEmailValid(true);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={style.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="chevron-back-outline" type="ionicon" size={20} />
          </Pressable>
          <Text style={[styles.h4, { marginLeft: 10 }]}>
            Change Email
          </Text>
        </View>
       
        <View style={[{ paddingHorizontal: 25, paddingBottom: 20 }]}>
          <View style={{ width: "100%",paddingTop:20 }}>
            <Text
              style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
            >
              Email Address
            </Text>
            <RNSTextInput
              placeHolder={"Enter Your Email Address"}
              onChangeText={(e) => {
                setEmail(e);
              }}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              image={
                emailValid
                  ? require("@images/correct.png")
                  : require("@images/close.png")
              }
            />
          </View>
          {/* <Text
          onPress={() => setOption("phone")}
          style={[styles.h6, { color: colors.primaryColor, marginTop: 10 }]}
        >
          Continue with Mobile Number
        </Text> */}
        </View>

        {loading ? (
          <View style={{ paddingHorizontal: 25, paddingBottom: 50 }}>
            <Button load={true} backgroundColor={colors.primaryColor} />
          </View>
        ) : (
          <View style={{ paddingHorizontal: 25, paddingBottom: 50 }}>
            <Button
              text={"Verify"}
              backgroundColor={colors.primaryColor}
              color={false}
              onpress={() => verify()}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingHorizontal: 25,
    // paddingVertical: 20,
  },
  dropdownText: {
    fontSize: 12,
    color: "gray",
    textAlign: "left",
    backgroundColor: "#fff",
    width: "100%",
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 15,
  },
  placeholder: {
    fontSize: 16,
    textAlign: "left",
    color: "gray",
  },
  // Modal styles
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  modalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalOptionText: {
    fontSize: 18,
  },
});
