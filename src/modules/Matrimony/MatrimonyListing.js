import {StyleSheet, Text, View, ScrollView, SafeAreaView, Image} from 'react-native';
import React, { useEffect, useState } from 'react';
import MatrimonyCard from './components/MatrimonyCard';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../navigation/styles';
import { colors } from '../../styles';


export default function MatrimonyListing({navigation}) {
  const userId = useSelector(state => state.session.profile?.matrimony_registration?._id);
  const dispatch = useDispatch();
  // useEffect(()=>{
  //   dispatch(getMatrimony(userId));
  // },[])

  const data = useSelector(state => state.search.data)
  const myLikes = useSelector(state => state.session.profile?.matrimony_registration?.like);

  const filteredData = data?.filter(user =>
    !user.like?.find(like => like.user === myLikes?.find(like => like.user)) && !
    (user.like?.some(key => key.user === userId) && myLikes?.some(key => key.user === user._id))
  );

  if(filteredData.length==0){
    return(
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primaryColor }}>
      <View style={style.container}>
          <View style={{ alignItems: 'center',flex:1, width: '100%', justifyContent: 'center', }}>
              <Image
                  source={require('./images/Nodata.png')}
                  resizeMode="contain"
                  style={{ width: "100%", height: "70%",alignSelf:'center' }}
              />
          </View>
      </View>
  </SafeAreaView>
    )
  }
  return (
    <View style={style.container}>
     
      <ScrollView style={{paddingBottom:160}}>
        {filteredData &&
        <MatrimonyCard navigation={navigation} data={filteredData} like={false}/>
        }
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom:60
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffff',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
});
