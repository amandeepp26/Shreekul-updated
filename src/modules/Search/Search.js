//import liraries
import React, { Component, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, StatusBar,Linking,Pressable } from 'react-native';
import styles from '../navigation/styles';
import NotSubscribed from '../../components/NotSubscribed';
import { useDispatch, useSelector } from 'react-redux';
import MatrimonyListing from '../Matrimony/MatrimonyListing';
import MatrimonyTabs from '../navigation/TopTabs';
import { Icon } from 'react-native-elements';
import { colors } from '../../styles';
import MatrimonySearch from '../Matrimony/Search';
import { getProfile, setFilter } from '../../redux/Matrimony/Search';

// create a component
function Search({ navigation }) {
    const token = useSelector(state => state.session.authToken);
    const profile = useSelector(state => state.session.profile)
    const filter = useSelector(state => state.search.filter)
    StatusBar.setBackgroundColor(colors.primaryColor);
    const dispatch = useDispatch();

    return (
      <>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.primaryColor }}>
          <View style={style.container}>
            <View
              style={{
                width: "100%",
                // justifyContent: "center",
                // backgroundColor: "red",
              }}
            >
              <Image
                source={require("./images/Nosearch.png")}
                resizeMode="contain"
                style={{
                  width: "100%",
                  height: "60%",
                  //   backgroundColor: "blue",
                }}
              />
              <Text
                style={[
                  styles.h4,
                  { textAlign: "center", fontWeight: "bold", marginBottom: 10 },
                ]}
              >
                Coming soon...
              </Text>
            </View>
            <Pressable
              style={{
                width: "100%",
                height: "19%",
                alignSelf: "center",
                borderRadius: 2,
                position: "absolute",
                bottom: 65,
              }}
              onPress={() => Linking.openURL("https://www.dogcarecentre.in/")}
            >
              <Image
                source={require("./../../../assets/images/dogcarecentre.jpeg")}
                resizeMode="contain"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </Pressable>
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
export default Search;
