import "react-native-gesture-handler";
import React from "react";
import { connect } from "react-redux";

import { createStackNavigator } from "@react-navigation/stack";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import StackNavigationData from "./stackNavigationData";
import { colors, fonts } from "../../styles";

const Stack = createStackNavigator();

function NavigatorView(props) {
  // const headerLeftComponentMenu = () => {
  //   return (
  //     <TouchableOpacity
  //       onPress={() => props.navigation.toggleDrawer()}
  //       style={{
  //         paddingHorizontal: 16,
  //         paddingVertical: 12,
  //       }}
  //     >
  //       <Image
  //         source={require('@images/settings.png')}
  //         resizeMode="contain"
  //         style={{
  //           height: 20,
  //           left: -15,
  //         }}
  //       />
  //     </TouchableOpacity>
  //   )
  // }

  // const headerRightSearchComponent = () => {
  //   return (
  //     <View style={{ flexDirection: 'row', padding: 5, alignItems: 'center', justifyContent: 'center' }}>

  //     </View>
  //   )
  // }

  return (
    <Stack.Navigator>
      {StackNavigationData.map((item, idx) => (
        <Stack.Screen
          key={`stack_item-${idx + 1}`}
          name={item.name}
          component={item.component}
          options={{
            title: "",
            headerShown: false,
            headerLeft: null,
            headerRight: null,
            headerBackground: null,
            headerTitleStyle: null,
          }}
        />
      ))}
    </Stack.Navigator>
  );
}

export default connect((state) => {
  return {};
}, {})(NavigatorView);
