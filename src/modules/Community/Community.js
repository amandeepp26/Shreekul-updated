//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image,Pressable,Linking, SafeAreaView, StatusBar } from 'react-native';
import styles from '../navigation/styles';
import NotSubscribed from '../../components/NotSubscribed';
import { useDispatch, useSelector } from 'react-redux';
import MatrimonyListing from '../Matrimony/MatrimonyListing';
import MatrimonyTabs from '../navigation/TopTabs';
import { Icon } from 'react-native-elements';
import { colors } from '../../styles';
import MatrimonySearch from '../Matrimony/Search';
import { getProfile, setFilter } from '../../redux/Matrimony/Search';
import apiClient from '../../utils/apiClient';

// create a component
function Community({ navigation }) {
    const token = useSelector(state => state.session.authToken);
    const profile = useSelector(state => state.session.profile)
    const filter = useSelector(state => state.search.filter)
    const [adImage,setAdImage] = useState('');
    StatusBar.setBackgroundColor(colors.primaryColor);
    const dispatch = useDispatch();

    useEffect(()=>{
      getAd();
    },[])

  const getAd = async () => {
    try {
      const response = await apiClient.get(apiClient.Urls.getAds, {});
      if (response.success) {
        const communityAd = response.data.find(
          (ad) => ad.placement === "Community"
        );
        if (communityAd) {
          setAdImage(communityAd.image);
        }
      } else {
        // Handle unsuccessful response
      }
    } catch (e) {
      console.error(e);
    }
  };
    return (
      <>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.primaryColor }}>
          <View style={style.container}>
            <View
              style={{
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("./images/Community.png")}
                resizeMode="contain"
                style={{ width: 400, height: "60%" }}
              />
              <Text
                style={[
                  styles.h4,
                  {
                    textAlign: "center",
                    fontWeight: "bold",
                    marginTop: -20,
                    marginBottom: 10,
                  },
                ]}
              >
                Coming soon...
              </Text>
            </View>
            {adImage!="" &&
            <Pressable
              style={{
                width: "100%",
                height: "18%",
                // marginTop:10,
                alignSelf: "center",
                position: "absolute",
                bottom: 65,
                // borderRadius: 10,
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
            }
          </View>
        </SafeAreaView>
      </>
    );
}

// define your styles
const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.primaryColor,
        paddingTop: 15,
        paddingHorizontal: 20,
    },
    badge: {
        borderRadius: 50,
        width: 20,
        height: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 7,
    },
    badgeText: {
        color: colors.primaryColor,
        fontWeight: 'bold',
        fontSize: 12,
    },
});

//make this component available to the app
export default Community;
