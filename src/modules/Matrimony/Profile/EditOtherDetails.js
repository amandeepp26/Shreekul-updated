import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import React, { useState,useEffect } from "react";
import RNSTextInput from "../../../components/RNSTextInput";
import { colors, fonts } from "../../../styles";
import SelectDropdown from "react-native-select-dropdown";
import DatePicker from "react-native-datepicker";
import Button from "../../../components/Button";
import { Icon } from "react-native-elements";
import { CheckBox } from "react-native-elements";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import * as ImagePicker from "react-native-image-picker";

import { Image } from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import { requestSignupOtp, setDob, setEmail, setGender, setImage, setName, setPhoneNumber } from "../auth/signin";
import Toast from "react-native-toast-message";
import apiClient from "../../../utils/apiClient";
import { getProfile } from "../../../redux/Matrimony/Search";
import styles from "../../navigation/styles";

export default function EditOtherDetails({ navigation }) {
    const userId = useSelector(state => state.session.profile.matrimony_registration?._id);
    const dispatch = useDispatch();
    const token = useSelector(state => state.session.authToken);
    const profile = useSelector(state => state.session.profile.matrimony_registration);
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [nadiOptions, setNadiOptions] = useState([]);
    const [nakshatraOptions, setNakshatraOptions] = useState([]);
    const [ganaOptions, setGanaOptions] = useState([]);

  console.warn('profile is----->',profile.nadi);
    const [additionalDetails, setAdditionalDetails] = useState({
        birth_place: profile.birth_place,
        birth_time: profile.birth_time,
        manglik: profile.manglik,
        nadi: profile.nadi,
        nakshatra: profile.nakshatra,
        gana: profile.gana,
        marital_status: profile.marital_status
    })
    const handlePicker = (e) => {
        setIsVisible(false);
        console.warn(e);
        setAdditionalDetails({
            ...additionalDetails,
            birth_time: moment(e).format("hh:mm A")
        });
    };
    const mangalikOptions = ['Yes', 'No', 'Don\'t Know'];
    const maritalStatusOptions = [
        "Single",
        "Married",
        "Divorced",
        "Widowed",
        "Separated",
        "In a relationship",
        "Engaged",
        "Other",
        // Add more options as needed
    ];
    const updateProfile = async () => {
        setLoading(true);
        
        try {
            const response = await apiClient.post(`${apiClient.Urls.editMatrimonyProfile}/${userId}`, {
            ...additionalDetails
            }, true);
            console.warn(response)
            if (response.user) {
                dispatch(getProfile(token));
                navigation.navigate('Profile');
                setLoading(false);
            } else {
                Toast.show({
                    text1: response.message || e || 'Something went wrong!',
                    type: 'error',
                });
                setLoading(false)
            }
        } catch (e) {
            Toast.show({
                text1: e.message || e || 'Something went wrong!',
                type: 'error',
            });
        }
    };

  useEffect(() => {
    getNadi();
    getNakshatra();
    getGana();
  }, []);

    const getNadi = async () => {
      try {
        const response = await apiClient.get(apiClient.Urls.getNadi, {});
        if (response.success) {
          const keys = response.getNadi.map((nadi) => nadi.key);
          setNadiOptions(keys);
        } else {
          Toast.show({
            text1: response.message || "Something went wrong!",
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
    const getNakshatra = async () => {
      try {
        const response = await apiClient.get(apiClient.Urls.getNakshatra, {});
        if (response.success) {
          const keys = response.getList.map((e) => e.key);
          setNakshatraOptions(keys);
        } else {
          Toast.show({
            text1: response.message || "Something went wrong!",
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
    const getGana = async () => {
      try {
        const response = await apiClient.get(apiClient.Urls.getGana, {});
        if (response.success) {
          const keys = response.getList.map((e) => e.key);
          setGanaOptions(keys);
        } else {
          Toast.show({
            text1: response.message || "Something went wrong!",
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

    return (
      <View style={style.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="chevron-back-outline" type="ionicon" size={20} />
          </Pressable>
          <Text style={[styles.h4, { marginLeft: 10 }]}>Other Details</Text>
        </View>
        <ScrollView>
          <View
            style={[
              style.container,
              { paddingHorizontal: 25, paddingBottom: 20 },
            ]}
          >
            <View style={{ width: "100%", paddingTop: 10 }}>
              <Text
                style={[styles.h6, { paddingBottom: 10, color: colors.gray }]}
              >
                Birth Place
              </Text>
              <RNSTextInput
                placeHolder={"Enter Your Birth Place"}
                onChangeText={(e) =>
                  setAdditionalDetails({ ...additionalDetails, birth_place: e })
                }
                value={additionalDetails.birth_place}
              />
            </View>
            <Pressable
              onPress={() => setIsVisible(true)}
              style={{ width: "100%", paddingTop: 20 }}
            >
              <Text
                style={[styles.h6, { paddingBottom: 10, color: colors.gray }]}
              >
                Enter Time of Birth
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
                  {additionalDetails.birth_time != ""
                    ? additionalDetails.birth_time
                    : "Enter time of birth"}
                </Text>
                <View style={{ position: "absolute", right: 10, bottom: 10 }}>
                  <Icon name="time-outline" type="ionicon" color={"#696969"} />
                </View>
              </Pressable>
            </Pressable>
            <DateTimePicker
              isVisible={isVisible}
              mode={"time"}
              is24Hour={false}
              // minimumDate={new Date()}
              onConfirm={handlePicker}
              onCancel={() => setIsVisible(false)}
            />
            <View style={{ paddingTop: 20 }}>
              <Text
                style={[styles.h6, { paddingBottom: 10, color: colors.gray }]}
              >
                Manglik
              </Text>
              <SelectDropdown
                data={mangalikOptions}
                defaultValue={additionalDetails.manglik}
                buttonStyle={[style.dropdownText, { width: "100%" }]}
                buttonTextStyle={style.placeholder}
                onSelect={(selectedItem) => {
                  setAdditionalDetails({
                    ...additionalDetails,
                    manglik: selectedItem,
                  });
                }}
                // dropdownStyle={{alignItems: 'center',backgroundColor:'red', justifyContent: 'center'}}
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text to show after item is selected
                  return selectedItem;
                }}
                dropdownStyle={{ borderRadius: 10 }}
                rowTextStyle={{
                  textAlign: "left",
                  padding: 10,
                }}
                rowTextForSelection={(item, index) => {
                  // text to show for each item in the dropdown
                  return item;
                }}
                defaultButtonText="Manglik"
              />
            </View>
            <View
              style={{
                width: "100%",
                paddingTop: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "45%" }}>
                <Text
                  style={[styles.h6, { paddingBottom: 10, color: colors.gray }]}
                >
                  Nadi
                </Text>
                {/* <RNSTextInput
                                placeHolder={'Nadi'}
                                onChangeText={e => setAdditionalDetails({...additionalDetails,nadi: e})}
                                value={additionalDetails.nadi}
                            /> */}
                <SelectDropdown
                  data={nadiOptions}
                  defaultValue={additionalDetails.nadi}
                  buttonStyle={[style.dropdownText, { width: "100%" }]}
                  buttonTextStyle={style.placeholder}
                  onSelect={(selectedItem) => {
                    setAdditionalDetails({
                      ...additionalDetails,
                      nadi: selectedItem,
                    });
                  }}
                  // dropdownStyle={{alignItems: 'center',backgroundColor:'red', justifyContent: 'center'}}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    // text to show after item is selected
                    return selectedItem;
                  }}
                  dropdownStyle={{ borderRadius: 10 }}
                  rowTextStyle={{
                    textAlign: "left",
                    padding: 10,
                  }}
                  rowTextForSelection={(item, index) => {
                    // text to show for each item in the dropdown
                    return item;
                  }}
                  defaultButtonText="Nadi"
                />
              </View>
              <View style={{ width: "45%" }}>
                <Text
                  style={[styles.h6, { paddingBottom: 10, color: colors.gray }]}
                >
                  Nakshatra
                </Text>
                {/* <RNSTextInput
                  placeHolder={"Nakshatra"}
                  onChangeText={(e) =>
                    setAdditionalDetails({ ...additionalDetails, nakshatra: e })
                  }
                  value={additionalDetails.nakshatra}
                /> */}
                <SelectDropdown
                  data={nakshatraOptions}
                  defaultValue={additionalDetails.nakshatra}
                  buttonStyle={[style.dropdownText, { width: "100%" }]}
                  buttonTextStyle={style.placeholder}
                  onSelect={(selectedItem) => {
                    setAdditionalDetails({
                      ...additionalDetails,
                      nakshatra: selectedItem,
                    });
                  }}
                  // dropdownStyle={{alignItems: 'center',backgroundColor:'red', justifyContent: 'center'}}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    // text to show after item is selected
                    return selectedItem;
                  }}
                  dropdownStyle={{ borderRadius: 10 }}
                  rowTextStyle={{
                    textAlign: "left",
                    padding: 10,
                  }}
                  rowTextForSelection={(item, index) => {
                    // text to show for each item in the dropdown
                    return item;
                  }}
                  defaultButtonText="Nakshatra"
                />
              </View>
            </View>
            <View style={{ width: "100%", paddingTop: 10 }}>
              <Text
                style={[styles.h6, { paddingBottom: 10, color: colors.gray }]}
              >
                Gana
              </Text>
              {/* <RNSTextInput
                placeHolder={"Gana"}
                onChangeText={(e) =>
                  setAdditionalDetails({ ...additionalDetails, gana: e })
                }
                value={additionalDetails.gana}
              /> */}
              <SelectDropdown
                data={ganaOptions}
                defaultValue={additionalDetails.gana}
                buttonStyle={[style.dropdownText, { width: "100%" }]}
                buttonTextStyle={style.placeholder}
                onSelect={(selectedItem) => {
                  setAdditionalDetails({ ...additionalDetails, gana: selectedItem });
                }}
                // dropdownStyle={{alignItems: 'center',backgroundColor:'red', justifyContent: 'center'}}
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text to show after item is selected
                  return selectedItem;
                }}
                dropdownStyle={{ borderRadius: 10 }}
                rowTextStyle={{
                  textAlign: "left",
                  padding: 10,
                }}
                rowTextForSelection={(item, index) => {
                  // text to show for each item in the dropdown
                  return item;
                }}
                defaultButtonText="Gana"
              />
            </View>
            <View style={{ paddingTop: 20 }}>
              <Text
                style={[styles.h6, { paddingBottom: 10, color: colors.gray }]}
              >
                Marital Status
              </Text>
              <SelectDropdown
                data={maritalStatusOptions}
                defaultValue={additionalDetails.marital_status}
                buttonStyle={[style.dropdownText, { width: "100%" }]}
                buttonTextStyle={style.placeholder}
                onSelect={(selectedItem) => {
                  setAdditionalDetails({
                    ...additionalDetails,
                    marital_status: selectedItem,
                  });
                }}
                // dropdownStyle={{alignItems: 'center',backgroundColor:'red', justifyContent: 'center'}}
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text to show after item is selected
                  return selectedItem;
                }}
                dropdownStyle={{ borderRadius: 10 }}
                rowTextStyle={{
                  textAlign: "left",
                  padding: 10,
                }}
                rowTextForSelection={(item, index) => {
                  // text to show for each item in the dropdown
                  return item;
                }}
                defaultButtonText="Marital Status"
              />
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
                text={"Update"}
                backgroundColor={colors.primaryColor}
                color={false}
                onpress={() => updateProfile()}
              />
            )}
          </View>
        </ScrollView>
      </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "start",
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
