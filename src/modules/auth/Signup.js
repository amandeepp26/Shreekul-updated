import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "../navigation/styles";
import RNSTextInput from "../../components/RNSTextInput";
import { colors, fonts } from "../../styles";
import SelectDropdown from "react-native-select-dropdown";
import DatePicker from "react-native-datepicker";
import Button from "../../components/Button";
import { Icon } from "react-native-elements";
import { CheckBox } from "react-native-elements";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import * as ImagePicker from "react-native-image-picker";

import { Image } from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import {
  requestSignupOtp,
  setDob,
  setEmail,
  setGender,
  setImage,
  setName,
  setPhoneNumber,
  setReferalId,
} from "./signin";
import Toast from "react-native-toast-message";
import ImageResizer from "react-native-image-resizer";
import apiClient from "../../utils/apiClient";
import { setAuthData } from "./session";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRoute } from "@react-navigation/native";

GoogleSignin.configure({
  webClientId:
    "960152802121-5s5p8975k1r48fu4fc6722ctsmilhhna.apps.googleusercontent.com",
});
export default function Signup({ navigation }) {
  const [selectedItem, setSelectedItem] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isMaleSelected, setIsMaleSelected] = useState(false);
  const [isFemaleSelected, setIsFemaleSelected] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const phone_number = useSelector((state) => state.signin.phone_number);
  const name = useSelector((state) => state.signin.name);
  const email = useSelector((state) => state.signin.email);
  const dob = useSelector((state) => state.signin.dob);
  const gender = useSelector((state) => state.signin.gender);
  const image = useSelector((state) => state.signin.profile_pic);
  const loading = useSelector((state) => state.signin.loading);

  const dispatch = useDispatch();
  const route = useRoute();

  useEffect(() => {
    // Extracting the id from the route.params
    if (route.params) {
      const { id } = route.params;
      dispatch(setReferalId(id));
      // Now, 'id' contains the value passed in the navigation
      console.log("ID from URI:", id);
    } else {
      dispatch(setReferalId(null));
    }
    // Add any additional logic you need with the id parameter
  }, [route.params]);
  const handlePicker = (date) => {
    if (dob == "") {
      dispatch(setDob(dob));
    }
    setIsVisible(false);
    console.warn(date);
    dispatch(setDob(moment(date).format("YYYY-MM-DD")));
  };
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
        dispatch(
          setAuthData(response.accessToken || response.token, response.user)
        );
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
  const isEmptyField = !name || !dob || !gender || !phone_number;

  if (isEmptyField) {
    Toast.show({
      text1: "All fields are required",
      type: "error",
    });
  } else if (!/^[A-Za-z\s]+$/.test(name)) {
    Toast.show({
      text1: "Please enter a valid name containing only letters and spaces",
      type: "error",
    });
  } else if (!/^[6-9]\d{9}$/.test(phone_number)) {
    Toast.show({
      text1: "Please enter a valid 10-digit phone number",
      type: "error",
    });
  } else if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    Toast.show({
      text1: "Please enter a valid email address",
      type: "error",
    });
  } else {
    dispatch(
      requestSignupOtp(function () {
        navigation.navigate("SignupOtp");
      })
    );
  }
};

  //function to launch gallery
  const gallery = () => {
    let options = {
      title: "Select Image",
      customButtons: [],
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
      quality: 0.3,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log("Response = ", response);
      if (response.didCancel) {
        console.log("User cancelled image picker");
        // alert('User cancelled image picker');
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
        // alert('ImagePicker Error: ' + response.error);
      } else {
        // Resize the image here
        const { uri } = response.assets[0];

        ImageResizer.createResizedImage(uri, 800, 600, "JPEG", 80)
          .then((resizedImage) => {
            dispatch(setImage(resizedImage.uri));
            setModalVisible(false);
            console.warn("Resized image:", resizedImage.uri);
          })
          .catch((err) => {
            console.error("Image resize error:", err);
          });
      }
    });
  };

  const camera = () => {
    let options = {
      title: "Select Image",
      customButtons: [],
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
      quality: 0.3,
    };

    ImagePicker.launchCamera(options, (response) => {
      console.log("Response = ", response);
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        // Resize the image here
        const { uri } = response.assets[0];

        ImageResizer.createResizedImage(uri, 800, 600, "JPEG", 60)
          .then((resizedImage) => {
            console.log("Resized image:", resizedImage.uri);
            // Make sure 'dispatch' and 'setModalVisible' work as expected
            dispatch(setImage(resizedImage.uri));
            setModalVisible(false);
          })
          .catch((err) => {
            console.error("Image resize error:", err);
          });
      }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView>
        <View style={style.container}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Icon
              name="person-add-outline"
              type="ionicon"
              color={colors.black}
              size={30}
            />
            <Text
              style={[
                styles.h1,
                { textAlign: "center", fontSize: 26, paddingLeft: 10 },
              ]}
            >
              Create New Account
            </Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              width: 100,
              height: 100,
              borderRadius: 50,
              alignSelf: "center",
              marginTop: 10,
              borderColor: colors.grey,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {image == null ? (
              <Icon
                name="person-outline"
                type="ionicons"
                size={35}
                color={colors.primaryBlue}
              />
            ) : (
              <Image
                source={{ uri: image }}
                style={{ height: "100%", width: "100%", borderRadius: 50 }}
              />
            )}
            <Pressable
              onPress={() => setModalVisible(true)}
              style={{
                position: "absolute",
                backgroundColor: "#696969",
                padding: 7,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
                bottom: -5,
                right: -5,
              }}
            >
              <Icon
                name="create-outline"
                type="ionicon"
                size={15}
                color={colors.white}
              />
            </Pressable>
          </View>
          <Modal isVisible={isModalVisible}>
            <View style={style.modalContainer}>
              <Pressable
                onPress={(e) => {
                  camera();
                }}
                style={{
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Icon name="camera-outline" type="ionicon" size={20} />
                <Text
                  style={[
                    styles.h5,
                    { color: "#000", fontWeight: "100", marginLeft: 15 },
                  ]}
                >
                  Take from camera...
                </Text>
              </Pressable>
              <Pressable
                onPress={(e) => {
                  gallery();
                }}
                style={{
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Icon name="folder-outline" type="ionicon" size={20} />
                <Text
                  style={[
                    styles.h5,
                    { color: "#000", fontWeight: "100", marginLeft: 15 },
                  ]}
                >
                  Choose from Library...
                </Text>
              </Pressable>
              <Pressable
                onPress={(e) => {
                  setModalVisible(!isModalVisible);
                }}
                style={{
                  alignSelf: "flex-end",
                  right: 15,
                  top: 10,
                  marginBottom: 10,
                }}
              >
                <Text style={[styles.h6, { color: "red" }]}>Cancel</Text>
              </Pressable>
            </View>
          </Modal>
          <View style={{ width: "100%", paddingTop: 15 }}>
            <Text
              style={[styles.h6, { paddingBottom: 10, color: colors.black }]}
            >
              Full Name
            </Text>
            <RNSTextInput
              placeHolder={"Enter your Full Name"}
              onChangeText={(e) => dispatch(setName(e))}
              value={name}
            />
          </View>

          <View style={{ width: "100%", paddingTop: 15 }}>
            <Text
              style={[styles.h6, { paddingBottom: 10, color: colors.black }]}
            >
              Email address
            </Text>
            <RNSTextInput
              placeHolder={"Enter your Email Address"}
              onChangeText={(e) => dispatch(setEmail(e))}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={{ width: "100%", paddingTop: 15 }}>
            <Text
              style={[styles.h6, { paddingBottom: 10, color: colors.black }]}
            >
              Mobile Number
            </Text>
            <RNSTextInput
              placeHolder={"Enter your Mobile Number"}
              keyboard={"numeric"}
              onChangeText={(e) => dispatch(setPhoneNumber(e))}
              value={phone_number}
              maxLength={10}
            />
          </View>

          <Pressable
            onPress={() => setIsVisible(true)}
            style={{ width: "100%", paddingTop: 15 }}
          >
            <Text
              style={[styles.h6, { paddingBottom: 10, color: colors.black }]}
            >
              Date of Birth
            </Text>
            <Pressable
              onPress={() => setIsVisible(true)}
              style={{
                width: "100%",
                borderRadius: 10,
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#d3d3d3",
                paddingHorizontal: 15,
                paddingRight: 50,
                fontSize: 14,
                paddingVertical: 15,
                color: colors.gray,
                fontFamily: fonts.primaryRegular,
                alignSelf: "center",
                // alignItems:"center",
                // justifyContent:"center",
              }}
            >
              <Text
                style={{
                  color: colors.gray,
                  fontFamily: fonts.primaryRegular,
                }}
              >
                {dob != "" ? dob : "Enter Date of birth"}
              </Text>
              <View style={{ position: "absolute", right: 10, bottom: 10 }}>
                <Icon
                  name="calendar-outline"
                  type="ionicon"
                  color={"#696969"}
                />
              </View>
            </Pressable>
          </Pressable>
          <DateTimePicker
            isVisible={isVisible}
            mode={"date"}
            is24Hour={false}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
            onConfirm={handlePicker}
            onCancel={() => setIsVisible(false)}
            timeZoneOffsetInMinutes={0}
          />
          <View style={{ width: "100%", paddingTop: 15 }}>
            <Text
              style={[styles.h6, { paddingBottom: 10, color: colors.black }]}
            >
              Gender
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <CheckBox
                title="Male"
                checked={gender == "Male"}
                containerStyle={{
                  backgroundColor: "#fff",
                  borderWidth: 0,
                  flex: 1,
                  marginRight: 10,
                }}
                // textStyle={{ color: gender == "Male" ? "#fff" : colors.gray }}
                checkedColor={
                  gender == "Male" ? colors.black : colors.primaryBlue
                }
                onPress={() => {
                  if (gender == "" || "Female") {
                    dispatch(setGender("Male"));
                  } else {
                    setGender("");
                  }
                }}
              />
              <CheckBox
                title="Female"
                checked={gender == "Female"}
                containerStyle={{
                  backgroundColor: colors.white,
                  borderWidth: 0,
                  flex: 1,
                  marginLeft: 10,
                }}
                // textStyle={{
                //   color: gender == "Female" ? colors.white : colors.gray,
                // }}
                checkedColor={gender == "Female" ? colors.black : colors.pink}
                onPress={() => {
                  if (gender == "" || "Male") {
                    dispatch(setGender("Female"));
                  } else {
                    setGender("");
                  }
                }}
              />
            </View>
          </View>
          {/* <View style={{width: '100%', paddingTop: 20}}>
          <CheckBox
            title="Love to help in Senior Care"
            containerStyle={{
              backgroundColor: '#fff',
              padding: 10,
              borderWidth: 0,
            }}
          />
          <CheckBox
            title="Senior Care Assistance Require"
            containerStyle={{
              backgroundColor: '#fff',
              padding: 10,
              borderWidth: 0,
            }}
          />
        </View> */}
          {loading ? (
            <Button load={true} backgroundColor={colors.primaryColor} />
          ) : (
            <Button
              text={"Register"}
              backgroundColor={colors.primaryColor}
              color={false}
              onpress={() => sendOtp()}
            />
          )}
          <View style={{ width: "95%", alignSelf: "center", marginTop: 20 }}>
            <Pressable
              style={{
                marginTop: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.primaryColor,
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
                    marginLeft: 20,
                    fontWeight: 600,
                    color: colors.primaryColor,
                    fontFamily: fonts.primaryMedium,
                  },
                ]}
              >
                Sign up with Google
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "start",
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingVertical: 20,
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
