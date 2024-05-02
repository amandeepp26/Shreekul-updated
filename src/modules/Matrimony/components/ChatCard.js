import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Image } from "react-native";
import styles from "../../navigation/styles";
import { colors } from "../../../styles";
import { useSelector } from "react-redux";
import moment from "moment";
import { baseUrl } from "../../../utils/apiClient";
import { Icon } from "react-native-elements";

export default function ChatCard({ navigation, data }) {
  const profile = useSelector((state) => state.session.profile);
  const [lastReceivedMessage, setLastReceivedMessage] = useState(null);
  const [lastMessageTime, setlastMessageTime] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0); // New state for unread messages
  const [readMessages, setReadMessages] = useState({}); // Track read messages
  const [latestMessagePhoto, setLatestMessagePhoto] = useState(false);
  const [message, setmessage] = useState("");

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(`wss://api.welkinhawk.in`);
    const socket = socketRef.current;

    socket.onopen = () => {
      console.log("WebSocket connection opened");

      // Join the room on WebSocket connection for all users
      socket.send(
        JSON.stringify({
          type: "join",
          user1: profile.matrimony_registration._id,
          user2: data._id,
          username: profile?.fullname,
        })
      );
    };

    // Listen for incoming messages for all users
    socket.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      console.log("Received message:", receivedMessage);

      // if (receivedMessage.senderId === data._id) {
      setLastReceivedMessage(receivedMessage.text);
      setlastMessageTime(new Date());
      if (receivedMessage._id === data._id) {
        // Check if the message is unread (using local state)
        if (!readMessages[receivedMessage._id]) {
          setUnreadMessages((prevUnread) => prevUnread + 1);

          // Mark the message as read in local state
          setReadMessages((prevReadMessages) => ({
            ...prevReadMessages,
            [receivedMessage._id]: true,
          }));
        }
      }
      // }
    };

    // Close WebSocket connection on component unmount
    return () => {
      socket.close();
    };
  }, [
    data,
    profile.matrimony_registration._id,
    lastReceivedMessage,
    unreadMessages,
    readMessages,
  ]);

  const formatLastReceivedTime = () => {
    if (lastMessageTime) {
      return moment(lastMessageTime).format("hh:mm a");
    }
    return null;
  };

  useEffect(() => {
    console.warn(lastMessageTime);
    const fetchMessages = async () => {
      try {
        // Fetch messages from the backend endpoint
        const response = await fetch(
          `${baseUrl}api/message/fetch?senderId=${profile.matrimony_registration._id}&receiverId=${data._id}`
        );

        if (response) {
          const fetchedMessages = await response.json();

          // setmessage(fetchedMessages);

          console.warn("latest message is---->", fetchedMessages[0]?.text);
          if (fetchedMessages[0]?.image) {
            setLatestMessagePhoto(true);
          } else {
            setLatestMessagePhoto(false);
            setmessage(fetchedMessages[0]?.text);
          }
          setlastMessageTime(fetchedMessages[0]?.timestamp);
        } else {
          console.error("Error fetching messages:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [profile.matrimony_registration._id, data]);

  return (
    <Pressable
      style={style.container}
      onPress={() => {
        navigation.navigate("ChatBox", { data: data }), setUnreadMessages(0);
      }}
    >
      <Image
        source={{ uri: data.profile_image }}
        resizeMode="contain"
        style={{ width: 50, height: 50, borderRadius: 100 }}
      />
      <View style={style.userInfoContainer}>
        <Text style={[styles.h4, { fontWeight: "600" }]}>{data.fullname}</Text>

        {latestMessagePhoto ? (
          <View
            style={{ alignItems: "center", flexDirection: "row", marginTop: 3 }}
          >
            <Icon type="ionicon" name="camera-outline" size={16} />
            <Text
              style={[
                styles.p,
                {
                  color: "#000",
                  fontSize: 14,
                  fontWeight: 700,
                  marginLeft: 5,
                },
              ]}
            >
              Photo
            </Text>
          </View>
        ) : (
          <Text
            style={[
              styles.p,
              {
                color: "#000",
                fontSize: 15,
                fontWeight: 700,
              },
            ]}
          >
            {lastReceivedMessage || message}
          </Text>
        )}
        {/* {lastReceivedMessage !== null ? lastReceivedMessage : message} */}
      </View>
      <View style={style.messageInfo}>
        <Text style={[styles.p]}>{formatLastReceivedTime()}</Text>
        {unreadMessages > 0 && (
          <View style={style.messageCount}>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {unreadMessages}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingVertical: 15,
    borderBottomColor: "#d3d3d3",
  },
  userInfoContainer: {
    paddingLeft: 10,
  },
  messageInfo: {
    position: "absolute",
    right: 0,
    top: 10,
  },
  messageCount: {
    backgroundColor: colors.primaryColor,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    position: "absolute",
    top: 22,
    right: 0,
  },
});
