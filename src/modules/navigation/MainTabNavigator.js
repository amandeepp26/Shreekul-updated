import * as React from 'react';
import {connect} from 'react-redux';

import {Text, View, Image, StyleSheet, Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {colors, fonts} from '../../styles';
import styles from './styles';

import tabNavigationData from './tabNavigationData';

const Tab = createBottomTabNavigator();

function TabNavigator({navigation}) {
  const headerRightComponent = screenName => {
    return null;
  };

  return (
    <Tab.Navigator
    screenOptions={()=>({
      tabBarStyle:{
        height: Platform.OS === 'ios' ? 90 : 60,
          backgroundColor: colors.white,
          borderTopLeftRadius: 10,
          borderTopRightRadius:10,
          position: 'absolute',
          // marginHorizontal: 7,
          paddingVertical: 5,
          marginVertical: 0
      },
      headerShown:false
    })}
      // tabBarOptions={{
      //   style: {
      //     height: Platform.OS === 'ios' ? 90 : 50,
      //     backgroundColor: '#1F1F2A',
      //     borderRadius: 7,
      //     position: 'absolute',
      //     marginHorizontal: 7,
      //     paddingVertical: 5,
      //     marginVertical: 0,
      //   },
      // }}
      >
      {tabNavigationData.map((item, idx) => (
        <Tab.Screen
          key={`tab_item${idx + 1}`}
          name={item.name}
          component={item.component}
          listeners={{
            tabPress: e => {
              // Prevent default action
              navigation.setOptions({
                headerRight: () => headerRightComponent(item.name),
              });
            },
          }}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={styles.tabBarItemContainer}>
                <Image
                  resizeMode="contain"
                  source={item.icon}
                  style={[
                    styles.tabBarIcon,
                    focused && styles.tabBarIconFocused,
                  ]}
                />
              </View>
            ),
            tabBarLabel: ({focused}) =>
              focused ? (
                <Text
                  style={{
                    marginBottom: 8,
                    fontFamily: fonts.primarySemiBold,
                    fontSize: 13,
                    marginTop: 0,
                    color: colors.primaryColor,
                  }}>
                  {item.name}
                </Text>
              ) : (
                <Text
                  style={{
                    marginBottom: 8,
                    fontFamily: fonts.primaryRegular,
                    fontSize: 13,
                    marginTop: 2,
                    color: colors.black,
                  }}>
                  {item.name}
                </Text>
              ),
            // <Text style={{ fontSize: 12, color: focused ? colors.blue : colors.grey, fontFamily: fonts.primarySemiBold }}>{item.name}</Text>,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

export default connect(state => {
  return {};
}, {})(TabNavigator);
