//import liraries
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Linking,
  ScrollView,
  Dimensions,
  SafeAreaView
} from "react-native";
import Share from "react-native-share";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import { colors, fonts } from "../../styles";
import { setAuthData } from "../auth/session";
import Toast from "react-native-toast-message";
import { setOTP, skipNow, setReferalId,logout } from "../auth/signin";
import styles from "../navigation/styles";
import { setData, setFilter, setLoading } from "../../redux/Matrimony/Search";
import { Icon } from "react-native-elements";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import apiClient from "../../utils/apiClient";

// create a component
function Profile({ navigation }) {
  const profile = useSelector((state) => state.session.profile);
  const dispatch = useDispatch();
  const [adImage, setAdImage] = useState("");
  console.warn("profile--->", profile);

  const onShareApp = async () => {
    try {
      const options = {
        type: "link",
        url: `https://your-app-download-link.com/${profile._id}`,
        message: "Check out this amazing app!",
        title: "Share PDF",
      };
      await Share.open(options);
    } catch (e) {
      console.error("Error during sharing:", e.message);
    }
  };

    useEffect(() => {
      getAd();
    }, []);

    const getAd = async () => {
      try {
        const response = await apiClient.get(apiClient.Urls.getAds, {});
        if (response.success) {
          const menuAd = response.data.find(
            (ad) => ad.placement === "Menu"
          );
          if (menuAd) {
            setAdImage(menuAd.image);
          }
        } else {
          // Handle unsuccessful response
        }
      } catch (e) {
        console.error(e);
      }
    };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={style.container}>
        <ScrollView showVerticalScrollIndicator={false}>
          <View style={{ flex: 1, paddingBottom: 220 }}>
            <View style={style.profileHeader}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {profile.matrimony_registered == 1 ? (
                  <Image
                    source={{
                      uri: profile?.matrimony_registration?.profile_image
                        ? profile?.matrimony_registration?.profile_image
                        : "https://www.emmegi.co.uk/wp-content/uploads/2019/01/User-Icon.jpg",
                    }}
                    resizeMode="contain"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 55,
                      marginVertical: 7,
                      marginRight: 10,
                    }}
                  />
                ) : (
                  <Image
                    source={{
                      uri: profile?.profile_image
                        ? profile?.profile_image
                        : "https://www.emmegi.co.uk/wp-content/uploads/2019/01/User-Icon.jpg",
                    }}
                    resizeMode="contain"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 55,
                      marginVertical: 7,
                      marginRight: 10,
                    }}
                  />
                )}
                <View>
                  <Text style={styles.h4}>{profile?.fullname}</Text>
                  <Text style={styles.h6}>{profile.phone}</Text>
                </View>
              </View>
            </View>
            <View style={{ marginHorizontal: 15, marginVertical: 5 }}>
              <Text style={[styles.h5, { marginBottom: 10 }]}>Account</Text>

              {profile.matrimony_registered == 1 ? (
                <View
                  style={{
                    borderRadius: 10,
                    backgroundColor: "#fff",
                    borderColor: "#e5e5e5",
                  }}
                >
                  <Pressable
                    onPress={() => navigation.navigate("EditMatrimonyProfile")}
                    style={style.tab}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Icon name="person-outline" size={20} type="ionicon" />
                      <Text
                        style={[
                          styles.h5,
                          { marginLeft: 15, fontFamily: fonts.primaryBold },
                        ]}
                      >
                        Profile
                      </Text>
                    </View>
                    <Icon
                      name="chevron-forward-outline"
                      size={20}
                      type="ionicon"
                    />
                  </Pressable>
                  {/* <Pressable
                  onPress={() => navigation.navigate("EditOtherDetails")}
                  style={style.tab}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name="analytics-outline" size={20} type="ionicon" />
                    <Text
                      style={[
                        styles.h5,
                        { marginLeft: 15, fontFamily: fonts.primaryBold },
                      ]}
                    >
                      Other Details
                    </Text>
                  </View>
                  <Icon
                    name="chevron-forward-outline"
                    size={20}
                    type="ionicon"
                  />
                </Pressable> */}

                  {/* <Pressable onPress={()=>navigation.navigate('MyFamily')} style={[style.tab]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name='people-outline' size={20} type='ionicon' />
                            <Text style={[styles.h5, { marginLeft: 15, fontFamily: fonts.primaryBold }]}>
                                My Family
                            </Text>
                        </View>

                        <Icon name='chevron-forward-outline' size={20} type='ionicon' />
                    </Pressable> */}
                  <Pressable
                    onPress={() => navigation.navigate("ChangePhone")}
                    style={[style.tab, { borderBottomWidth: 0 }]}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Icon
                        name="lock-closed-outline"
                        size={20}
                        type="ionicon"
                      />
                      <Text
                        style={[
                          styles.h5,
                          { marginLeft: 15, fontFamily: fonts.primaryBold },
                        ]}
                      >
                        Change Phone
                      </Text>
                    </View>

                    <Icon
                      name="chevron-forward-outline"
                      size={20}
                      type="ionicon"
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => navigation.navigate("ChangeEmail")}
                    style={[style.tab, { borderBottomWidth: 0 }]}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Icon
                        name="lock-closed-outline"
                        size={20}
                        type="ionicon"
                      />
                      <Text
                        style={[
                          styles.h5,
                          { marginLeft: 15, fontFamily: fonts.primaryBold },
                        ]}
                      >
                        Change Email
                      </Text>
                    </View>

                    <Icon
                      name="chevron-forward-outline"
                      size={20}
                      type="ionicon"
                    />
                  </Pressable>
                </View>
              ) : (
                <View
                  style={{
                    borderRadius: 10,
                    backgroundColor: "#fff",
                    borderColor: "#e5e5e5",
                  }}
                >
                  <Pressable
                    onPress={() => navigation.navigate("EditProfile")}
                    style={[style.tab]}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Icon name="person-outline" size={20} type="ionicon" />
                      <Text
                        style={[
                          styles.h5,
                          { marginLeft: 15, fontFamily: fonts.primaryBold },
                        ]}
                      >
                        Profile
                      </Text>
                    </View>
                    <Icon
                      name="chevron-forward-outline"
                      size={20}
                      type="ionicon"
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => navigation.navigate("ChangePhone")}
                    style={[style.tab, { borderBottomWidth: 0 }]}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Icon
                        name="lock-closed-outline"
                        size={20}
                        type="ionicon"
                      />
                      <Text
                        style={[
                          styles.h5,
                          { marginLeft: 15, fontFamily: fonts.primaryBold },
                        ]}
                      >
                        Change Phone/Email
                      </Text>
                    </View>

                    <Icon
                      name="chevron-forward-outline"
                      size={20}
                      type="ionicon"
                    />
                  </Pressable>
                </View>
              )}
            </View>

            <View style={{ marginHorizontal: 15, marginVertical: 5 }}>
              <Text style={[styles.h5, { marginBottom: 10 }]}>Support</Text>
              <View
                style={{
                  borderRadius: 10,
                  backgroundColor: "#fff",
                  borderColor: "#e5e5e5",
                }}
              >
                {/* <Pressable style={style.tab}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon name="notifications-outline" size={20} type="ionicon" />
                  <Text
                    style={[
                      styles.h5,
                      { marginLeft: 15, fontFamily: fonts.primaryBold },
                    ]}
                  >
                    Notifications
                  </Text>
                </View>
                <Icon name="chevron-forward-outline" size={20} type="ionicon" />
              </Pressable> */}

                <Pressable
                  style={style.tab}
                  onPress={() => navigation.navigate("AboutUs")}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon
                      name="information-circle-outline"
                      size={20}
                      type="ionicon"
                    />
                    <Text
                      style={[
                        styles.h5,
                        { marginLeft: 15, fontFamily: fonts.primaryBold },
                      ]}
                    >
                      About Us
                    </Text>
                  </View>
                  <Icon
                    name="chevron-forward-outline"
                    size={20}
                    type="ionicon"
                  />
                </Pressable>

                <Pressable
                  style={style.tab}
                  onPress={() => navigation.navigate("PrivacyPolicy")}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name="document-outline" size={20} type="ionicon" />
                    <Text
                      style={[
                        styles.h5,
                        { marginLeft: 15, fontFamily: fonts.primaryBold },
                      ]}
                    >
                      Privacy Policy
                    </Text>
                  </View>
                  <Icon
                    name="chevron-forward-outline"
                    size={20}
                    type="ionicon"
                  />
                </Pressable>
                <Pressable onPress={onShareApp} style={[style.tab]}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon
                      name="share-social-outline"
                      size={20}
                      type="ionicon"
                    />
                    <Text
                      style={[
                        styles.h5,
                        { marginLeft: 15, fontFamily: fonts.primaryBold },
                      ]}
                    >
                      Share App
                    </Text>
                  </View>
                  <Icon
                    name="chevron-forward-outline"
                    size={20}
                    type="ionicon"
                  />
                </Pressable>
                <Pressable
                  onPress={() => {
                    dispatch(logout());
                    dispatch(setAuthData(null, null));
                    // dispatch(setData([]))
                    // dispatch(skipNow(true));
                    // dispatch(setOTP(""));
                    // dispatch(setReferalId(null));
                    GoogleSignin.revokeAccess();
                    // dispatch(setFilter(false));
                    // dispatch(setLoading(false));
                    Toast.show({
                      text1: "Logout successfully",
                      type: "success",
                    });
                  }}
                  style={[style.tab, { borderBottomWidth: 0 }]}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name="log-out-outline" size={20} type="ionicon" />
                    <Text
                      style={[
                        styles.h5,
                        { marginLeft: 15, fontFamily: fonts.primaryBold },
                      ]}
                    >
                      Logout
                    </Text>
                  </View>

                  <Icon
                    name="chevron-forward-outline"
                    size={20}
                    type="ionicon"
                  />
                </Pressable>
              </View>
            </View>
            {/* <Pressable style={style.profileHeader}>
                <Icon name='person-outline' type='ionicon' />
            </Pressable> */}
            {/* <View style={{ position: 'absolute', bottom: 100 }}>
                <Button onpress={() => {
                    dispatch(setAuthData(null, null));
                    dispatch(setData([]))
                    dispatch(skipNow(true));
                    dispatch(setFilter(false));
                    Toast.show({
                        text1: 'Logout successfully',
                        type: 'success'
                    })
                }} text="Logout" backgroundColor={colors.secondaryColor} color={true} />
            </View> */}
          </View>
        </ScrollView>
        {adImage != "" && (
          <Pressable
            style={{
              position: "absolute",
              bottom: 65,
              width: "100%",
              height: "18%",
              alignSelf: "center",
            }}
            onPress={() => Linking.openURL("https://welkinhawk.co.in/")}
          >
            <Image
              source={{
                uri: adImage,
              }}
              resizeMode="contain"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

// define your styles
const style = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 7,
    // paddingBottom: 60,
  },
  profileHeader: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    margin: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  tab: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    // marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#e5e5e5",
    marginBottom: 10,
  },
  chip: {
    backgroundColor: "#dfd5f7",
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
});

//make this component available to the app
export default Profile;
