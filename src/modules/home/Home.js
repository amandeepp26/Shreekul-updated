//import liraries
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import styles from "../navigation/styles";
import NotSubscribed from "../../components/NotSubscribed";
import { useDispatch, useSelector } from "react-redux";
import MatrimonyListing from "../Matrimony/MatrimonyListing";
import MatrimonyTabs from "../navigation/TopTabs";
import { Icon } from "react-native-elements";
import { colors } from "../../styles";
import MatrimonySearch from "../Matrimony/Search";
import {
  getLikedMatrimony,
  getLikesReceived,
  getMatchedMatrimony,
  getMatrimony,
  getProfile,
  setFilter,
  setLikedCount,
  setLoading,
} from "../../redux/Matrimony/Search";
import apiClient from "../../utils/apiClient";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";

// create a component
function Home({ navigation }) {
  const token = useSelector((state) => state.session.authToken);
  const userId = useSelector(
    (state) => state.session.profile?.matrimony_registration?._id
  );
  const profile = useSelector((state) => state.session.profile);
  const filter = useSelector((state) => state.search.filter);

  const data = useSelector((state) => state.search.likedData);
  const [refresh, setRefresh] = useState(false);
  StatusBar.setBackgroundColor(colors.primaryColor);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      // This function will be called when the screen is focused
      dispatch(getMatrimony(userId));
      dispatch(getLikedMatrimony(userId));
      dispatch(getLikesReceived(userId));
      dispatch(getMatchedMatrimony(userId));
      dispatch(getProfile(token));
    }, [userId, dispatch])
  );

  // useEffect(() => {
  //   dispatch(getProfile(token));
  // }, []);
  if (profile?.matrimony_registered == 0) {
    return (
      <View style={style.container}>
        <NotSubscribed
          navigation={navigation}
          text={
            "You're not Subscribed, Please Subscribe for the matrimony registration."
          }
          buttonText={"Subscribe"}
        />
      </View>
    );
  }
   else if (!filter) {
    return <MatrimonySearch />;
  }
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primaryColor }}>
        {/* Header */}
        <View>
          <View style={style.header}>
            <TouchableOpacity onPress={() => navigation.navigate("Shortlist")}>
              <Icon
                name="star-outline"
                type="ionicon"
                color={colors.white}
                size={20}
              />
              {/* {data?.length > 0 && (
                <View style={style.badge}>
                  <Text style={style.badgeText}>{data?.length}</Text>
                </View>
              )} */}
            </TouchableOpacity>
            <Icon
              name="search-outline"
              type="ionicon"
              color={colors.white}
              size={20}
              onPress={() => {
                navigation.navigate('MatrimonySearch')
                // dispatch(setFilter(false), setLoading(false));
              }}
            />
          </View>
        </View>
        {/* <MatrimonyTabs /> */}
        <MatrimonyListing navigation={navigation} />
      </SafeAreaView>
    </>
  );
}

// define your styles
const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.primaryColor,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  badge: {
    borderRadius: 100,
    width: 20,
    height: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    backgroundColor: "#f5d142",
    top: -7,
    right: -12,
  },
  badgeText: {
    color: colors.primaryColor,
    fontWeight: "bold",
    fontSize: 12,
  },
});

//make this component available to the app
export default Home;
