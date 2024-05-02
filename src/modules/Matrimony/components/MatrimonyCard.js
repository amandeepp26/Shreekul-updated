import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "../../navigation/styles";
import { colors } from "../../../styles";
import { Icon } from "react-native-elements";
import Button from "../../../components/Button";
import { calculateAge } from "./calculateAge";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "../../../utils/apiClient";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import {
  getLikedMatrimony,
  getMatchedMatrimony,
  getMatrimony,
  getProfile,
} from "../../../redux/Matrimony/Search";
import { capitalizeFirstLetter } from "./capitalizeFirstLetter";
import Loader from "react-native-three-dots-loader";

export default function MatrimonyCard({ navigation, like, data }) {
  const initialLoaderStates = Array(data.length).fill(false);
  const [matched, setMatched] = useState(false);
  const [likeloader, setlikeloader] = useState(initialLoaderStates);
  const token = useSelector((state) => state.session.authToken);
  const [adImage, setAdImage] = useState("");
  const userId = useSelector(
    (state) => state.session.profile.matrimony_registration?._id
  );
  const myLikes = useSelector(
    (state) => state.session.profile.matrimony_registration?.like
  );
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();

  const sendInterest = async (id, index) => {
    setLoad(true);
    const updatedLoaderStates = [...likeloader];
    updatedLoaderStates[index] = true;
    setlikeloader(updatedLoaderStates);
    const userIDs = [userId];
    const bodyData = {};

    userIDs.forEach((e, index) => {
      // Construct the keys dynamically
      bodyData[`like[${index}][user]`] = e;
    });

    try {
      const response = await apiClient.post(
        `${apiClient.Urls.matrimonyLike}/${id}`,
        {
          ...bodyData,
        }
      );
      if (response.message == "success") {
        await dispatch(getProfile(token));
        const responseLikes = response.data.like.some(
          (key) => key.user === userId
        );
        const mylike = myLikes.some((key) => key.user === response.data._id);
        console.log("like me and he", mylike, response);
        if (responseLikes && mylike) {
          setMatched(true);
          await dispatch(getMatrimony(userId));
          dispatch(getMatchedMatrimony(userId));
        } else {
          dispatch(getMatrimony(userId));
          dispatch(getLikedMatrimony(userId));
        }
        updatedLoaderStates[index] = false;
        setlikeloader(updatedLoaderStates);
        setLoad(false);
        // navigation.navigate('Home')
      } else {
        Toast.show({
          text1: response.message || e || "Something went wrong!",
          type: "error",
        });
        updatedLoaderStates[index] = false;
        setlikeloader(updatedLoaderStates);
        setLoad(false);
        // setLoading(false)
      }
    } catch (e) {
      Toast.show({
        text1: e.message || e || "Something went wrong!",
        type: "error",
      });
      updatedLoaderStates[index] = false;
      setlikeloader(updatedLoaderStates);
      setLoad(false);
    }
  };

      function cmToFeetAndInches(cm) {
        const totalInches = cm / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        return `${feet}'${inches}"`;
      }

  useEffect(() => {
    getAd();
  }, []);

  const getAd = async () => {
    try {
      const response = await apiClient.get(apiClient.Urls.getAds, {});
      if (response.success) {
        const homeAd = response.data.find((ad) => ad.placement === "Home");
        if (homeAd) {
          setAdImage(homeAd.image);
        }
      } else {
        // Handle unsuccessful response
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (matched) {
    return (
      <Modal
        isVisible={matched}
        backdropOpacity={0.7}
        style={{ flex: 0.7, marginTop: 150, width: "90%", height: 400 }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: colors.white,
            alignItems: "center",
            borderRadius: 15,
          }}
        >
          <Pressable
            onPress={() => {
              dispatch(getMatrimony(userId));
              setMatched(false);
            }}
            style={{
              position: "absolute",
              flex: 1,
              top: 10,
              right: 10,
              zIndex: 999,
            }}
          >
            <Icon name="close" />
          </Pressable>
          <Image
            source={require("../images/match.png")}
            style={{ width: 300, height: 350 }}
          />
          <Text
            style={[
              styles.h4,
              { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
            ]}
          >
            Your profile got matched!
          </Text>
        </View>
      </Modal>
    );
  }

  return data.map((user, index) => {
    return (
      <>
        {index % 5 === 0 && index !== 0 && adImage != "" && (
          <Pressable
            onPress={() => Linking.openURL("https://www.dogcarecentre.in/")}
          >
            <Image
              source={{
                uri: adImage,
              }}
              resizeMode="contain"
              style={{
                width: "95%",
                height: 150,
                marginVertical: 10,
                borderRadius: 10,
                alignSelf: "center",
              }}
            />
          </Pressable>
        )}
        <View style={style.container}>
          {!like && (
            <>
              {user.like?.some((like) => like.user === userId) ? (
                <Pressable
                  style={{
                    position: "absolute",
                    padding: 10,
                    right: 10,
                    top: 0,
                  }}
                >
                  <Icon
                    name="star"
                    type="ionicon"
                    color={colors.primaryColor}
                    size={20}
                  />
                </Pressable>
              ) : (
                <TouchableOpacity
                  onPress={() => sendInterest(user._id, index)}
                  style={{
                    position: "absolute",
                    padding: 10,
                    right: 10,
                    top: 0,
                  }}
                >
                  <Icon
                    name="star-outline"
                    color={colors.primaryColor}
                    type="ionicon"
                    size={20}
                  />
                </TouchableOpacity>
              )}
            </>
          )}
          <Pressable
            onPress={() =>
              navigation.navigate("ProfileDetail", {
                data: user,
                like: sendInterest,
                likeloader: load,
              })
            }
            style={{
              flexDirection: "row",
              width:'90%'
              // borderBottomWidth: 1,
              // borderBottomColor: "#d3d3d3",
              // paddingBottom: 5,
            }}
          >
            <Image
              source={{ uri: user.profile_image }}
              // resizeMode="contain"
              style={{ width: 110, height: 110, borderRadius: 10 }}
            />
            <View style={{ paddingHorizontal: 20, width: "70%" }}>
              <Text
                style={[
                  styles.h5,
                  { fontWeight: 700, color: colors.primaryColor },
                ]}
              >
                {user.fullname}
              </Text>
              <Text
                style={[styles.h6, { fontWeight: 600, color: colors.gray }]}
              >
                {user?.proffessional_details?.profession!=undefined || null &&
                  `${capitalizeFirstLetter(
                    user?.proffessional_details?.profession
                  )},`}
                {user.proffessional_details.annual_income &&
                  `${user.proffessional_details.annual_income}`}
                /-
              </Text>
              <Text
                style={[styles.h6, { fontWeight: 600, color: colors.gray }]}
              >
                {user.age && `${user.age} yrs`}{" "}
                {user.height && `, ${cmToFeetAndInches(user.height)}`}{" "}
                {user.weight && `, ${user.weight} kg`}
              </Text>
              <Text
                style={[styles.h6, { fontWeight: 600, color: colors.gray }]}
              >
                {user?.highest_education &&
                  `${capitalizeFirstLetter(user?.highest_education)}`}
              </Text>
              <Text numberOfLines={1} style={[styles.h6, { fontWeight: 700 }]}>
                {capitalizeFirstLetter(user.city)}
              </Text>
            </View>
          </Pressable>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 10,
            }}
          >
            {user.hobbies && user.hobbies.trim() !== "" ? (
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignItems: "center",
                  borderTopWidth:1,
                  borderTopColor:'#d3d3d3',
                  paddingVertical:10
                }}
              >
                {user.hobbies
                  .split(",")
                  .slice(0, 3) // Display the first two hobbies
                  .map((hobby, index) => (
                    <View key={index} style={style.chip}>
                      <Text
                        style={[
                          styles.p,
                          { color: colors.primaryColor, fontSize: 10, top: -1 },
                        ]}
                      >
                        {capitalizeFirstLetter(hobby.trim())}
                      </Text>
                    </View>
                  ))}
                {user.hobbies.split(",").length > 2 && (
                  <View style={style.chip}>
                    <Text
                      style={[
                        styles.p,
                        { color: colors.primaryColor, fontSize: 10, top: -1 },
                      ]}
                    >
                      +{user.hobbies.split(",").length - 2} more
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View></View>
            )}
            {/* {!like && (
              <>
                {user.like?.some((like) => like.user === userId) ? (
                  <Pressable style={style.button}>
                    <View>
                      <Text
                        style={[
                          styles.h6,
                          { color: "#fff", fontWeight: 500, marginTop: -1 },
                        ]}
                      >
                        Shortlisted
                      </Text>
                    </View>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => sendInterest(user._id, index)}
                    style={style.button}
                  >
                    <View>
                      {likeloader[index] ? (
                        <View style={{ padding: 5 }}>
                          <Loader size={4} />
                        </View>
                      ) : (
                        <Text
                          style={[
                            styles.h6,
                            { color: "#fff", fontWeight: 500, marginTop: -1 },
                          ]}
                        >
                          Shortlist
                        </Text>
                      )}
                    </View>
                  </Pressable>
                )}
              </>
            )} */}
          </View>
        </View>
      </>
    );
  });
}

const style = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingTop: 15,
    paddingHorizontal: 15,
    position: "relative",
    marginVertical: 5,
    marginHorizontal: 10,
    elevation: 2,
    borderRadius: 10,
  },
  icon: {
    borderWidth: 1.5,
    borderColor: colors.primaryColor,
    width: 30,
    height: 30,
    borderRadius: 100,
    justifyContent: "center",
    marginRight: 10,
  },
  button: {
    backgroundColor: colors.primaryColor,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 100,
  },

  chip: {
    alignSelf: "flex-start",
    backgroundColor: "#dfd5f7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    // marginVertical: 10,
    marginRight: 10,
  },
});
