import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import SelectDropdown from "react-native-select-dropdown";
import styles from "../../navigation/styles";
import RNSTextInput from "../../../components/RNSTextInput";
import { colors, fonts } from "../../../styles";
import apiClient from "../../../utils/apiClient";
import Toast from "react-native-toast-message";

export default function Step2({ familyDetails, updateFamilyDetails }) {
  const [cast, setCast] = useState([]);
  const [subCast, setSubCast] = useState([]);
  const [castResponse, setCastResponse] = useState(null);
  const familyTypeOptions = ["Joint Family", "Nuclear Family", "Others"];
  const casteReligionOptions = [
    "Hindu",
    // "Muslim",
    // "Christian",
    // "Sikh",
    // Add more caste options as needed
  ];

  useEffect(() => {
    if (familyDetails.religion == "Hindu") {
      getCast();
    } else {
      setCast(["Others"]);
      setSubCast(["Others"]);
      updateFamilyDetails("cast", "");
      updateFamilyDetails("sub_cast", "");
    }
  }, [familyDetails.religion, familyDetails.cast]);

  const getCast = async () => {
    try {
      const response = await apiClient.get(apiClient.Urls.getCasts, {});
      console.warn("Cast response is", response);
      if (response.success) {
        const keys = response.allCastes.map((key) => key.casteName);
        setCast(keys);
        setCastResponse(response.allCastes);
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
  const handleCastSelection = (selectedItem) => {
    if (familyDetails.religion == "Hindu") {
      const selectedCast = castResponse.find(
        (cast) => cast.casteName === selectedItem
      );
      setSubCast(selectedCast ? selectedCast.subcastes : []);
      updateFamilyDetails("cast", selectedItem);
    } else {
      updateFamilyDetails("cast", selectedItem);
    }
  };
  return (
    <ScrollView>
      <View style={style.container}>
        <View style={{ width: "100%", paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Father's Name
          </Text>
          <RNSTextInput
            placeHolder={"Enter Your Father Name"}
            onChangeText={(e) => updateFamilyDetails("father_name", e)}
            value={familyDetails.father_name}
          />
        </View>
        <View style={{ width: "100%", paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Father's Occupation
          </Text>
          <RNSTextInput
            placeHolder={"Enter Your Fathers Occupation"}
            onChangeText={(e) => updateFamilyDetails("occupation", e)}
            value={familyDetails.occupation}
          />
        </View>
        <View style={{ width: "100%", paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Annual Income
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center"}}>
            <Text style={{ top:11,left:10,zIndex:999, position:'absolute', color: colors.gray,fontSize:17 }}>
              ₹
              </Text>
            <View style={{width:"100%"}}>
          <RNSTextInput
            placeHolder={"Enter annual income"}
            icon={true}
            onChangeText={(e) => updateFamilyDetails("annual_income", e)}
            value={familyDetails.annual_income}
            keyboard={"numeric"}
          />
          </View>
          </View>
        </View>
        <View style={{ width: "100%", paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Phone Number
          </Text>
          <RNSTextInput
            placeHolder={"Enter phone number"}
            onChangeText={(e) => updateFamilyDetails("phone", e)}
            value={familyDetails.phone}
            maxLength={10}
            keyboard={"numeric"}
          />
        </View>
        <View style={{ paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Select Religion
          </Text>
          <SelectDropdown
            data={casteReligionOptions}
            defaultValue={familyDetails.religion}
            buttonStyle={[style.dropdownText, { width: "100%"}]}
            buttonTextStyle={style.placeholder}
            onSelect={(selectedItem) => {
              updateFamilyDetails("religion", selectedItem);
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
            defaultButtonText="Select Religion"
          />
        </View>
        <View style={{ paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Select Cast
          </Text>
          <SelectDropdown
            data={cast}
            defaultValue={familyDetails.cast}
            buttonStyle={[style.dropdownText, { width: "100%" }]}
            buttonTextStyle={style.placeholder}
            onSelect={(selectedItem) => {
              handleCastSelection(selectedItem);
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
            defaultButtonText="Select Cast"
          />
        </View>
        <View style={{ paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Select Sub-Cast
          </Text>
          <SelectDropdown
            data={subCast}
            defaultValue={familyDetails.sub_cast}
            buttonStyle={[style.dropdownText, { width: "100%" }]}
            buttonTextStyle={style.placeholder}
            onSelect={(selectedItem) => {
              updateFamilyDetails("sub_cast", selectedItem);
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
            defaultButtonText="Select sub-cast"
          />
        </View>
        <View style={{ paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Sisters
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ width: "48%" }}>
              <RNSTextInput
                placeHolder={"Married"}
                keyboard={"numeric"}
                maxLength={2}
                onChangeText={(e) =>
                  updateFamilyDetails("sister_marriage_status", e)
                }
                value={familyDetails.sister_marriage_status}
              />
            </View>
            <View style={{ width: "48%" }}>
              <RNSTextInput
                placeHolder={"Unmarried"}
                keyboard={"numeric"}
                maxLength={2}
                onChangeText={(e) =>
                  updateFamilyDetails("sister_unmarried_status", e)
                }
                value={familyDetails.sister_unmarried_status}
              />
            </View>
          </View>
        </View>
        <View style={{ paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Brothers
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ width: "48%" }}>
              <RNSTextInput
                placeHolder={"Married"}
                keyboard={"numeric"}
                maxLength={2}
                onChangeText={(e) =>
                  updateFamilyDetails("brother_marriage_status", e)
                }
                value={familyDetails.brother_marriage_status}
              />
            </View>
            <View style={{ width: "48%" }}>
              <RNSTextInput
                placeHolder={"Unmarried"}
                keyboard={"numeric"}
                maxLength={2}
                onChangeText={(e) =>
                  updateFamilyDetails("brother_unmarried_status", e)
                }
                value={familyDetails.brother_unmarried_status}
              />
            </View>
          </View>
        </View>
        <View style={{ paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Family Type
          </Text>
          <SelectDropdown
            data={familyTypeOptions}
            defaultValue={familyDetails.family_type}
            buttonStyle={[style.dropdownText, { width: "100%" }]}
            buttonTextStyle={style.placeholder}
            onSelect={(selectedItem) => {
              updateFamilyDetails("family_type", selectedItem);
            }}
            // dropdownStyle={{alignItems: 'center',backgroundColor:'red', justifyContent: 'center'}}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text to show after item is selected
              return selectedItem;
            }}
            dropdownStyle={{ borderRadius: 10 }}
            rowTextStyle={{
              left: 10,
              position: "absolute",
              fontSize:15
            }}
            rowTextForSelection={(item, index) => {
              // text to show for each item in the dropdown
              return item;
            }}
            defaultButtonText="Select Family Type"
          />
        </View>
        <View style={{ width: "100%", paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Native Place
          </Text>
          <RNSTextInput
            placeHolder={"Enter Native Place"}
            onChangeText={(e) => updateFamilyDetails("village_name", e)}
            value={familyDetails.village_name}
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
  dropdownText: {
    fontSize: 12,
    color: "gray",
    textAlign: "left",
    backgroundColor: "#fff",
    width: "47%",
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
