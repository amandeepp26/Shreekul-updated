import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from "react-native";
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
import Toast from "react-native-toast-message";
import apiClient from "../../../utils/apiClient";
import { getProfile } from "../../../redux/Matrimony/Search";
import styles from "../../navigation/styles";
import ImageResizer from "react-native-image-resizer";
import { setDob } from "../../auth/signin";

export default function EditMatrimonyProfile({ navigation }) {
  const userId = useSelector(
    (state) => state.session.profile?.matrimony_registration?._id
  );
  const dispatch = useDispatch();
  const token = useSelector((state) => state.session.authToken);
  const profile = useSelector(
    (state) => state.session.profile?.matrimony_registration
  );

  console.warn("Profile==========>>>>>", profile);

  const [isModalVisible, setModalVisible] = useState(false);
  const dob = useSelector((state) => state.signin.dob);
  const [birthTime, setBirthTime] = useState(profile.birth_time);
  const [birthPlace, setBirthPlace] = useState(profile.birth_place);
  const [profession, setProfession] = useState(
    profile.proffessional_details.profession
  );
  const [designation, setDesignation] = useState(
    profile.proffessional_details.designation
  );
  const [company, setCompany] = useState(
    profile.proffessional_details.company_name
  );
  const [workAddress, setWorkAddress] = useState(
    profile.proffessional_details.work_address
  );
  const [workPhone, setWorkPhone] = useState(
    profile.proffessional_details.work_phone
  );
  const [complexion, setComplexion] = useState(profile.complexion);
  const [bloodGroup, setBloodGroup] = useState(profile.bloodgroup);
  const [spectacles, setSpectacles] = useState(profile.spectacles);
  const [zodiac, setZodiac] = useState(profile.zodiac);

  const [nadiOptions, setNadiOptions] = useState([]);
  const [nakshatraOptions, setNakshatraOptions] = useState([]);
  const [ganaOptions, setGanaOptions] = useState([]);

  const [nadi, setNadi] = useState(profile.nadi);
  const [nakshatra, setNakshatra] = useState(profile.nakshatra);
  const [gana, setGana] = useState(profile.gana);
  const [manglik, setManglik] = useState(profile.manglik);
  const [maritalStatus, setMaritalStatus] = useState(profile.marital_status);
  const [partnerExpectation, setpartnerExpectation] = useState(
    profile?.partner_preferences
  );
  const [countryData, setCountrydata] = useState([]);
  const [statesData, setStatesdata] = useState([]);
  const [citiesData, setCitiesdata] = useState([]);

  const [country, setCountry] = useState(profile.country);
  const [state, setState] = useState(profile.state);
  const [city, setCity] = useState(profile.city);
  const [pincode, setPincode] = useState(profile.pincode);

  const [workcountry, setworkCountry] = useState(
    profile.proffessional_details.work_country
  );
  const [workstate, setworkState] = useState(
    profile.proffessional_details.work_state
  );
  const [workcity, setworkCity] = useState(profile.proffessional_details.work_city);
  const [workpincode, setworkPincode] = useState(
    profile.proffessional_details.work_pincode
  );

  const [isVisible, setIsVisible] = useState(false);
  const [isTimeVisible, setIsTimeVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState({
    uri: profile.profile_image,
    type: "image/jpeg", // Set the appropriate MIME type
    name: "profile.jpg", // Set the desired filename
  });
  const [name, setName] = useState(profile.fullname);
  const [address, setAddress] = useState(profile.address);
  const [occupation, setOccupation] = useState(
    profile.proffessional_details?.occupation
  );
  const [selectedItem, setSelectedItem] = useState(profile.highest_education);
  const [industry, setIndustry] = useState(
    profile.proffessional_details?.industry
  );
  const [income, setIncome] = useState(
    profile.proffessional_details?.annual_income
  );
  const [height, setHeight] = useState(profile.height);
  const [education_detail, setEducationDetail] = useState(profile.education_detail);
  const [special_info, setSpecialInfo] = useState(profile.special_info);
  const [countryCode, setCountryCode] = useState('');
  const [weight, setWeight] = useState(profile.weight);
  const [hobbies, setHobbies] = useState(profile.hobbies);


  const updateProfile = async () => {
    setLoading(true);
    const professionalDetailsObject = {
      "proffessional_details[profession]": profession,
      "proffessional_details[designation]": designation,
      "proffessional_details[company_name]": company,
      "proffessional_details[work_address]": workAddress,
      "proffessional_details[work_phone]": workPhone,
      "proffessional_details[work_country]": workcountry,
      "proffessional_details[work_state]": workstate,
      "proffessional_details[work_city]": workcity,
      "proffessional_details[work_pincode]": workpincode,
      "proffessional_details[annual_income]": income,
    };
    
    const data = {
    };
    // Check if image.uri is not empty or null
    if (image.uri && image.uri !== "") {
      data.image = image;
    }
    try {
      const response = await apiClient.post(
        `${apiClient.Urls.editMatrimonyProfile}/${userId}`,
        {
          fullname: name,
          address: address,
          dob: dob,
          ...data,
          highest_education: selectedItem,
          education_detail:education_detail,
          special_info:special_info,
          height: height,
          weight: weight,
          nadi: nadi,
          nakshatra: nakshatra,
          gana: gana,
          complexion: complexion,
          bloodgroup: bloodGroup,
          zodiac: zodiac,
          manglik: manglik,
          birth_place: birthPlace,
          birth_time: birthTime,
          spectacles: spectacles,
          marital_status: maritalStatus,
          partner_preferences: partnerExpectation,
          ...professionalDetailsObject,
        },
        true
      );
      console.warn(response);
      if (response.user) {
        dispatch(getProfile(token));
        navigation.navigate("Menu");
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

  const handlePicker = (date) => {
    console.warn("dateis---->", date);
    if (dob == "") {
      dispatch(setDob(dob));
    }
    setIsVisible(false);
    console.warn(date);
    dispatch(setDob(moment(date).format("YYYY-MM-DD")));
  };

  const handleTimePicker = (e) => {
    setIsTimeVisible(false);
    console.warn(e);
    setBirthTime(moment(e).format("hh:mm A"));
  };
  const educationOptions = [
    "High School",
    "Associate Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Ph.D.",
    "Other",
  ];
  const heightOptions = [];
  for (let feet = 4; feet <= 7; feet++) {
    for (let inches = 0; inches <= 11; inches++) {
      heightOptions.push(`${feet}'${inches}"`);
    }
  }

  function feetAndInchesToCm(height) {
    const [feetStr, inchesStr] = height.split("'");
    const feet = parseInt(feetStr);
    const inches = parseInt(inchesStr.replace('"', ""));
    const totalInches = feet * 12 + inches;
    const cm = totalInches * 2.54;
    // return cm;
    setHeight(cm);
  }

  function cmToFeetAndInches(cm) {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  }

  const complexionOptions = ["Fair", "Medium", "Olive", "Dark", "Other"];
  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const spectaclesOptions = ["Yes", "No"];
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
  ];

  const professionOptions = [
    "Government job",
    "Private job",
    "Business owner",
    "Self-employed",
    "Farmer",
    "Retired",
  ];

  useEffect(() => {
    getNadi();
    getNakshatra();
    getGana();
    getCountry();
  }, []);

  useEffect(()=>{
    handleCountrySelect(country);
  },[countryData])

  useEffect(() => {
      handleStateSelect(state);
  }, [statesData]);

  const getNadi = async () => {
    try {
      const response = await apiClient.get(apiClient.Urls.getNadi, {});
      if (response.success) {
        const keys = response.getNadi.map((nadi) => nadi.key);
        setNadiOptions(keys);
        setNadi(profile.nadi);
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
            setImage({
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
            setImage({
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

  const getBirthTimeDate = () => {
    if (birthTime) {
      const [hours, minutes] = birthTime.split(":").map(Number);
      return new Date(2000, 0, 1, hours, minutes); // Create a new date object with dummy date (2000-01-01) and selected time
    }
    return new Date(); // Return current date if birthTime is not set
  };

  // country dropdown data api call
  const getCountry = async () => {
    try {
      const response = await apiClient.get(apiClient.Urls.getCountries, {});
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

  const handleCountrySelect = async (selectedItem) => {
    setCountry(selectedItem);
    const selectedCountry = await countryData.find(
      (country) => country.name === selectedItem
    );
    if (selectedCountry) {
      const { iso2 } = selectedCountry;
      fetchStates(iso2);
    } else {
      console.log("Selected country not found in countryData");
    }
    // fetchStates(selectedItem);
  };

  const handleWorkCountrySelect = async (selectedItem) => {
    setworkCountry(selectedItem);
    const selectedCountry = await countryData.find(
      (country) => country.name === selectedItem
    );
    if (selectedCountry) {
      const { iso2 } = selectedCountry;
      fetchStates(iso2);
    } else {
      console.log("Selected country not found in countryData");
    }
    // fetchStates(selectedItem);
  };

  // country dropdown data api call
  const fetchStates = async (e) => {
    try {
      const response = await apiClient.get(
        `${apiClient.Urls.getCountries}/${e}/states`,
        {}
      );
      if (response.success) {
        console.warn("states are=====>", response.data);
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
    setState(selectedItem);
    const selectedCountry = countryData.find(
      (e) => e.name === country
    );
    
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

   const handleWorkStateSelect = (selectedItem) => {
     setworkState(selectedItem);
     const selectedCountry = countryData.find((e) => e.name === workcountry);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={style.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="chevron-back-outline" type="ionicon" size={20} />
          </Pressable>
          <Text style={[styles.h4, { marginLeft: 10 }]}>Edit Profile</Text>
        </View>
        <ScrollView>
          <View
            style={[
              style.container,
              { paddingHorizontal: 25, paddingBottom: 20 },
            ]}
          >
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
              {/* {image == null ? (
              <Icon
                name="person-outline"
                type="ionicons"
                size={35}
                color={colors.primaryBlue}
              />
            ) : ( */}
              <Image
                source={{
                  uri: image.uri
                    ? image.uri
                    : "https://www.emmegi.co.uk/wp-content/uploads/2019/01/User-Icon.jpg",
                }}
                style={{ height: "100%", width: "100%", borderRadius: 50 }}
              />
              {/* )} */}
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
            {/* <Text
            style={[
              styles.h5,
              {
                fontWeight: "600",
                fontSize:16,
                color: colors.primaryColor,
                marginTop: 15,
                borderBottomWidth: 1,
                paddingBottom: 8,
                borderColor: "#d3d3d3",
              },
            ]}
          >
            Personal Details :
          </Text> */}
            <View style={[style.row, { marginTop: 10 }]}>
              <View style={{ width: "47%" }}>
                <Text
                  style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
                >
                  Full Name
                </Text>
                <RNSTextInput
                  placeHolder={"Enter your Full Name"}
                  onChangeText={(e) => setName(e)}
                  value={name}
                />
              </View>
              <View style={{ width: "47%" }}>
                <Text
                  style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
                >
                  Birth Place
                </Text>
                <RNSTextInput
                  placeHolder={"Enter Your Birth Place"}
                  onChangeText={(e) => setBirthPlace(e)}
                  value={birthPlace}
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
                    {dob != "" ? dob : "Date of birth"}
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
                date={dob ? new Date(dob) : new Date()}
                maximumDate={new Date()}
                // minimumDate={new Date()}
                onConfirm={handlePicker}
                onCancel={() => setIsVisible(false)}
                // Use custom format for displaying date
                format={"DD/MMM/YYYY"}
                // Use custom date label
                dateLabel={"Date"}
              />

              <Pressable
                onPress={() => setIsTimeVisible(true)}
                style={{ width: "47%" }}
              >
                <Text
                  style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
                >
                  Birth Time
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
                    {birthTime != "" ? birthTime : "Birth time"}
                  </Text>
                  <View style={{ position: "absolute", right: 10, bottom: 10 }}>
                    <Icon
                      name="time-outline"
                      type="ionicon"
                      color={"#696969"}
                    />
                  </View>
                </Pressable>
              </Pressable>
              <DateTimePicker
                isVisible={isTimeVisible}
                mode="time"
                date={getBirthTimeDate()}
                onConfirm={handleTimePicker}
                onCancel={() => setIsTimeVisible(false)}
              />
            </View>
            <View style={style.row}>
              <View style={{ width: "47%" }}>
                <Text
                  style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
                >
                  Height
                </Text>
                <SelectDropdown
                  data={heightOptions}
                  buttonStyle={style.dropdownText}
                  defaultValue={cmToFeetAndInches(height)}
                  buttonTextStyle={style.placeholder}
                  onSelect={(selectedItem) => feetAndInchesToCm(selectedItem)}
                  buttonTextAfterSelection={(selectedItem, index) =>
                    selectedItem
                  }
                  dropdownStyle={{ borderRadius: 10 }}
                  rowTextStyle={{
                    left: 10,
                    position: "absolute",
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
                  placeHolder={"Enter your weight"}
                  onChangeText={(e) => setWeight(e)}
                  value={weight}
                  keyboard={"numeric"}
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
                  buttonStyle={style.dropdownText}
                  defaultValue={bloodGroup}
                  buttonTextStyle={style.placeholder}
                  onSelect={(selectedItem) => setBloodGroup(selectedItem)}
                  buttonTextAfterSelection={(selectedItem, index) =>
                    selectedItem
                  }
                  dropdownStyle={{ borderRadius: 10 }}
                  rowTextStyle={{
                    left: 10,
                    position: "absolute",
                  }}
                  rowTextForSelection={(item, index) => item}
                  defaultButtonText="Select Blood Group"
                />
              </View>
              <View style={{ width: "47%" }}>
                <Text
                  style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
                >
                  Zodiac Sign
                </Text>
                <SelectDropdown
                  data={zodiacSigns}
                  buttonStyle={style.dropdownText}
                  defaultValue={zodiac}
                  buttonTextStyle={style.placeholder}
                  onSelect={(selectedItem) => setZodiac(selectedItem)}
                  buttonTextAfterSelection={(selectedItem, index) =>
                    selectedItem
                  }
                  dropdownStyle={{ borderRadius: 10 }}
                  rowTextStyle={{
                    left: 10,
                    position: "absolute",
                  }}
                  rowTextForSelection={(item, index) => item}
                  defaultButtonText="Select Zodiac Sign"
                />
              </View>
            </View>

            <View style={style.row}>
              <View style={{ width: "47%" }}>
                <Text
                  style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
                >
                  Complexion
                </Text>
                <SelectDropdown
                  data={complexionOptions}
                  buttonStyle={style.dropdownText}
                  defaultValue={complexion}
                  buttonTextStyle={style.placeholder}
                  onSelect={(selectedItem) => setComplexion(selectedItem)}
                  buttonTextAfterSelection={(selectedItem, index) =>
                    selectedItem
                  }
                  dropdownStyle={{ borderRadius: 10 }}
                  rowTextStyle={{
                    left: 10,
                    position: "absolute",
                  }}
                  rowTextForSelection={(item, index) => item}
                  defaultButtonText="Select Complexion"
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
                  buttonStyle={style.dropdownText}
                  defaultValue={spectacles}
                  buttonTextStyle={style.placeholder}
                  onSelect={(selectedItem) => setSpectacles(selectedItem)}
                  buttonTextAfterSelection={(selectedItem, index) =>
                    selectedItem
                  }
                  dropdownStyle={{ borderRadius: 10 }}
                  rowTextStyle={{
                    left: 10,
                    position: "absolute",
                  }}
                  rowTextForSelection={(item, index) => item}
                  defaultButtonText="Do You Wear Specs?"
                />
              </View>
            </View>

            <View style={{ width: "100%", paddingTop: 20 }}>
              <Text
                style={[styles.h6, { paddingBottom: 5, color: colors.black }]}
              >
                Hobbies
              </Text>
              <Text
                style={[
                  styles.p,
                  { paddingBottom: 10, fontSize: 11, color: colors.black },
                ]}
              >
                Enter multiple hobbies separated by comma.
              </Text>
              <RNSTextInput
                placeHolder={"Enter your Hobbies"}
                onChangeText={(e) => setHobbies(e)}
                value={hobbies}
              />
            </View>
            <View style={{ width: "100%", paddingTop: 20 }}>
              <Text
                style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
              >
                Address
              </Text>
              <RNSTextInput
                placeHolder={"Enter your Address"}
                onChangeText={(e) => setAddress(e)}
                value={address}
                multiline
              />
            </View>
            <View style={style.row}>
              {countryData?.length > 0 && (
                <View style={{ width: "47%" }}>
                  <Text
                    style={[
                      styles.h6,
                      { paddingBottom: 8, color: colors.black },
                    ]}
                  >
                    Country
                  </Text>
                  <SelectDropdown
                    data={countryNames}
                    defaultValue={country}
                    buttonStyle={style.dropdownText}
                    buttonTextStyle={style.placeholder}
                    onSelect={(selectedItem) =>
                      handleCountrySelect(selectedItem)
                    }
                    buttonTextAfterSelection={(selectedItem, index) =>
                      selectedItem
                    }
                    dropdownStyle={{ borderRadius: 10 }}
                    rowTextStyle={{
                      left: 10,
                      position: "absolute",
                    }}
                    rowTextForSelection={(item, index) => item}
                    defaultButtonText="Select country"
                  />
                </View>
              )}
              {statesData?.length > 0 && (
                <View style={{ width: "47%" }}>
                  <Text
                    style={[
                      styles.h6,
                      { paddingBottom: 8, color: colors.black },
                    ]}
                  >
                    State
                  </Text>
                  <SelectDropdown
                    data={stateNames}
                    defaultValue={state}
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
                    }}
                    rowTextForSelection={(item, index) => item}
                    defaultButtonText="Select State"
                  />
                </View>
              )}
            </View>

            <View style={style.row}>
              {citiesData?.length > 0 && (
                <View style={{ width: "47%" }}>
                  <Text
                    style={[
                      styles.h6,
                      { paddingBottom: 8, color: colors.black },
                    ]}
                  >
                    City
                  </Text>
                  <SelectDropdown
                    data={cityNames}
                    defaultValue={city}
                    buttonStyle={style.dropdownText}
                    buttonTextStyle={style.placeholder}
                    onSelect={(selectedItem) => setCity(selectedItem)}
                    buttonTextAfterSelection={(selectedItem, index) =>
                      selectedItem
                    }
                    dropdownStyle={{ borderRadius: 10 }}
                    rowTextStyle={{
                      left: 10,
                      position: "absolute",
                    }}
                    rowTextForSelection={(item, index) => item}
                    defaultButtonText="Select city"
                  />
                </View>
              )}
              <View style={{ width: "47%" }}>
                <Text
                  style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
                >
                  Pin code
                </Text>
                <RNSTextInput
                  placeHolder={"Enter pin code"}
                  onChangeText={(e) => setPincode(e)}
                  value={pincode}
                  keyboard={"numeric"}
                />
              </View>
            </View>

            <View style={{ paddingTop: 10 }}>
              <Text
                style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
              >
                Education
              </Text>
              <SelectDropdown
                data={educationOptions}
                buttonStyle={style.dropdownText}
                defaultValue={selectedItem}
                buttonTextStyle={style.placeholder}
                onSelect={(selectedItem) => setSelectedItem(selectedItem)}
                buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                dropdownStyle={{ borderRadius: 10 }}
                rowTextStyle={{
                  left: 10,
                  position: "absolute",
                }}
                rowTextForSelection={(item, index) => item}
                defaultButtonText="Select Education"
              />
            </View>

            <View style={{ width: "100%", paddingTop: 20 }}>
              <Text
                style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
              >
                Education Detail
              </Text>
              <RNSTextInput
                placeHolder={"Enter education detail"}
                onChangeText={(e) => setEducationDetail(e)}
                value={education_detail}
              />
            </View>

            <View style={{ width: "100%", paddingTop: 20 }}>
              <Text
                style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
              >
                Special Information
              </Text>
              <RNSTextInput
                placeHolder={"Enter special information"}
                onChangeText={(e) => setSpecialInfo(e)}
                value={special_info}
                multiline
              />
            </View>

            <View style={style.row}>
              <View style={{ width: "47%" }}>
                <Text
                  style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
                >
                  Profession
                </Text>
                <SelectDropdown
                  data={professionOptions}
                  buttonStyle={style.dropdownText}
                  defaultValue={profession}
                  buttonTextStyle={style.placeholder}
                  onSelect={(selectedItem) => setProfession(selectedItem)}
                  buttonTextAfterSelection={(selectedItem, index) =>
                    selectedItem
                  }
                  dropdownStyle={{ borderRadius: 10 }}
                  rowTextStyle={{
                    left: 10,
                    position: "absolute",
                  }}
                  rowTextForSelection={(item, index) => item}
                  defaultButtonText="Select Profession"
                />
              </View>
              <View style={{ width: "47%" }}>
                <Text
                  style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
                >
                  Designation
                </Text>
                <RNSTextInput
                  placeHolder={"Enter designation"}
                  onChangeText={(e) => setDesignation(e)}
                  value={designation}
                />
              </View>
            </View>

            <View style={style.row}>
              <View style={{ width: "47%" }}>
                <Text
                  style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
                >
                  Company Name
                </Text>
                <RNSTextInput
                  placeHolder={"Enter company name"}
                  onChangeText={(e) => setCompany(e)}
                  value={company}
                />
              </View>
              <View style={{ width: "47%" }}>
                <Text
                  style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
                >
                  Work phone
                </Text>
                <RNSTextInput
                  placeHolder={"Enter phone number"}
                  onChangeText={(e) => setWorkPhone(e)}
                  value={workPhone}
                />
              </View>
            </View>

            <View style={{ width: "100%", paddingTop: 20 }}>
              <Text
                style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
              >
                Work Address
              </Text>
              <RNSTextInput
                placeHolder={"Enter your Address"}
                onChangeText={(e) => setWorkAddress(e)}
                value={workAddress}
                multiline
              />
            </View>

            <View style={style.row}>
              {countryData?.length > 0 && (
                <View style={{ width: "47%" }}>
                  <Text
                    style={[
                      styles.h6,
                      { paddingBottom: 8, color: colors.black },
                    ]}
                  >
                    Work Country
                  </Text>
                  <SelectDropdown
                    data={countryNames}
                    defaultValue={workcountry}
                    buttonStyle={style.dropdownText}
                    buttonTextStyle={style.placeholder}
                    onSelect={(selectedItem) =>
                      handleWorkCountrySelect(selectedItem)
                    }
                    buttonTextAfterSelection={(selectedItem, index) =>
                      selectedItem
                    }
                    dropdownStyle={{ borderRadius: 10 }}
                    rowTextStyle={{
                      left: 10,
                      position: "absolute",
                    }}
                    rowTextForSelection={(item, index) => item}
                    defaultButtonText="Select country"
                  />
                </View>
              )}
              {statesData?.length > 0 && (
                <View style={{ width: "47%" }}>
                  <Text
                    style={[
                      styles.h6,
                      { paddingBottom: 8, color: colors.black },
                    ]}
                  >
                    Work State
                  </Text>
                  <SelectDropdown
                    data={stateNames}
                    defaultValue={workstate}
                    buttonStyle={style.dropdownText}
                    buttonTextStyle={style.placeholder}
                    onSelect={(selectedItem) =>
                      handleWorkStateSelect(selectedItem)
                    }
                    buttonTextAfterSelection={(selectedItem, index) =>
                      selectedItem
                    }
                    dropdownStyle={{ borderRadius: 10 }}
                    rowTextStyle={{
                      left: 10,
                      position: "absolute",
                    }}
                    rowTextForSelection={(item, index) => item}
                    defaultButtonText="Select State"
                  />
                </View>
              )}
            </View>

            <View style={style.row}>
              {citiesData?.length > 0 && (
                <View style={{ width: "47%" }}>
                  <Text
                    style={[
                      styles.h6,
                      { paddingBottom: 8, color: colors.black },
                    ]}
                  >
                    Work City
                  </Text>
                  <SelectDropdown
                    data={cityNames}
                    defaultValue={workcity}
                    buttonStyle={style.dropdownText}
                    buttonTextStyle={style.placeholder}
                    onSelect={(selectedItem) => setworkCity(selectedItem)}
                    buttonTextAfterSelection={(selectedItem, index) =>
                      selectedItem
                    }
                    dropdownStyle={{ borderRadius: 10 }}
                    rowTextStyle={{
                      left: 10,
                      position: "absolute",
                    }}
                    rowTextForSelection={(item, index) => item}
                    defaultButtonText="Select city"
                  />
                </View>
              )}
              <View style={{ width: "47%" }}>
                <Text
                  style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
                >
                  Work Pin code
                </Text>
                <RNSTextInput
                  placeHolder={"Enter pin code"}
                  onChangeText={(e) => setworkPincode(e)}
                  value={workpincode}
                  keyboard={"numeric"}
                />
              </View>
            </View>
            <View style={style.row}>
              <View style={{ width: "47%" }}>
                <Text
                  style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
                >
                  Annual Income
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      top: 11,
                      left: 10,
                      zIndex: 999,
                      position: "absolute",
                      color: colors.gray,
                      fontSize: 17,
                    }}
                  >
                    ₹
                  </Text>
                  <View style={{ width: "100%" }}>
                    <RNSTextInput
                      placeHolder={"Enter your Annual Icome"}
                      onChangeText={(e) => setIncome(e)}
                      value={income}
                      icon={true}
                      keyboard={"numeric"}
                    />
                  </View>
                </View>
              </View>
              <View style={{ width: "47%" }}>
                <Text
                  style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
                >
                  Mangalik
                </Text>
                <SelectDropdown
                  data={mangalikOptions}
                  buttonStyle={style.dropdownText}
                  defaultValue={manglik}
                  buttonTextStyle={style.placeholder}
                  onSelect={(selectedItem) => setManglik(selectedItem)}
                  buttonTextAfterSelection={(selectedItem, index) =>
                    selectedItem
                  }
                  dropdownStyle={{ borderRadius: 10 }}
                  rowTextStyle={{
                    left: 10,
                    position: "absolute",
                  }}
                  rowTextForSelection={(item, index) => item}
                  defaultButtonText="Are you mangalik"
                />
              </View>
            </View>

            <View style={style.row}>
              {nadiOptions.length > 0 && (
                <View style={{ width: "47%" }}>
                  <Text
                    style={[
                      styles.h6,
                      { paddingBottom: 8, color: colors.black },
                    ]}
                  >
                    Nadi
                  </Text>
                  <SelectDropdown
                    data={nadiOptions}
                    buttonStyle={style.dropdownText}
                    defaultValue={nadi}
                    buttonTextStyle={style.placeholder}
                    onSelect={(selectedItem) => setNadi(selectedItem)}
                    buttonTextAfterSelection={(selectedItem, index) =>
                      selectedItem
                    }
                    dropdownStyle={{ borderRadius: 10 }}
                    rowTextStyle={{
                      left: 10,
                      position: "absolute",
                    }}
                    rowTextForSelection={(item, index) => item}
                    defaultButtonText="Nadi"
                  />
                </View>
              )}
              {nakshatraOptions.length > 0 && (
                <View style={{ width: "47%" }}>
                  <Text
                    style={[
                      styles.h6,
                      { paddingBottom: 8, color: colors.black },
                    ]}
                  >
                    Nakshatra
                  </Text>
                  <SelectDropdown
                    data={nakshatraOptions}
                    buttonStyle={style.dropdownText}
                    defaultValue={nakshatra}
                    buttonTextStyle={style.placeholder}
                    onSelect={(selectedItem) => setNakshatra(selectedItem)}
                    buttonTextAfterSelection={(selectedItem, index) =>
                      selectedItem
                    }
                    dropdownStyle={{ borderRadius: 10 }}
                    rowTextStyle={{
                      left: 10,
                      position: "absolute",
                    }}
                    rowTextForSelection={(item, index) => item}
                    defaultButtonText="Nakshatra"
                  />
                </View>
              )}
            </View>

            <View style={style.row}>
              {ganaOptions.length > 0 && (
                <View style={{ width: "47%" }}>
                  <Text
                    style={[
                      styles.h6,
                      { paddingBottom: 8, color: colors.black },
                    ]}
                  >
                    Gana
                  </Text>
                  <SelectDropdown
                    data={ganaOptions}
                    buttonStyle={style.dropdownText}
                    defaultValue={gana}
                    buttonTextStyle={style.placeholder}
                    onSelect={(selectedItem) => setGana(selectedItem)}
                    buttonTextAfterSelection={(selectedItem, index) =>
                      selectedItem
                    }
                    dropdownStyle={{ borderRadius: 10 }}
                    rowTextStyle={{
                      left: 10,
                      position: "absolute",
                    }}
                    rowTextForSelection={(item, index) => item}
                    defaultButtonText="Gana"
                  />
                </View>
              )}
              <View style={{ width: "47%" }}>
                <Text
                  style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
                >
                  Marital Status
                </Text>
                <SelectDropdown
                  data={maritalStatusOptions}
                  buttonStyle={style.dropdownText}
                  defaultValue={maritalStatus}
                  buttonTextStyle={style.placeholder}
                  onSelect={(selectedItem) => setMaritalStatus(selectedItem)}
                  buttonTextAfterSelection={(selectedItem, index) =>
                    selectedItem
                  }
                  dropdownStyle={{ borderRadius: 10 }}
                  rowTextStyle={{
                    left: 10,
                    position: "absolute",
                  }}
                  rowTextForSelection={(item, index) => item}
                  defaultButtonText="Marital Status"
                />
              </View>
            </View>

            <View style={{ width: "100%", paddingTop: 20 }}>
              <Text
                style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
              >
                Partner expectations
              </Text>
              <RNSTextInput
                placeHolder={"Enter partner expectations"}
                onChangeText={(e) => setpartnerExpectation(e)}
                value={partnerExpectation}
                multiline
              />
            </View>

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
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    // paddingHorizontal: 25,
    // paddingVertical: 20,
  },
  row:{
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
