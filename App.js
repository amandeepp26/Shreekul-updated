// import libraries
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider, useDispatch } from "react-redux";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import NetInfo from "@react-native-community/netinfo";
import Button from "./src/components/Button";
import linking from "./src/utils/linking";
import { colors, fonts } from "./src/styles";
import { store } from "./src/redux/store";
import AppView from "./src/modules/AppView";
import Splash from "./src/modules/Splash/Splash";

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#69C779" }}
      text1Style={{
        fontSize: 12,
        fontFamily: fonts.primarySemiBold,
        marginLeft: -10,
      }}
      text1NumberOfLines={3}
      text2Style={{
        fontSize: 12,
        fontFamily: fonts.primarySemiBold,
        marginLeft: -10,
      }}
      autoHide={false}
      onPress={() => Toast.hide()}
      renderLeadingIcon={() => (
        <AntDesign
          style={[
            styles.toastIconStyles,
            { color: "#69C779", paddingLeft: 10 },
          ]}
          name={"checkcircleo"}
        />
      )}
      renderTrailingIcon={() => (
        <MaterialIcons
          style={[
            styles.toastIconStyles,
            { color: "#FE6301", paddingRight: 10 },
          ]}
          name={"cancel"}
        />
      )}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 12,
        fontFamily: fonts.primarySemiBold,
        marginLeft: -10,
      }}
      text1NumberOfLines={3}
      text2Style={{
        fontSize: 12,
        fontFamily: fonts.primarySemiBold,
        marginLeft: -10,
      }}
      autoHide={false}
      onPress={() => Toast.hide()}
      renderLeadingIcon={() => (
        <AntDesign
          style={[
            styles.toastIconStyles,
            { color: "#FE6301", paddingLeft: 10 },
          ]}
          name={"warning"}
        />
      )}
      renderTrailingIcon={() => (
        <MaterialIcons
          style={[
            styles.toastIconStyles,
            { color: "#FE6301", paddingRight: 10 },
          ]}
          name={"cancel"}
        />
      )}
    />
  ),
};

// functional component
export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  // const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    setTimeout(() => {
      setAppReady(true);
    }, 1500);

    return () => {
      unsubscribe();
    };
  }, []);

  if (!appReady) {
    return <Splash />;
  }

  if (!isConnected) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            textAlign: "center",
            fontWeight: "bold",
            width: "75%",
            color: colors.primaryColor,
          }}
        >
          It seems like you're not connected to Internet!
        </Text>
        <Image
          source={require("./assets/images/noInternet.jpeg")}
          style={{ height: 400, width: "100%" }}
        />
        <View style={{ alignItems: "center", width: "60%" }}>
          <Button
            backgroundColor={colors.primaryColor}
            onpress={() => unsubscribe()}
            color={true}
            text="Try Again"
          />
        </View>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer linking={linking}>
        <AppView />
      </NavigationContainer>
      <Toast config={toastConfig} />
    </Provider>
  );
}

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  toastIconStyles: {
    fontSize: 24,
    alignSelf: "center",
  },
});
