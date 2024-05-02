import React, { useEffect } from "react";
import Navigator from "./navigation/Navigator";
import messaging from "@react-native-firebase/messaging";
import { useDispatch } from "react-redux";
import { setFcmToken } from "./auth/signin";
export default function AppView({ navigation }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage
      );
      navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
          setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });

    requestUserPermission();
    getToken();
  }, []);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.warn("A new FCM message arrived!", remoteMessage);
    });

    return unsubscribe;
  }, []);
  const getToken = async () => {
    const token = await messaging().getToken();
    console.log("FCM TOKEN IS this one------->", token);
    dispatch(setFcmToken(token));
    // save the token to the db
  };
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  };
  return <Navigator onNavigationStateChange={() => {}} uriPrefix="/app" />;
}
