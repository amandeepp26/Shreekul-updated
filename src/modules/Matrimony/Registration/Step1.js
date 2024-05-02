import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import SearchableDropdown from "react-native-searchable-dropdown";
import RNSTextInput from "../../../components/RNSTextInput";
import styles from "../../navigation/styles";
import { colors,fonts } from "../../../styles";
import * as ImagePicker from "react-native-image-picker";
import Modal from "react-native-modal";
import { Icon, CheckBox } from "react-native-elements";
import { useSelector,useDispatch } from "react-redux";
import Button from "../../../components/Button";
import ImageResizer from "react-native-image-resizer";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import { setDob,setGender } from "../../auth/signin";
import Toast from "react-native-toast-message";
import apiClient from "../../../utils/apiClient";

export default function Step1({ personalDetails, updatePersonalDetails }) {

  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const dob = useSelector((state) => state.signin.dob);
  // const gender = useSelector((state) => state.signin.gender);
  const [isVisible, setIsVisible] = useState(false);
  const [isTimeVisible, setIsTimeVisible] = useState(false);
  const [countryData, setCountrydata] = useState([]);
  const [statesData, setStatesdata] = useState([]);
  const [citiesData, setCitiesdata] = useState([]);
  const complexionOptions = ["Fair", "Medium", "Olive", "Dark", "Other"];
  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const spectaclesOptions = ["Yes", "No"];
  const educationOptions = [
    "High School",
    "Associate Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Ph.D.",
    "Other",
  ];
  const zodiacSigns = [
    "Aries | मेष",
    "Taurus | वृष",
    "Gemini | मिथुन",
    "Cancer | कर्कट",
    "Leo | सिंह",
    "Virgo | कन्या",
    "Libra | तुला",
    "Scorpio | वृश्चिक",
    "Sagittarius | धनु",
    "Capricorn | मकर",
    "Aquarius | कुम्भ",
    "Pisces | मीन",
  ];
  const heightOptions = [];
    for (let feet = 4; feet <= 7; feet++) {
      for (let inches = 0; inches <= 11; inches++) {
        heightOptions.push(`${feet}'${inches}"`);
      }
    }
    console.warn('profile',personalDetails)
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
            updatePersonalDetails("profile_image", {
              uri: resizedImage.uri,
              type: "image/jpeg",
              name: "profile.jpg",
            });
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

        ImageResizer.createResizedImage(uri, 800, 600, "JPEG", 80)
          .then((resizedImage) => {
            console.log("Resized image:", resizedImage.uri);
            // Make sure 'dispatch' and 'setModalVisible' work as expected

            updatePersonalDetails("profile_image", {
              uri: resizedImage.uri,
              type: "image/jpeg",
              name: "profile.jpg",
            });
            setModalVisible(false);
          })
          .catch((err) => {
            console.error("Image resize error:", err);
          });
      }
    });
  };

    const handlePicker = (date) => {
      console.warn("datyeis---->", date);
      if (dob == "") {
        dispatch(setDob(dob));
      }
      setIsVisible(false);
      console.warn(date);
      dispatch(setDob(moment(date).format("YYYY-MM-DD")));
      updatePersonalDetails(moment(date).format("YYYY-MM-DD"));
    };

      const handleTimePicker = (e) => {
        setIsTimeVisible(false);
        console.warn(e);
        updatePersonalDetails("birth_time",moment(e).format("hh:mm A"));
      };

        const getBirthTimeDate = () => {
          if (personalDetails.birth_time) {
            const [hours, minutes] = personalDetails.birth_time.split(":").map(Number);
            return new Date(2000, 0, 1, hours, minutes); // Create a new date object with dummy date (2000-01-01) and selected time
          }
          return new Date(); // Return current date if birthTime is not set
        };

    function cmToFeetAndInches(cm) {
      const totalInches = cm / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return `${feet}'${inches}"`;
    }

    function feetAndInchesToCm(height) {
      const [feetStr, inchesStr] = height.split("'");
      const feet = parseInt(feetStr);
      const inches = parseInt(inchesStr.replace('"', ""));
      const totalInches = feet * 12 + inches;
      const cm = totalInches * 2.54;
      // return cm;
      updatePersonalDetails('height',cm)
  }

      useEffect(()=>{
        getCountry();
        fetchStates('IN');
      },[])

          const getCountry = async () => {
            try {
              const response = await apiClient.get(
                apiClient.Urls.getCountries,
                {}
              );

                console.warn("country are=====>", response);
              if (response.success) {
                console.warn("country are=====>", response.data);
                setCountrydata(response.data);
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

          const handleCountrySelect = (selectedItem) => {
            updatePersonalDetails('country',selectedItem)
            const selectedCountry = countryData.find(
              (country) => country.name === selectedItem
            );
            if (selectedCountry) {
              const { iso2 } = selectedCountry;
              fetchStates(iso2);
            } else {
              console.log("Selected country not found in countryData");
            }
          };

          // country dropdown data api call
          const fetchStates = async (e) => {
            try {
              const response = await apiClient.get(
                `${apiClient.Urls.getCountries}/${e}/states`,
                {}
              );
              if (response.success) {
                console.warn("country are=====>", response.data);
                setStatesdata(response.data);
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

          const handleStateSelect = (selectedItem) => {
              updatePersonalDetails('state',selectedItem)
            const selectedCountry = countryData.find((e) => e.name === personalDetails.country);

            const selectedState = statesData.find(
              (state) => state.name === selectedItem
            );

            if (selectedState && selectedCountry) {
              const { iso2 } = selectedCountry;
              const { state_code } = selectedState;
              fetchCities(iso2, state_code);
            } else {
              console.log("Selected country not found in countryData");
            }
          };

          // country dropdown data api call
          const fetchCities = async (a, b) => {
            try {
              const response = await apiClient.get(
                `${apiClient.Urls.getCountries}/${a}/states/${b}/cities`,
                {}
              );
              if (response.success) {
                console.warn("cities are=====>", response.data);
                setCitiesdata(response.data);
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

    const countryNames = countryData.map((country) => country.name);
    const stateNames = statesData.map((state) => state.name);
    const cityNames = citiesData.map((city) => city.name);
  return (
    <ScrollView>
      <View style={style.container}>
        <View
          style={{
            borderWidth: 1,
            width: "100%",
            height: 200,
            borderRadius: 10,
            alignSelf: "center",
            marginTop: 10,
            borderColor: colors.grey,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {personalDetails.profile_image.uri == null ||
          personalDetails.profile_image.uri == "" ? (
            <View style={{ width: "60%" }}>
              <Icon
                name="person-outline"
                type="ionicons"
                size={35}
                color={colors.primaryBlue}
              />
              <Button
                backgroundColor={colors.primaryColor}
                text={"Upload"}
                onpress={() => setModalVisible(true)}
              />
            </View>
          ) : (
            <View style={{ flex: 1, width: "100%" }}>
              <Image
                source={{ uri: personalDetails.profile_image.uri }}
                resizeMode="contain"
                style={{ height: "100%", width: "100%", borderRadius: 5 }}
              />

              <Pressable
                onPress={() => setModalVisible(true)}
                style={{
                  position: "absolute",
                  backgroundColor: "#fff",
                  padding: 7,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  top: 5,
                  right: 5,
                }}
              >
                <Icon
                  name="create-outline"
                  type="ionicon"
                  size={15}
                  color={colors.black}
                />
              </Pressable>
            </View>
          )}
        </View>
        <Modal isVisible={isModalVisible}>
          <View style={style.modalContainer}>
            <Pressable
              onPress={(e) => {
                camera();
              }}
              style={{ padding: 15 }}
            >
              <Text
                style={[
                  styles.h5,
                  { color: "#000", fontWeight: "100", marginTop: 0 },
                ]}
              >
                Take from camera...
              </Text>
            </Pressable>
            <Pressable
              onPress={(e) => {
                gallery();
              }}
              style={{ padding: 15 }}
            >
              <Text
                style={[
                  styles.h5,
                  { color: "#000", fontWeight: "100", marginTop: -10 },
                ]}
              >
                Choose from Library...
              </Text>
            </Pressable>
            <Pressable
              onPress={(e) => {
                setModalVisible(!isModalVisible);
              }}
              style={{ alignSelf: "flex-end", right: 15, top: 10 }}
            >
              <Text style={[styles.h6, { color: "red" }]}>Cancel</Text>
            </Pressable>
          </View>
        </Modal>

        <View
          style={{
            width: "100%",
            paddingTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={[styles.h6, { color: colors.black }]}>Gender *</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "80%",
              justifyContent: "space-between",
            }}
          >
            <CheckBox
              title="Male"
              checked={personalDetails.gender == "Male"}
              containerStyle={{
                backgroundColor: "#fff",
                borderWidth: 0,
                flex: 1,
                marginRight: 10,
              }}
              // textStyle={{ color: gender == "Male" ? "#fff" : colors.gray }}
              checkedColor={
                personalDetails.gender == "Male"
                  ? colors.black
                  : colors.primaryBlue
              }
              onPress={() => {
                if (personalDetails.gender == "" || "Female") {
                  dispatch(setGender("Male"));
                  updatePersonalDetails("gender", "Male");
                } else {
                  setGender("");
                  updatePersonalDetails("gender", "");
                }
              }}
            />
            <CheckBox
              title="Female"
              checked={personalDetails.gender == "Female"}
              containerStyle={{
                backgroundColor: colors.white,
                borderWidth: 0,
                flex: 1,
                marginLeft: 10,
              }}
              // textStyle={{
              //   color: gender == "Female" ? colors.white : colors.gray,
              // }}
              checkedColor={
                personalDetails.gender == "Female" ? colors.black : colors.pink
              }
              onPress={() => {
                if (personalDetails.gender == "" || "Male") {
                  dispatch(setGender("Female"));
                  updatePersonalDetails("gender", "Female");
                } else {
                  setGender("");
                  updatePersonalDetails("gender", "");
                }
              }}
            />
          </View>
        </View>
        <View style={style.row}>
          <Pressable
            onPress={() => setIsVisible(true)}
            style={{ width: "47%" }}
          >
            <Text
              style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
            >
              Birth Date *
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
                paddingVertical: 13,
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
              <View style={{ position: "absolute", right: 10, bottom: 12 }}>
                <Icon
                  name="calendar-outline"
                  type="ionicon"
                  color={"#696969"}
                  size={20}
                />
              </View>
            </Pressable>
          </Pressable>

          <DateTimePicker
            isVisible={isVisible}
            mode={"date"}
            is24Hour={false}
            maximumDate={new Date()}
            date={dob ? new Date(dob) : new Date()}
            // minimumDate={new Date()}
            onConfirm={handlePicker}
            onCancel={() => setIsVisible(false)}
          />
          <Pressable
            onPress={() => setIsTimeVisible(true)}
            style={{ width: "47%" }}
          >
            <Text
              style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
            >
              Birth Time *
            </Text>
            <Pressable
              onPress={() => setIsTimeVisible(true)}
              style={{
                width: "100%",
                borderRadius: 10,
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#d3d3d3",
                paddingHorizontal: 15,
                paddingRight: 50,
                fontSize: 14,
                paddingVertical: 13,
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
                {personalDetails.birth_time != ""
                  ? personalDetails.birth_time
                  : "Birth time"}
              </Text>
              <View style={{ position: "absolute", right: 10, bottom: 12 }}>
                <Icon
                  name="time-outline"
                  type="ionicon"
                  color={"#696969"}
                  size={20}
                />
              </View>
            </Pressable>
          </Pressable>

          <DateTimePicker
            isVisible={isTimeVisible}
            mode="time"
            // date={getBirthTimeDate()}
            onConfirm={handleTimePicker}
            onCancel={() => setIsTimeVisible(false)}
          />
        </View>
        <View style={style.row}>
          <View style={{ width: "47%" }}>
            <Text
              style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
            >
              Birth Place
            </Text>
            <RNSTextInput
              placeHolder={"Enter Birth Place"}
              onChangeText={(text) =>
                updatePersonalDetails("birth_place", text)
              }
              value={personalDetails.birth_place}
            />
          </View>
          <View style={{ width: "47%" }}>
            <Text
              style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
            >
              Complexion
            </Text>
            <SelectDropdown
              data={complexionOptions}
              buttonStyle={style.dropdownText}
              defaultValue={personalDetails.complexion}
              buttonTextStyle={style.placeholder}
              onSelect={(selectedItem) =>
                updatePersonalDetails("complexion", selectedItem)
              }
              buttonTextAfterSelection={(selectedItem, index) => selectedItem}
              dropdownStyle={{ borderRadius: 10 }}
              rowTextStyle={{
                left: 10,
                position: "absolute",
                fontSize: 15,
              }}
              rowTextForSelection={(item, index) => item}
              defaultButtonText="Complexion"
            />
          </View>
        </View>
        <View style={style.row}>
          <View style={{ width: "47%" }}>
            <Text
              style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
            >
              Blood Group
            </Text>
            <SelectDropdown
              data={bloodGroupOptions}
              defaultValue={personalDetails.bloodgroup}
              buttonStyle={style.dropdownText}
              buttonTextStyle={style.placeholder}
              onSelect={(selectedItem) =>
                updatePersonalDetails("bloodgroup", selectedItem)
              }
              buttonTextAfterSelection={(selectedItem, index) => selectedItem}
              dropdownStyle={{ borderRadius: 10 }}
              rowTextStyle={{
                left: 10,
                position: "absolute",
                fontSize: 15,
              }}
              rowTextForSelection={(item, index) => item}
              defaultButtonText="Blood Group"
            />
          </View>
          <View style={{ width: "47%" }}>
            <Text
              style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
            >
              Spectacles
            </Text>
            <SelectDropdown
              data={spectaclesOptions}
              defaultValue={personalDetails.spectacles}
              buttonStyle={style.dropdownText}
              buttonTextStyle={style.placeholder}
              onSelect={(selectedItem) =>
                updatePersonalDetails("spectacles", selectedItem)
              }
              buttonTextAfterSelection={(selectedItem, index) => selectedItem}
              dropdownStyle={{ borderRadius: 10 }}
              rowTextStyle={{
                left: 10,
                position: "absolute",
                fontSize: 15,
              }}
              rowTextForSelection={(item, index) => item}
              defaultButtonText="Spectacles"
            />
          </View>
        </View>
        <View style={style.row}>
          <View style={{ width: "47%" }}>
            <Text
              style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
            >
              Height *
            </Text>
            <SelectDropdown
              data={heightOptions}
              buttonStyle={style.dropdownText}
              defaultValue={cmToFeetAndInches(personalDetails.height)}
              buttonTextStyle={style.placeholder}
              onSelect={(selectedItem) => feetAndInchesToCm(selectedItem)}
              buttonTextAfterSelection={(selectedItem, index) => selectedItem}
              dropdownStyle={{ borderRadius: 10 }}
              rowTextStyle={{
                left: 10,
                position: "absolute",
                fontSize: 15,
              }}
              rowTextForSelection={(item, index) => item}
              defaultButtonText="Select Height"
            />
          </View>
          <View style={{ width: "47%" }}>
            <Text
              style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
            >
              Weight (kg)
            </Text>
            <RNSTextInput
              placeHolder={"Enter your Weight"}
              keyboard={"numeric"}
              onChangeText={(text) => updatePersonalDetails("weight", text)}
              value={personalDetails.weight}
            />
          </View>
        </View>

        <View style={{ paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Zodiac
          </Text>
          <SelectDropdown
            data={zodiacSigns}
            defaultValue={personalDetails.zodiac}
            buttonStyle={style.dropdownText}
            buttonTextStyle={style.placeholder}
            onSelect={(selectedItem) =>
              updatePersonalDetails("zodiac", selectedItem)
            }
            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
            dropdownStyle={{ borderRadius: 10 }}
            rowTextStyle={{
              left: 10,
              position: "absolute",
              fontSize: 15,
            }}
            rowTextForSelection={(item, index) => item}
            defaultButtonText="Select zodiac sign"
          />
        </View>

        <View style={{ paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Education *
          </Text>
          <SelectDropdown
            data={educationOptions}
            defaultValue={personalDetails.highest_education}
            buttonStyle={style.dropdownText}
            buttonTextStyle={style.placeholder}
            onSelect={(selectedItem) =>
              updatePersonalDetails("highest_education", selectedItem)
            }
            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
            dropdownStyle={{ borderRadius: 10 }}
            rowTextStyle={{
              left: 10,
              position: "absolute",
              fontSize: 15,
            }}
            rowTextForSelection={(item, index) => item}
            defaultButtonText="Select Education"
          />
        </View>
        <View style={{ width: "100%", paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Education Detail
          </Text>
          <RNSTextInput
            placeHolder={"Enter your education detail"}
            onChangeText={(text) =>
              updatePersonalDetails("education_detail", text)
            }
            value={personalDetails.education_detail}
          />
        </View>
        <View style={{ width: "100%", paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Special Information about yourself
          </Text>
          <RNSTextInput
            placeHolder={"Enter special information "}
            onChangeText={(text) => updatePersonalDetails("special_info", text)}
            value={personalDetails.special_info}
            multiline={true}
          />
        </View>

        <View style={{ paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 5, color: colors.black }]}>
            Hobbies
          </Text>
          <Text
            style={[
              styles.p,
              { paddingBottom: 10, fontSize: 11, color: colors.gray },
            ]}
          >
            Enter multiple hobbies separated by comma.
          </Text>
          <RNSTextInput
            placeHolder={"Enter Hobbies"}
            onChangeText={(text) => updatePersonalDetails("hobbies", text)}
            value={personalDetails.hobbies}
            multiline={true}
          />
        </View>
        <View style={{ width: "100%", paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Address *
          </Text>
          <RNSTextInput
            placeHolder={"Enter your Address"}
            onChangeText={(text) => updatePersonalDetails("address", text)}
            value={personalDetails.address}
            multiline={true}
          />
        </View>
        {countryData.length > 0 && (
          <>
            <View style={style.row}>
              <View style={{ width: "47%" }}>
                <Text
                  style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
                >
                  Country
                </Text>
                <SelectDropdown
                  data={countryNames}
                  buttonStyle={style.dropdownText}
                  defaultValue={personalDetails.country}
                  buttonTextStyle={style.placeholder}
                  onSelect={(selectedItem) => handleCountrySelect(selectedItem)}
                  buttonTextAfterSelection={(selectedItem, index) =>
                    selectedItem
                  }
                  dropdownStyle={{ borderRadius: 10 }}
                  rowTextStyle={{
                    left: 10,
                    position: "absolute",
                    fontSize: 15,
                  }}
                  rowTextForSelection={(item, index) => item}
                  defaultButtonText="Select Country"
                />
              </View>
              <View style={{ width: "47%" }}>
                <Text
                  style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
                >
                  State
                </Text>
                <SelectDropdown
                  data={stateNames}
                  defaultValue={personalDetails.state}
                  buttonStyle={style.dropdownText}
                  buttonTextStyle={style.placeholder}
                  onSelect={(selectedItem) => handleStateSelect(selectedItem)}
                  buttonTextAfterSelection={(selectedItem, index) =>
                    selectedItem
                  }
                  dropdownStyle={{ borderRadius: 10 }}
                  rowTextStyle={{
                    left: 10,
                    position: "absolute",
                    fontSize: 15,
                  }}
                  rowTextForSelection={(item, index) => item}
                  defaultButtonText="Select State"
                />
              </View>
            </View>

            <View style={style.row}>
              <View style={{ width: "47%" }}>
                <Text
                  style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
                >
                  City
                </Text>
                <SelectDropdown
                  data={cityNames}
                  defaultValue={personalDetails.city}
                  buttonStyle={style.dropdownText}
                  buttonTextStyle={style.placeholder}
                  onSelect={(selectedItem) =>
                    updatePersonalDetails("city", selectedItem)
                  }
                  buttonTextAfterSelection={(selectedItem, index) =>
                    selectedItem
                  }
                  dropdownStyle={{ borderRadius: 10 }}
                  rowTextStyle={{
                    left: 10,
                    position: "absolute",
                    fontSize: 15,
                  }}
                  rowTextForSelection={(item, index) => item}
                  defaultButtonText="Select City"
                />
              </View>
              <View style={{ width: "47%" }}>
                <Text
                  style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
                >
                  Pin code
                </Text>
                <RNSTextInput
                  placeHolder={"Enter pin code"}
                  onChangeText={(e) => updatePersonalDetails("pincode", e)}
                  value={personalDetails.pincode}
                  keyboard={"numeric"}
                />
              </View>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
});
