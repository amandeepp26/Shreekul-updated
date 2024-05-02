import React from "react";
import NavigatorView from "./RootNavigation";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./MainTabNavigator";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import Login from "../auth/Login";
import Otp from "../auth/Verify-otp";
import Signup from "../auth/Signup";
import SignupVerification from "../auth/SignupVerification";
import MatrimonyRegistration from "../Matrimony/Registration/MatrimonyRegistration";
import Search from "../Matrimony/Search";
import MatrimonyListing from "../Matrimony/MatrimonyListing";
import Pricing from "../Matrimony/Pricing";
import ChatList from "../Matrimony/chat/ChatList";
import ChatBox from "../Matrimony/chat/ChatBox";
import ProfileDetail from "../Matrimony/ProfileDetail";
import Splash from "../Splash/Splash";
import SignupMailVerification from "../auth/SignupMailVerification";

function Navigator(props) {
  // console.warn(props);
  if (!props.authToken && props.skip) {
    const Stack = createStackNavigator();
    return (
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Otp" component={Otp} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="SignupOtp" component={SignupVerification} />
        <Stack.Screen name="SignupMailOtp" component={SignupMailVerification} />
        {/* <Stack.Screen name="Matrimony" component={TabNavigator} /> 
        <Stack.Screen name="MatrimonySubscription" component={MatrimonyRegistration} /> 
        <Stack.Screen name="pricing" component={Pricing} /> 
        <Stack.Screen name="matrimonySearch" component={Search} /> 
        <Stack.Screen name="MatrimonyListing" component={MatrimonyListing} /> 
        <Stack.Screen name="ChatList" component={ChatList} /> 
        <Stack.Screen name="ChatBox" component={ChatBox} /> 
        <Stack.Screen name="ProfileDetail" component={ProfileDetail} />  */}

        {/* <Stack.Screen name="OtpVerification" component={OtpVerification} />
        <Stack.Screen
          name="SignupOtpVerification"
          component={SignupOtpVerification}
        />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="SignupDetails" component={SignupDetails} />
        <Stack.Screen name="Skip" component={Skip} />
        <Stack.Screen name="LookingFor" component={LookingFor} />
        <Stack.Screen name="SelectCity" component={SelectCity} />
        <Stack.Screen name="SelectLocation" component={SelectLocation} />
        <Stack.Screen
          name="SelectPropertyType"
          component={SelectPropertyType}
        />
        <Stack.Screen name="Home" component={TabNavigator} /> */}
      </Stack.Navigator>
    );
  }
  return <NavigatorView />;
}

export default connect(
  (state) => {
    return {
      authToken: state.session.authToken,
      profile: state.session.profile,
      skip: state.signin.skip,
    };
  }
  // {
  //   logout,
  //   skipNow,
  // },
)(Navigator);
