import {StyleSheet, Text, View, Pressable, ScrollView} from 'react-native';
import React, {useState,useEffect} from 'react';
import styles from '../../navigation/styles';
import RNSTextInput from '../../../components/RNSTextInput';
import {colors, fonts} from '../../../styles';
import SelectDropdown from "react-native-select-dropdown";
import Toast from "react-native-toast-message";
import apiClient from "../../../utils/apiClient";

export default function Step3({professionalDetails,updateProfessionalDetails}) {
  const [annualIncome, setannualIncome] = useState('');
  const [occupation, setoccupation] = useState('');
  const [industry, setindustry] = useState('');
  const [partnerPreference, setPartnerPreference] = useState('');
  const [countryData, setCountrydata] = useState([]);
  const [statesData, setStatesdata] = useState([]);
  const [citiesData, setCitiesdata] = useState([]);

  const professionOptions = [
    "Government job",
    "Private job",
    "Business owner",
    "Self-employed",
    "Farmer",
    "Retired",
  ];

        useEffect(() => {
          getCountry();
          fetchStates("IN");
        }, []);

        const getCountry = async () => {
          try {
            const response = await apiClient.get(
              apiClient.Urls.getCountries,
              {}
            );
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
          updateProfessionalDetails("country", selectedItem);
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
          updateProfessionalDetails("state", selectedItem);
          const selectedCountry = countryData.find(
            (e) => e.name === professionalDetails.country
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
        <View style={{ width: "100%", paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Profession *
          </Text>
          <SelectDropdown
            data={professionOptions}
            defaultValue={professionalDetails.profession}
            buttonStyle={style.dropdownText}
            buttonTextStyle={style.placeholder}
            onSelect={(selectedItem) =>
              updateProfessionalDetails("profession", selectedItem)
            }
            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
            dropdownStyle={{ borderRadius: 10 }}
            rowTextStyle={{
              left: 10,
              position: "absolute",
              fontSize: 15,
            }}
            rowTextForSelection={(item, index) => item}
            defaultButtonText="Select Profession"
          />
        </View>
        <View style={{ width: "100%", paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Designation
          </Text>
          <RNSTextInput
            placeHolder={"Enter Designation"}
            onChangeText={(e) => updateProfessionalDetails("designation", e)}
            value={professionalDetails.designation}
          />
        </View>
        <View style={{ width: "100%", paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Company Name
          </Text>
          <RNSTextInput
            placeHolder={"Enter Company Name"}
            onChangeText={(e) => updateProfessionalDetails("company_name", e)}
            value={professionalDetails.company_name}
          />
        </View>
        <View style={{ width: "100%", paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Work Phone
          </Text>
          <RNSTextInput
            placeHolder={"Enter phone number"}
            onChangeText={(e) => updateProfessionalDetails("work_phone", e)}
            value={professionalDetails.work_phone}
            keyboard="numeric"
            maxLength={10}
          />
        </View>
        <View style={{ width: "100%", paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Work Address
          </Text>
          <RNSTextInput
            placeHolder={"Enter address"}
            onChangeText={(e) => updateProfessionalDetails("work_address", e)}
            value={professionalDetails.work_address}
          />
        </View>
        {countryData.length > 0 && 
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
                defaultValue={professionalDetails.country}
                buttonTextStyle={style.placeholder}
                onSelect={(selectedItem) => handleCountrySelect(selectedItem)}
                buttonTextAfterSelection={(selectedItem, index) => selectedItem}
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
                defaultValue={professionalDetails.work_state}
                buttonStyle={style.dropdownText}
                buttonTextStyle={style.placeholder}
                onSelect={(selectedItem) => handleStateSelect(selectedItem)}
                buttonTextAfterSelection={(selectedItem, index) => selectedItem}
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
                defaultValue={professionalDetails.work_city}
                buttonStyle={style.dropdownText}
                buttonTextStyle={style.placeholder}
                onSelect={(selectedItem) =>
                  updateProfessionalDetails("city", selectedItem)
                }
                buttonTextAfterSelection={(selectedItem, index) => selectedItem}
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
                onChangeText={(e) => updateProfessionalDetails("pincode", e)}
                value={professionalDetails.pincode}
                keyboard={"numeric"}
              />
            </View>
          </View>
        </>
        }
        <View style={{ width: "100%", paddingTop: 10 }}>
          <Text style={[styles.h6, { paddingBottom: 8, color: colors.black }]}>
            Annual Income *
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
                placeHolder={"Enter Annual Income"}
                keyboard={"numeric"}
                icon={true}
                onChangeText={(e) =>
                  updateProfessionalDetails("annual_income", e)
                }
                value={professionalDetails.annual_income}
              />
            </View>
          </View>
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
    height: 47,
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
