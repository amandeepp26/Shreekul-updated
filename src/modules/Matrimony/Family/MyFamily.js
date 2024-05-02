import React, { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import styles from "../../navigation/styles";
import { ScrollView } from "react-native";
import FamilyCard from "../components/FamilyCard";
import { Icon } from "react-native-elements";
import { colors } from "../../../styles";
import apiClient from "../../../utils/apiClient";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

export default function MyFamily({ navigation }) {
    const [data,setData] = useState(null);
    const token = useSelector(state => state.session.authToken);

    useFocusEffect(
        useCallback(() => {
            getFamily();
          }, [])
        );

    const getFamily =async()=>{
        try {
            const response = await apiClient.get(apiClient.Urls.getFamilyTree, {
              authToken: token
            });
        
            console.warn('Family response is', response)
            if (response.success) {
                const filteredFamilyData = response.family_tree.filter(
                    (member) => member.full_name
                  );
                  setData(filteredFamilyData);
            }
            else {
                setData(null);
              Toast.show({
                text1: response.message || 'Something went wrong!',
                type: 'error',
              });
              
            }
          } catch (e) {
            Toast.show({
              text1: e.message || e || 'Something went wrong!',
              type: 'error',
            });
          }
    }
  return (
    <View style={style.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="chevron-back-outline" type="ionicon" size={20} />
        </Pressable>
        <Text style={[styles.h4, { marginLeft: 10 }]}>My Family</Text>
      </View>
      <ScrollView>
        <FamilyCard data={data} refresh={getFamily} navigation={navigation} />
      </ScrollView>

      {/* Floating Plus button */}
      <Pressable style={style.floatingButton} onPress={() => navigation.navigate('AddMember')}>
        <Icon name="add-outline" type="ionicon" size={35} color="#fff" />
      </Pressable>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: colors.primaryColor, // Change the background color to your preference
    borderRadius: 30,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
