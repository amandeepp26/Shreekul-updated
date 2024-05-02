import { ActivityIndicator, Dimensions, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../../styles';
import MatrimonyCard from './components/MatrimonyCard';
import { useDispatch, useSelector } from 'react-redux';

export default function Liked({ navigation }) {

 const data = useSelector(state=>state.search.likedData);
  return (
    <SafeAreaView style={{flex:1,backgroundColor:colors.white}} >
    <View style={style.container}>
      <ScrollView>
          <>
            {data &&
              <MatrimonyCard navigation={navigation} data={data} like={true} />
            }
          </>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
