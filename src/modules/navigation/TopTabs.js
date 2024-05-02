import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MatrimonyListing from "../Matrimony/MatrimonyListing";
import ChatList from "../Matrimony/chat/ChatList";
import { colors } from "../../styles";
import { useSelector } from "react-redux";
import Liked from "../Matrimony/Liked";
import Likes from "../Matrimony/Likes";

const Tab = createMaterialTopTabNavigator();

function MatrimonyTabs() {
  const matchedCount = useSelector((state) => state.search.matchedCount);
  const userId = useSelector(
    (state) => state.session.profile?.matrimony_registration?._id
  );
  const [initialRoute, setInitialRoute] = useState("Listing");
  const data = useSelector((state) => state.search.data);

  const matcheddata = useSelector((state) => state.search.matchedData);
  const myLikes = useSelector(
    (state) => state.session.profile?.matrimony_registration?.like
  );

  // const listingData = data?.filter(
  //   (user) =>
  //     !user.like?.find(
  //       (like) => like.user === myLikes?.find((like) => like.user)
  //     ) &&
  //     !(
  //       user.like?.some((key) => key.user === userId) &&
  //       myLikes?.some((key) => key.user === user._id)
  //     )
  // );
   const likeddata = useSelector((state) => state.search.likedData);
   const likesReceivedData = useSelector(
     (state) => state.search.likesReceivedData
   );

  // useEffect(() => {
  //   setInitialRoute(`Listing (${listingData?.length})`);
  // }, [data]);

  return (
    <Tab.Navigator
      // initialRouteName={initialRoute} // Set the initial tab
      tabBarOptions={{
        activeTintColor: colors.white, // Customize tab label colors
        inactiveTintColor: "gray",
        labelStyle: { fontSize: 16, fontWeight: "500" },
        style: {
          backgroundColor: colors.primaryColor, // Customize tab bar background color
        },
        indicatorStyle: {
          backgroundColor: colors.white, // Set the border bottom color
        },
      }}
    >
      <Tab.Screen name={`Liked (${likeddata?.length})`} component={Liked} />
      <Tab.Screen
        name={`Likes (${likesReceivedData?.length})`}
        component={Likes}
      />
    </Tab.Navigator>
  );
}

export default MatrimonyTabs;
