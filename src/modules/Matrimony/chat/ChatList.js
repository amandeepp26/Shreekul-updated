import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity
} from "react-native";
import React, { useEffect, useState } from "react";
import ChatCard from "../components/ChatCard";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../../styles";
import styles from "../../navigation/styles";
import { SafeAreaView } from "react-native";
import apiClient, { baseUrl } from "../../../utils/apiClient";
import Toast from "react-native-toast-message";
import { getMatchedMatrimony } from "../../../redux/Matrimony/Search";
import { useFocusEffect } from "@react-navigation/native";
import {Icon} from 'react-native-elements'
import NotSubscribed from "../../../components/NotSubscribed";
export default function ChatList({ navigation }) {
  const data = useSelector((state) => state.search.matchedData);
  const [loading, setLoading] = useState(false);
 const profile = useSelector((state) => state.session.profile);
  const userId = useSelector(
    (state) => state.session.profile.matrimony_registration?._id
  );
  const myLikes = useSelector(
    (state) => state.session.profile.matrimony_registration?.like
  );
  const dispatch = useDispatch();
  const [adImage, setAdImage] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      // This function will be called when the screen is focused
      dispatch(getMatchedMatrimony(userId));
    }, [userId, dispatch])
  );
    useEffect(() => {
      getAd();
    }, []);

    const getAd = async () => {
      try {
        const response = await apiClient.get(apiClient.Urls.getAds, {});
        if (response.success) {
          const menuAd = response.data.find((ad) => ad.placement === "Chat");
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
  if (profile?.matrimony_registered == 0) {
    return (
      <View style={[style.container,{justifyContent:'center',alignItems:'center'}]}>
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

  if (data?.length == 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primaryColor }}>
        <View style={style.container}>
          <View
            style={{
              alignItems: "center",
              flex: 1,
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../images/nomatch.png")}
              resizeMode="contain"
              style={{ width: "100%", height: "70%", alignSelf: "center" }}
            />
            <Text
              style={[
                styles.h4,
                {
                  textAlign: "center",
                  fontWeight: "bold",
                  marginTop: -80,
                  marginBottom: 10,
                },
              ]}
            >
              No match found yet...
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primaryColor }}>
      <View style={style.container}>
        <View style={style.header}>
          <Text style={[styles.h3, { color: "#fff" }]}>Chats</Text>
        </View>
        <ScrollView>
          <View style={{ paddingHorizontal: 20, paddingBottom: 220 }}>
            {data?.map((user) => {
              return (
                <ChatCard key={user?._id} navigation={navigation} data={user} />
              );
            })}
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

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // justifyContent: "center",
    // alignItems: "center",
    // paddingHorizontal: 20,
    // paddingBottom: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.primaryColor,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
});
