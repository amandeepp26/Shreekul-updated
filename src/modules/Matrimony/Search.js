import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  ScrollView,
  Pressable,
  SafeAreaView,
} from "react-native";
import React, { useCallback, useState } from "react";
import styles from "../navigation/styles";
import { colors, fonts } from "../../styles";
import { Chip, Icon, Slider } from "react-native-elements";
import SelectDropdown from "react-native-select-dropdown";
import Button from "../../components/Button";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import RNSTextInput from "../../components/RNSTextInput";
import Toast from "react-native-toast-message";
import apiClient from "../../utils/apiClient";
import { useDispatch, useSelector } from "react-redux";
import {
  getMatrimony,
  setAge,
  setComplexion,
  setFilter,
  setHeight,
  setIncomeRange,
  setIsManglikSelected,
  setSelectedEducation,
  setWeightRange,
} from "../../redux/Matrimony/Search";

const data = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];
export default function MatrimonySearch({ navigation }) {
  const userId = useSelector(
    (state) => state.session.profile.matrimony_registration._id
  );
  const loading = useSelector((state) => state.search.loading);
  const height = useSelector((state) => state.search.height);
  const weight = useSelector((state) => state.search.weight);
  const age = useSelector((state) => state.search.age);
  const income = useSelector((state) => state.search.income);
  const isManglikSelected = useSelector(
    (state) => state.search.isManglikSelected
  );
  const complexion = useSelector((state) => state.search.complexion);
  const selectedEducation = useSelector(
    (state) => state.search.selectedEducation
  );

  // console.warn(weight)
  const dispatch = useDispatch();
  const educationOptions = [
    "High School",
    "Associate Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Ph.D.",
    "Other",
  ];

  const searchMatrimony = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(apiClient.Urls.getMatrimonyList, {
        // minAge:ageRange[0],
        // maxAge:ageRange[1],
        // minHeight:height[0],
        // maxHeight:height[1],
        // minWeight:weightRange[0],
        // maxWeight:weightRange[1],
        // minIncome:income[0],
        // maxIncome:income[1],
        // manglik:isManglikSelected,
        // complexion:complexion,
        // education:selectedEducation,
        // location:location
      });
      console.warn(response.data.length);
      if (response.message == "success") {
        const filteredData = response.data
          .filter
          // item => item.family_details && item._id !== userId
          ();

        // Store the filtered data in the state
        // setData(filteredData);
        // console.warn('list is---->',data);
        setLoading(false);
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
      setLoading(false);
    }
  };

  const feetInchesStart = `${Math.floor(height[0] / 30.48)}ft ${Math.round(
    (height[0] % 30.48) / 2.54
  )}in`;
  const feetInchesEnd = `${Math.floor(height[1] / 30.48)}ft ${Math.round(
    (height[1] % 30.48) / 2.54
  )}in`;
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
    <View style={{ flex: 1, backgroundColor:'white',paddingBottom:60 }}>
      <View style={style.header}>
        <Pressable onPress={() => dispatch(setFilter(true))}>
          <Icon name="chevron-back-outline" type="ionicon" size={20} />
        </Pressable>
        <Text style={[styles.h4, { marginLeft: 10 }]}>Search</Text>
      </View>
      <ScrollView>
        <View style={style.container}>
          <Text style={[styles.h1]}>Find the one</Text>
          <Text style={[styles.h6, { color: colors.gray }]}>
            Find the perfect partner who is made for you.
          </Text>
          <View>
            <View style={{ paddingTop: 20 }}>
              <Text
                style={[styles.h6, { paddingBottom: 10, color: colors.gray }]}
              >
                Height
              </Text>
              <Text style={[styles.p]}>
                {feetInchesStart} to {feetInchesEnd}
              </Text>
              <MultiSlider
                isMarkersSeparated={true}
                enabledTwo={true}
                snapped={true}
                showStepLabels
                markerStyle={style.sliderMarker}
                containerStyle={{ marginLeft: 10 }}
                trackStyle={{ height: 3 }}
                values={height}
                sliderLength={Dimensions.get("window").width - 100}
                step={2.54} // 1 inch in centimeters
                min={121.92} // 4ft in centimeters
                max={213.36}
                onValuesChange={(e) => dispatch(setHeight(e))}
              />
            </View>
            {/* Age range */}
            <View style={{ paddingTop: 10 }}>
              <Text
                style={[styles.h6, { paddingBottom: 10, color: colors.gray }]}
              >
                Age
              </Text>
              <Text style={[styles.p]}>
                {age[0]} to {age[1]} years
              </Text>
              <MultiSlider
                isMarkersSeparated={true}
                enabledTwo={true}
                snapped={true}
                showStepLabels
                markerStyle={style.sliderMarker}
                trackStyle={{ height: 3 }}
                containerStyle={{ marginLeft: 10 }}
                values={age}
                sliderLength={Dimensions.get("window").width - 100}
                step={1}
                min={18}
                max={70} // Adjust max age as needed
                onValuesChange={(values) => dispatch(setAge(values))}
              />
            </View>

            {/* Weight Range */}
            <View style={{ paddingTop: 10 }}>
              <Text
                style={[styles.h6, { paddingBottom: 10, color: colors.gray }]}
              >
                Weight (kg)
              </Text>
              <Text style={[styles.p]}>
                {weight[0]} to {weight[1]} kg
              </Text>
              <MultiSlider
                isMarkersSeparated={true}
                enabledTwo={true}
                snapped={true}
                showStepLabels
                containerStyle={{ marginLeft: 10 }}
                markerStyle={style.sliderMarker}
                trackStyle={{ height: 3 }}
                values={weight}
                sliderLength={Dimensions.get("window").width - 100}
                step={1}
                min={30} // Adjust min weight as needed
                max={150} // Adjust max weight as needed
                onValuesChange={(values) => dispatch(setWeightRange(values))}
              />
            </View>

            {/* Income Range */}
            <View style={{ paddingTop: 10 }}>
              <Text
                style={[styles.h6, { paddingBottom: 10, color: colors.gray }]}
              >
                Annual Income (₹)
              </Text>
              <Text style={[styles.p]}>
                ₹{income[0]} to ₹{income[1]}
              </Text>
              <MultiSlider
                isMarkersSeparated={true}
                enabledTwo={true}
                snapped={true}
                showStepLabels
                containerStyle={{ marginLeft: 10 }}
                markerStyle={style.sliderMarker}
                trackStyle={{ height: 3 }}
                values={income}
                sliderLength={Dimensions.get("window").width - 100}
                step={1000} // Adjust the step value as needed
                min={0} // Adjust the min income as needed
                max={5000000} // Adjust the max income as needed
                onValuesChange={(values) => dispatch(setIncomeRange(values))}
              />
            </View>

            <View style={{ width: "100%", paddingTop: 10 }}>
              <Text
                style={[styles.h6, { paddingBottom: 10, color: colors.gray }]}
              >
                Manglik
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Chip
                  title="Yes"
                  containerStyle={{ width: 80 }}
                  onPress={() => {
                    if (isManglikSelected === "yes") {
                      dispatch(setIsManglikSelected(""));
                    } else {
                      dispatch(setIsManglikSelected("yes"));
                    }
                  }}
                  type={isManglikSelected === "yes" ? "solid" : "outline"}
                />
                <Chip
                  title="No"
                  type={isManglikSelected === "no" ? "solid" : "outline"}
                  containerStyle={{ width: 80, marginLeft: 10 }}
                  onPress={() => {
                    if (isManglikSelected === "no") {
                      dispatch(setIsManglikSelected(""));
                    } else {
                      dispatch(setIsManglikSelected("no"));
                    }
                  }}
                />
              </View>
            </View>
            <View style={{ width: "100%", paddingTop: 10 }}>
              <Text
                style={[styles.h6, { paddingBottom: 10, color: colors.gray }]}
              >
                Complexion
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Chip
                  title="Fair"
                  containerStyle={{ width: 80 }}
                  onPress={() => {
                    if (complexion === "Fair") {
                      dispatch(setComplexion(""));
                    } else {
                      dispatch(setComplexion("Fair"));
                    }
                  }}
                  type={complexion === "Fair" ? "solid" : "outline"}
                />
                <Chip
                  title="Dark"
                  type={complexion === "Dark" ? "solid" : "outline"}
                  containerStyle={{ width: 80, marginLeft: 10 }}
                  onPress={() => {
                    if (complexion === "Dark") {
                      dispatch(setComplexion(""));
                    } else {
                      dispatch(setComplexion("Dark"));
                    }
                  }}
                />
              </View>
            </View>

            <View style={{ paddingTop: 10 }}>
              <Text
                style={[styles.h6, { paddingBottom: 10, color: colors.gray }]}
              >
                Education
              </Text>
              <SelectDropdown
                data={educationOptions}
                buttonStyle={style.dropdownText}
                defaultValue={selectedEducation}
                buttonTextStyle={style.placeholder}
                onSelect={(selectedItem) => {
                  dispatch(setSelectedEducation(selectedItem));
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
                }}
                rowTextForSelection={(item, index) => {
                  // text to show for each item in the dropdown
                  return item;
                }}
                defaultButtonText="Select Education/Qualification"
              />
            </View>
            {/* <View style={{ paddingTop: 10 }}>
            <Text style={[styles.h6, { paddingBottom: 10, color: colors.gray }]}>
              Location
            </Text>
            <RNSTextInput
            placeHolder={'Location'}
            onChangeText={e => setLocation(e)}
            value={location}
          />
          </View> */}
          </View>
          {loading ? (
            <Button load={true} backgroundColor={colors.primaryColor} />
          ) : (
            <Button
              onpress={() => {
                 dispatch(getMatrimony(userId));
                 navigation.goBack();
              }}
              text={"Search"}
              backgroundColor={colors.primaryColor}
              color={false}
              
            />
          )}
        </View>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingVertical: 35,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
  sliderMarker: {
    backgroundColor: colors.primaryColor,
    width: 20,
    height: 20,
    borderRadius: 15,
  },
});
