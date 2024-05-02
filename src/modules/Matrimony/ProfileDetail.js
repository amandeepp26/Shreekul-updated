import { Image, StyleSheet, Text, View,Pressable, ScrollView,Linking,TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import {Icon} from 'react-native-elements';
import styles from '../navigation/styles';
import Button from '../../components/Button';
import { colors } from '../../styles';
import { useRoute } from '@react-navigation/native';
import { calculateAge } from './components/calculateAge';
import { useSelector } from 'react-redux';
import { capitalizeFirstLetter } from './components/capitalizeFirstLetter';
import moment from 'moment'

export default function ProfileDetail({navigation }) {
  const route = useRoute();
  const { data, like,likeloader,view } = route.params;
  const [loading,setLoading] = useState(false);
  const userId = useSelector(state => state.session.profile.matrimony_registration?._id);
  
  const send =()=>{
    setLoading(true);
    like(data?._id);
    navigation.goBack();
  }

    function cmToFeetAndInches(cm) {
      const totalInches = cm / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return `${feet}'${inches}"`;
    }

     const handleCall = (e) => {
       const phoneNumber = e;
       if (phoneNumber) {
         Linking.openURL(`tel:${phoneNumber}`);
       }
     };

     const handleEmail = (e) => {
       const email = e;
       if (email) {
      Linking.openURL(`mailto:${email}`);
       }
     };

     const handleWhatsApp = (phoneNumber) => {
       if (phoneNumber) {
         Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
       }
     };

  return (
    <View style={style.container}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={{
          padding: 7,
          backgroundColor: "white",
          position: "absolute",
          top: 40,
          left: 10,
          zIndex: 999,
          borderRadius: 40,
        }}
      >
        <Icon name="chevron-back-outline" type="ionicon" size={20} />
      </Pressable>
      <View style={style.imageContainer}>
        <Image
          source={{ uri: data?.profile_image }}
          resizeMode="stretch"
          style={style.image}
        />
        <Image
          source={require("../../../assets/images/shadow.png")}
          // resizeMode="contain"
          style={style.shadowImage}
        />
        <Text style={style.name}>{data?.fullname}</Text>
        <Text style={style.age}>
          {data?.gender} | {data?.age} yrs
        </Text>
      </View>
      <ScrollView style={style.scrollView}>
        <View style={style.image}></View>
        <View style={style.infoContainer}>
          {data?.hobbies && data?.hobbies.trim() !== "" ? (
            <>
              <Text style={[styles.h6, { fontWeight: "bold" }]}>Hobbies:</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {data?.hobbies
                  .split(",") // Split hobbies
                  .map((hobby, index) => (
                    <View
                      key={index}
                      style={[
                        style.chip,
                        { marginRight: index % 3 === 2 ? 10 : 10 },
                      ]}
                    >
                      <Text
                        style={[
                          styles.p,
                          { color: colors.primaryColor, top: -1 },
                        ]}
                      >
                        {capitalizeFirstLetter(hobby.trim())}
                      </Text>
                    </View>
                  ))}
              </View>
            </>
          ) : (
            <View></View>
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 1,
              paddingVertical: 10,
              borderColor: "#d3d3d3",
            }}
          >
            <Text
              style={[
                styles.h5,
                {
                  fontWeight: "bold",
                  color: colors.primaryColor,
                },
              ]}
            >
              Basic Details :
            </Text>
            {data?.phone && (
              <TouchableOpacity
                onPress={() => handleCall(data?.phone)}
                style={{
                  backgroundColor: colors.primaryColor,
                  padding: 5,
                  marginLeft: 20,
                  borderRadius: 50,
                }}
              >
                <Icon
                  name="call-outline"
                  type="ionicon"
                  color="white"
                  size={18}
                />
              </TouchableOpacity>
            )}

            {data?.email && (
              <TouchableOpacity
                onPress={() => handleEmail(data?.email)}
                style={{
                  backgroundColor: "#c71610",
                  padding: 5,
                  marginLeft: 10,
                  borderRadius: 50,
                }}
              >
                <Icon
                  name="mail-outline"
                  type="ionicon"
                  color="white"
                  size={18}
                />
              </TouchableOpacity>
            )}

            {data?.phone && (
              <TouchableOpacity
                onPress={() => handleWhatsApp(data?.phone)}
                style={{
                  backgroundColor: "#25D366",
                  padding: 5,
                  marginLeft: 10,
                  borderRadius: 50,
                }}
              >
                <Icon
                  name="logo-whatsapp"
                  type="ionicon"
                  color="white"
                  size={18}
                />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{ flexDirection: "row", width: "85%", paddingTop: 10 }}
            >
              <Text style={[styles.h6, { fontWeight: "bold" }]}>
                Birth date : time :
              </Text>
              <Text style={[styles.h6, { marginTop: 1, marginLeft: 10 }]}>
                {moment(data?.dob).format("D MMM YYYY")} : {data?.birth_time}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", width: "45%", paddingTop: 10 }}>
            <Text style={[styles.h6, { fontWeight: "bold" }]}>
              Birth Place :
            </Text>
            <Text style={[styles.h6, { marginTop: 1, marginLeft: 10 }]}>
              {data?.birth_place}
            </Text>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{ flexDirection: "row", width: "45%", paddingTop: 10 }}
            >
              <Text style={[styles.h6, { fontWeight: "bold" }]}>Height :</Text>
              <Text style={[styles.h6, { marginTop: 1, marginLeft: 10 }]}>
                {cmToFeetAndInches(data?.height)} ({data.height} cm)
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", width: "45%", paddingTop: 10 }}
            >
              <Text style={[styles.h6, { fontWeight: "bold" }]}>Weight :</Text>
              <Text style={[styles.h6, { marginTop: 1, marginLeft: 10 }]}>
                {data?.weight && `${data?.weight} kg`}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "45%",
                paddingTop: 10,
              }}
            >
              <Text style={[styles.h6, { fontWeight: "bold" }]}>
                Zodiac sign :
              </Text>
              <Text style={[styles.h6, { marginTop: 1, marginLeft: 10 }]}>
                {data?.zodiac}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", width: "45%", paddingTop: 10 }}
            >
              <Text style={[styles.h6, { fontWeight: "bold" }]}>
                Mangalik :
              </Text>
              <Text style={[styles.h6, { marginTop: 1, marginLeft: 10 }]}>
                {data?.manglik}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", width: "45%", paddingTop: 10 }}
            >
              <Text style={[styles.h6, { fontWeight: "bold" }]}>
                Blood Group :
              </Text>
              <Text style={[styles.h6, { marginTop: 1, marginLeft: 10 }]}>
                {data?.bloodgroup}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "45%",
                paddingTop: 10,
              }}
            >
              <Text style={[styles.h6, { fontWeight: "bold" }]}>
                Religion :
              </Text>
              <Text style={[styles.h6, { marginTop: 1, marginLeft: 10 }]}>
                {data?.religion}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", width: "45%", paddingTop: 10 }}
            >
              <Text style={[styles.h6, { fontWeight: "bold" }]}>Cast :</Text>
              <Text style={[styles.h6, { marginTop: 1, marginLeft: 10 }]}>
                {data?.family_details?.cast}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "45%",
                paddingTop: 10,
              }}
            >
              <Text style={[styles.h6, { fontWeight: "bold" }]}>
                Sub-Cast :
              </Text>
              <Text style={[styles.h6, { marginTop: 1, marginLeft: 10 }]}>
                {data?.family_details?.sub_cast}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: "85%",
                paddingTop: 10,
              }}
            >
              <Text style={[styles.h6, { fontWeight: "bold" }]}>
                Native (Village) :
              </Text>
              <Text style={[styles.h6, { marginTop: 1, marginLeft: 10 }]}>
                {data?.family_details?.village_name}
              </Text>
            </View>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ paddingTop: 10 }}>
              <Text style={[styles.h6, { fontWeight: "bold" }]}>
                Partner preference :
              </Text>
              <Text style={[styles.h6, { marginTop: 1, width: "60%" }]}>
                {data?.partner_preferences}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", width: "85%", paddingTop: 10 }}>
            <Text style={[styles.h6, { fontWeight: "bold" }]}>Address :</Text>
            <Text
              style={[
                styles.h6,
                { marginTop: 1, width: "80%", marginLeft: 10 },
              ]}
            >
              {data?.address != undefined && `${data.address}`}
              {data?.city != undefined && `, ${data.city}`}
              {data?.state != undefined && `, ${data.state}`}
              {data?.country && `, ${data.country}`}
            </Text>
          </View>

          <Text
            style={[
              styles.h5,
              {
                fontWeight: "bold",
                color: colors.primaryColor,
                marginTop: 15,
                borderBottomWidth: 1,
                paddingBottom: 10,
                borderColor: "#d3d3d3",
              },
            ]}
          >
            Education Details :
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row", paddingTop: 10 }}>
              <Text style={[styles.h6, { fontWeight: "bold" }]}>
                Highest Education :
              </Text>
              <Text style={[styles.h6, { marginTop: 1, marginLeft: 10 }]}>
                {data?.highest_education}
              </Text>
            </View>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row", paddingTop: 10 }}>
              <Text style={[styles.h6, { fontWeight: "bold" }]}>
                Education Detail:
              </Text>
              <Text style={[styles.h6, { marginTop: 1, marginLeft: 10 }]}>
                {data?.education_detail}
              </Text>
            </View>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row", paddingTop: 10 }}>
              <Text style={[styles.h6, { fontWeight: "bold" }]}>
                Special Information :
              </Text>
              <Text style={[styles.h6, { marginTop: 1, marginLeft: 10 }]}>
                {data?.special_info}
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.h5,
              {
                fontWeight: "bold",
                color: colors.primaryColor,
                marginTop: 15,
                borderBottomWidth: 1,
                paddingBottom: 10,
                borderColor: "#d3d3d3",
              },
            ]}
          >
            Professional Details :
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{ flexDirection: "row", width: "45%", paddingTop: 10 }}
            >
              <Text style={[styles.h6, { fontWeight: "bold" }]}>
                Profession :
              </Text>
              <Text style={[styles.h6, { marginTop: 1, marginLeft: 10 }]}>
                {data?.proffessional_details?.profession}
              </Text>
            </View>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{ flexDirection: "row", width: "45%", paddingTop: 10 }}
            >
              <Text style={[styles.h6, { fontWeight: "bold" }]}>
                Designation :
              </Text>
              <Text style={[styles.h6, { marginTop: 1, marginLeft: 10 }]}>
                {data?.proffessional_details?.designation}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", width: "45%", paddingTop: 10 }}>
            <Text style={[styles.h6, { fontWeight: "bold" }]}>
              Annual Income :
            </Text>
            <Text style={[styles.h6, { marginTop: 1, marginLeft: 10 }]}>
              ₹ {data?.proffessional_details?.annual_income}
            </Text>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{ flexDirection: "row", width: "85%", paddingTop: 10 }}
            >
              <Text style={[styles.h6, { fontWeight: "bold" }]}>
                Work Address :
              </Text>
              <Text
                style={[
                  styles.h6,
                  { marginTop: 1, width: "80%", marginLeft: 10 },
                ]}
              >
                {data?.proffessional_details?.work_address != undefined &&
                  `${data.proffessional_details.work_address}`}
                {data.proffessional_details.work_city != undefined ||
                  (null && `, ${data.proffessional_details.work_city}`)}
                {data.proffessional_details.work_state != undefined ||
                  (null && `, ${data.proffessional_details.work_state},`)}
                {data.proffessional_details.work_country &&
                  `${data.proffessional_details.work_country}`}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "45%",
              alignItems: "center",
              paddingTop: 10,
            }}
          >
            <Text style={[styles.h6, { fontWeight: "bold" }]}>Contact :</Text>
            {data?.proffessional_details?.work_phone && (
              <TouchableOpacity
                onPress={() =>
                  handleCall(data?.proffessional_details?.work_phone)
                }
                style={{
                  backgroundColor: colors.primaryColor,
                  padding: 5,
                  marginLeft: 10,
                  borderRadius: 50,
                }}
              >
                <Icon
                  name="call-outline"
                  type="ionicon"
                  color="white"
                  size={18}
                />
              </TouchableOpacity>
            )}
          </View>

          <Text
            style={[
              styles.h5,
              {
                fontWeight: "bold",
                color: colors.primaryColor,
                marginTop: 15,
                borderBottomWidth: 1,
                paddingBottom: 10,
                borderColor: "#d3d3d3",
              },
            ]}
          >
            Family Details :
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{ flexDirection: "row", width: "85%", paddingTop: 10 }}
            >
              <Text style={[styles.h6, { fontWeight: "bold" }]}>
                Father name :
              </Text>
              <Text style={[styles.h6, { marginTop: 1, marginLeft: 10 }]}>
                {data?.family_details?.father_name}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", width: "45%", paddingTop: 10 }}>
            <Text style={[styles.h6, { fontWeight: "bold" }]}>
              Occupation :
            </Text>
            <Text style={[styles.h6, { marginTop: 1, marginLeft: 10 }]}>
              {data?.family_details?.occupation}
            </Text>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{ flexDirection: "row", width: "45%", paddingTop: 10 }}
            >
              <Text style={[styles.h6, { fontWeight: "bold" }]}>
                Annual Income :
              </Text>
              <Text style={[styles.h6, { marginTop: 1, marginLeft: 10 }]}>
                ₹ {data?.family_details?.annual_income}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "45%",
              paddingTop: 10,
            }}
          >
            <Text style={[styles.h6, { fontWeight: "bold" }]}>
              Contact Details :
            </Text>

            {data?.family_details?.phone && (
              <TouchableOpacity
                onPress={() => handleCall(data?.family_details?.phone)}
                style={{
                  backgroundColor: colors.primaryColor,
                  padding: 5,
                  marginLeft: 10,
                  borderRadius: 50,
                }}
              >
                <Icon
                  name="call-outline"
                  type="ionicon"
                  color="white"
                  size={18}
                />
              </TouchableOpacity>
            )}
          </View>
          {!view && (
            <View style={style.button}>
              {data?.like?.some((like) => like.user === userId) ? (
                <Button
                  text={"You`ve shortlisted"}
                  backgroundColor={colors.primaryColor}
                  color={false}
                />
              ) : (
                <>
                  {loading ? (
                    <Button load={true} backgroundColor={colors.primaryColor} />
                  ) : (
                    <Button
                      text={"Shortlist"}
                      onpress={() => send()}
                      backgroundColor={colors.primaryColor}
                      color={false}
                    />
                  )}
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: 330,
    // borderRadius: 15,
    borderBottomLeftRadius:15,
    borderBottomRightRadius:15
  },
  shadowImage: {
    width: '100%',
    position: 'absolute',
    height: 330,
    // borderRadius: 15,
    borderBottomLeftRadius:15,
    borderBottomRightRadius:15
  },
  name: {
    fontSize: 25,
    fontWeight: '500',
    color: '#fff',
    position: 'absolute',
    bottom: 30,
    left: 25,
  },
  imageContainer: {
    width: "100%",
    height:330,
    
    zIndex: 0
  },
  age: {
    fontSize: 13,
    color: '#fff',
    position: 'absolute',
    bottom: 10,
    left: 25,
  },
  scrollView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  infoContainer: {
    backgroundColor: '#ffff',
    marginHorizontal: 10,
    marginVertical: 15,
    borderRadius: 20,
    padding: 20,
    zIndex: 1,
  },
  button: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 20
  },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: "#dfd5f7",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    marginRight: 10
  }
});
