import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import React, { useState,useEffect } from "react";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import styles from "../../navigation/styles";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { colors } from "../../../styles";
import { useDispatch, useSelector } from "react-redux";
import Step4 from "./Step4";
import apiClient from "../../../utils/apiClient";
import Toast from "react-native-toast-message";
import { setAuthData } from "../../auth/session";
import { getProfile } from "../../../redux/Matrimony/Search";

const stepStyle = {
  activeStepIconBorderColor: colors.primaryColor,
  activeLabelColor: colors.primaryColor,
  activeStepNumColor: colors.primaryColor,
  activeStepIconColor: "#fff",
  completedStepIconColor: colors.primaryColor,
  completedProgressBarColor: colors.primaryColor,
  completedCheckColor: "#fff",
};
const buttonTextStyle = {
  color: "#fff",
  backgroundColor: colors.primaryColor,
  paddingHorizontal: 30,
  paddingVertical: 7,
  borderRadius: 100,
  position: "absolute",
  right: -30,
};

const previousButtonTextStyle = {
  color: "gray",
  backgroundColor: "#f0f0f0",
  borderWidth: 1,
  borderColor: "#d3d3d3",
  paddingHorizontal: 30,
  paddingVertical: 7,
  borderRadius: 100,
  position: "absolute",
  left: -30,
};

const submitButtonStyle = {
  backgroundColor: colors.primaryColor,
  padding: 10,
  borderRadius: 5,
};

const submitButtonTextStyle = {
  color: "#fff",
  fontWeight: "bold",
};

export default function MatrimonyRegistration({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [valid1,setValid1] = useState(true);
  const [valid2, setValid2] = useState(true);
  const [valid3, setValid3] = useState(true);
  const [valid4, setValid4] = useState(true);
  const profile = useSelector((state) => state.session.profile);
  const token = useSelector((state) => state.session.authToken);
  const dispatch = useDispatch();
  
  useEffect(()=>{
    // setValid(true);
    console.warn(valid1);
  },[valid1])
  
  const [personalDetails, setPersonalDetails] = useState({
    fullname: profile?.fullname || "",
    // profile_image:'',
    profile_image: profile?.profile_image
      ? {
          uri: profile.profile_image,
          type: "image/jpeg", // Set the appropriate MIME type
          name: "profile.jpg", // Set the desired filename
        }
      : undefined,
    gender: profile?.gender || "",
    email: profile?.email || "",
    dob: profile?.dob || "",
    birth_time: "",
    birth_place: "",
    height: "",
    complexion: "",
    bloodgroup: "",
    highest_education: "",
    education_detail:"",
    special_info:"",
    phone: profile?.phone || "",
    spectacles: "",
    zodiac: "",
    weight: "",
    hobbies: "",
    address: "",
    country: "India",
    state: "",
    city: "",
    pincode: "",
  });

  const [familyDetails, setFamilydetails] = useState({
    father_name: "",
    occupation: "",
    annual_income: "",
    phone: "",
    religion: "",
    cast: "",
    sub_cast: "",
    sister_marriage_status: "",
    sister_unmarried_status: "",
    brother_marriage_status: "",
    brother_unmarried_status: "",
    family_type: "",
    village_name: "",
  });

  const [professionalDetails, setProfessionalDetails] = useState({
    profession: "",
    designation: "",
    company_name: "",
    work_address: "",
    work_phone: "",
    annual_income: "",
    country: "India",
    state: "",
    city: "",
    pincode: "",
  });

  const [additionalDetails, setAdditionalDetails] = useState({
    manglik: "",
    nadi: "",
    nakshatra: "",
    gana: "",
    marital_status: "",
    partner_preferences: "",
  });
  const updatePersonalDetails = (field, value) => {
    setPersonalDetails((prevState) => {
      const updatedDetails = { ...prevState, [field]: value };
      console.log("personal details is--->", updatedDetails);
      return updatedDetails;
    });
  };

  const updateFamilyDetails = (field, value) => {
    setFamilydetails((prevState) => {
      const updatedDetails = { ...prevState, [field]: value };
      console.log("Family details is--->", updatedDetails);
      return updatedDetails;
    });
  };

  const updateProfessionalDetails = (field, value) => {
    setProfessionalDetails((prevState) => {
      const updatedDetails = { ...prevState, [field]: value };
      console.log("Professional details is--->", updatedDetails);
      return updatedDetails;
    });
  };

  const updateAdditionalDetails = (field, value) => {
    setAdditionalDetails((prevState) => {
      const updatedDetails = { ...prevState, [field]: value };
      console.log("Additional details is--->", updatedDetails);
      return updatedDetails;
    });
  };

  const allformData = {
    ...personalDetails,
    ...additionalDetails,
  };
  // Conditionally add profile_image to allformData if its URI is defined
  if (personalDetails.profile_image && personalDetails.profile_image.uri) {
    allformData.profile_image = personalDetails.profile_image;
  }

  const familyDetailsObject = {
    "family_details[father_name]": familyDetails.father_name,
    "family_details[occupation]": familyDetails.occupation,
    "family_details[annual_income]": familyDetails.annual_income,
    "family_details[phone]": familyDetails.phone,
    "family_details[cast]": familyDetails.cast,
    "family_details[sub_cast]": familyDetails.sub_cast,
    "family_details[sister_marriage_status]":
      familyDetails.sister_marriage_status,
    "family_details[sister_unmarried_status]":
      familyDetails.sister_unmarried_status,
    "family_details[brother_marriage_status]":
      familyDetails.brother_marriage_status,
    "family_details[brother_unmarried_status]":
      familyDetails.brother_unmarried_status,
    "family_details[family_type]": familyDetails.family_type,
    "family_details[village_name]": familyDetails.village_name,
  };

  const professionalDetailsObject = {
    "proffessional_details[profession]": professionalDetails.profession,
    "proffessional_details[designation]": professionalDetails.designation,
    "proffessional_details[company_name]": professionalDetails.company_name,
    "proffessional_details[work_address]": professionalDetails.work_address,
    "proffessional_details[work_country]": professionalDetails.country,
    "proffessional_details[work_state]": professionalDetails.state,
    "proffessional_details[work_city]": professionalDetails.city,
    "proffessional_details[work_pincode]": professionalDetails.pincode,
    "proffessional_details[work_phone]": professionalDetails.work_phone,
    "proffessional_details[annual_income]": professionalDetails.annual_income,
  };

  const finalFormData = {
    ...allformData,
    ...familyDetailsObject,
    ...professionalDetailsObject,
  };
  if (personalDetails.profile_image && personalDetails.profile_image.uri) {
    finalFormData.profile_image = personalDetails.profile_image;
  }
  const register = async () => {
    setLoading(true);
    console.log("apiclientssss", loading);
    try {
      const response = await apiClient.post(
        apiClient.Urls.matrimonyRegister,
        {
          ...finalFormData,
          authToken: token,
        },
        true
      );
      console.log(response);
      if (response.success) {
        navigation.navigate("Home");
        dispatch(getProfile(token));
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
      <ProgressSteps style={{ width: "100%" }} {...stepStyle}>
        <ProgressStep
          label="Personal Details"
          nextBtnTextStyle={buttonTextStyle}
          errors={valid1}
          onNext={() => {
            if (
              !personalDetails.gender ||
              !personalDetails.birth_time ||
              !personalDetails.dob ||
              !personalDetails.height ||
              !personalDetails.highest_education ||
              !personalDetails.address
            ) {
              Toast.show({
                text1: "Please fill in all required fields.",
                type: "error",
              });
              setValid1(false);
            }
            setValid1((prevValid) => !prevValid);
          }}
        >
          <View style={{ paddingHorizontal: 25 }}>
            <Step1
              personalDetails={personalDetails}
              updatePersonalDetails={(field, value) =>
                updatePersonalDetails(field, value)
              }
            />
          </View>
        </ProgressStep>
        <ProgressStep
          label="Kundali Details"
          nextBtnTextStyle={buttonTextStyle}
          previousBtnTextStyle={previousButtonTextStyle}
        >
          <View style={{ paddingHorizontal: 25 }}>
            <Step4
              additionalDetails={additionalDetails}
              updateAdditionalDetails={(field, value) =>
                updateAdditionalDetails(field, value)
              }
            />
          </View>
        </ProgressStep>
        <ProgressStep
          label="Family Details"
          nextBtnTextStyle={buttonTextStyle}
          previousBtnTextStyle={previousButtonTextStyle}
          // errors={valid2}
          // onNext={() => {
          //   if (
          //     !personalDetails.gender ||
          //     !personalDetails.dob ||
          //     !personalDetails.height ||
          //     !personalDetails.highest_education ||
          //     !personalDetails.hobbies ||
          //     !personalDetails.address
          //   ) {
          //     Toast.show({
          //       text1: "Please fill in all required fields.",
          //       type: "error",
          //     });
          //     setValid2(false);
          //   }
          //   setValid2((prevValid) => !prevValid);
          // }}
        >
          <View style={{ paddingHorizontal: 25 }}>
            <Step2
              familyDetails={familyDetails}
              updateFamilyDetails={(field, value) =>
                updateFamilyDetails(field, value)
              }
            />
          </View>
        </ProgressStep>
        <ProgressStep
          label="Professional Details"
          nextBtnTextStyle={buttonTextStyle}
          previousBtnTextStyle={previousButtonTextStyle}
          errors={valid3}
           onSubmit={() =>
            {
            //    if (
            //   !professionalDetails.profession ||
            //   !professionalDetails.annual_income
            // ) {
            //   Toast.show({
            //     text1: "Please fill in all required fields.",
            //     type: "error",
            //   });
            //   setValid3(true);
            // }
            // else{
            // setValid3((prevValid) => !prevValid);
            navigation.navigate("Pricing", {
              register: register,
              loading: loading,
            })
          // }
          }
        }
          
        >
          <View style={{ paddingHorizontal: 25 }}>
            <Step3
              professionalDetails={professionalDetails}
              updateProfessionalDetails={(field, value) =>
                updateProfessionalDetails(field, value)
              }
            />
          </View>
        </ProgressStep>
        {/* <ProgressStep
          label="Additional Details"
          nextBtnTextStyle={buttonTextStyle}
          previousBtnTextStyle={previousButtonTextStyle}
          onSubmit={() =>
            navigation.navigate("Pricing", {
              register: register,
              loading: loading,
            })
          }
        >
          <View style={{ paddingHorizontal: 25 }}>
            <Step4
              additionalDetails={additionalDetails}
              updateAdditionalDetails={(field, value) =>
                updateAdditionalDetails(field, value)
              }
            />
          </View>
        </ProgressStep> */}
      </ProgressSteps>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
