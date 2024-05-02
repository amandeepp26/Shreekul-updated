import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "../../navigation/styles";
import RNSTextInput from "../../../components/RNSTextInput";
import { colors, fonts } from "../../../styles";
import SelectDropdown from "react-native-select-dropdown";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Icon } from "react-native-elements";
import moment from "moment";
import Toast from "react-native-toast-message";
import apiClient from "../../../utils/apiClient";

export default function Step4({ additionalDetails, updateAdditionalDetails }) {
  const [annualIncome, setannualIncome] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [occupation, setoccupation] = useState("");
  const [industry, setindustry] = useState("");
  const [partnerPreference, setPartnerPreference] = useState("");
  const [time, setTime] = useState("");
  const [nadiOptions, setNadiOptions] = useState([]);
  const [nakshatraOptions, setNakshatraOptions] = useState([]);
  const [ganaOptions, setGanaOptions] = useState([]);

  const mangalikOptions = ["Yes", "No", "Don't Know"];
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
  useEffect(() => {
    getNadi();
    getNakshatra();
    getGana();
  }, []);
  const getNadi = async () => {
    try {
      const response = await apiClient.get(apiClient.Urls.getNadi, {});

      console.warn("Nadi response is", response);
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

      console.warn("Nakshatra response is", response);
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

      console.warn("Gana response is", response);
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
  const handlePicker = (e) => {
    setIsVisible(false);
    console.warn(e);
    updateAdditionalDetails("birth_time", moment(e).format("hh:mm A"));
  };
  return (
    <ScrollView>
      <View style={style.container}>
        {/* <View style={{ width: "100%", paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 10, color: colors.gray }]}>
            Birth Place
          </Text>
          <RNSTextInput
            placeHolder={"Enter Your Birth Place"}
            onChangeText={(e) => updateAdditionalDetails("birth_place", e)}
            value={additionalDetails.birth_place}
          />
        </View>
        <Pressable
          onPress={() => setIsVisible(true)}
          style={{ width: "100%", paddingTop: 20 }}
        >
          <Text style={[styles.h6, { paddingBottom: 10, color: colors.gray }]}>
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
        /> */}
        <View style={style.row}>
          <View style={{ width: "47%" }}>
            <Text
              style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
            >
              Mangalik
            </Text>
            <SelectDropdown
              data={mangalikOptions}
              defaultValue={additionalDetails.manglik}
              buttonStyle={[style.dropdownText, { width: "100%" }]}
              buttonTextStyle={style.placeholder}
              onSelect={(selectedItem) => {
                updateAdditionalDetails("manglik", selectedItem);
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
                fontSize:15
              }}
              rowTextForSelection={(item, index) => {
                // text to show for each item in the dropdown
                return item;
              }}
              defaultButtonText="Mangalik"
            />
          </View>
          <View style={{ width: "47%" }}>
            <Text
              style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
            >
              Gana
            </Text>
            <SelectDropdown
              data={ganaOptions}
              defaultValue={additionalDetails.gana}
              buttonStyle={[style.dropdownText, { width: "100%" }]}
              buttonTextStyle={style.placeholder}
              onSelect={(selectedItem) => {
                updateAdditionalDetails("gana", selectedItem);
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
                fontSize:15
              }}
              rowTextForSelection={(item, index) => {
                // text to show for each item in the dropdown
                return item;
              }}
              defaultButtonText="Gana"
            />
          </View>
        </View>
        <View style={style.row}>
          <View style={{ width: "47%" }}>
            <Text
              style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
            >
              Nadi
            </Text>
            <SelectDropdown
              data={nadiOptions}
              defaultValue={additionalDetails.nadi}
              buttonStyle={[style.dropdownText, { width: "100%" }]}
              buttonTextStyle={style.placeholder}
              onSelect={(selectedItem) => {
                updateAdditionalDetails("nadi", selectedItem);
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
                fontSize:15
              }}
              rowTextForSelection={(item, index) => {
                // text to show for each item in the dropdown
                return item;
              }}
              defaultButtonText="Nadi"
            />
          </View>
          <View style={{ width: "47%" }}>
            <Text
              style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
            >
              Nakshatra
            </Text>
            <SelectDropdown
              data={nakshatraOptions}
              defaultValue={additionalDetails.nakshatra}
              buttonStyle={[style.dropdownText, { width: "100%" }]}
              buttonTextStyle={style.placeholder}
              onSelect={(selectedItem) => {
                updateAdditionalDetails("nakshatra", selectedItem);
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
                fontSize:15
              }}
              rowTextForSelection={(item, index) => {
                // text to show for each item in the dropdown
                return item;
              }}
              defaultButtonText="Nakshatra"
            />
          </View>
        </View>
        <View style={{ paddingTop: 15 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Marital Status
          </Text>
          <SelectDropdown
            data={maritalStatusOptions}
            defaultValue={additionalDetails.marital_status}
            buttonStyle={[style.dropdownText, { width: "100%" }]}
            buttonTextStyle={style.placeholder}
            onSelect={(selectedItem) => {
              updateAdditionalDetails("marital_status", selectedItem);
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
              fontSize:15
            }}
            rowTextForSelection={(item, index) => {
              // text to show for each item in the dropdown
              return item;
            }}
            defaultButtonText="Marital Status"
          />
        </View>
        <View style={{ width: "100%", paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Partner Preference
          </Text>
          <RNSTextInput
            placeHolder={"Enter Partner Preference"}
            onChangeText={(e) =>
              updateAdditionalDetails("partner_preferences", e)
            }
            value={additionalDetails.partner_preferences}
            multiline={true} // This allows multiple lines for description
          />
        </View>
      </View>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // width:'400'
    // paddingHorizontal: 25,
    // paddingVertical: 20,
  },
  row: {
    width: "100%",
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: 12,
    color: "gray",
    textAlign: "left",
    backgroundColor: "#fff",
    width: "100%",
    height:47,
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 10,
  },
  placeholder: {
    fontSize: 14,
    textAlign: "left",
    color: "gray",
  },
});
