import { useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  Actions,
  Avatar,
  Bubble,
  GiftedChat,
  Time,
} from "react-native-gifted-chat";
import { useSelector } from "react-redux";
import apiClient, { baseUrl } from "../../../utils/apiClient";
import { colors } from "../../../styles";
import {
  Image,
  Pressable,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
  View,
  Modal,
  SafeAreaView,
} from "react-native";
import { Icon } from "react-native-elements";
import styles from "../../navigation/styles";
import * as ImagePicker from "react-native-image-picker";
import RNFS from "react-native-fs";
import { PERMISSIONS } from "react-native-permissions";
import ImageResizer from "react-native-image-resizer";

const ChatBox = ({ navigation }) => {
  const route = useRoute();
  const { data } = route.params;

  const [messages, setMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [ws, setWs] = useState(null);
  const [roomId, setRoomId] = useState("your_default_room_id"); // Replace with your default room ID
  const [profileId, setProfileId] = useState(""); // Assuming profile ID is a string
  const fcmToken = useSelector((state) => state.signin.fcmToken);
  const profile = useSelector((state) => state.session.profile);
  const [inputText, setInputText] = useState("");

  console.warn('profileis------->',profile)

  useEffect(() => {
    // Extracting the id from the route.params
    if (route.params) {
      const { id } = route.params;

      // Now, 'id' contains the value passed in the navigation
      console.log("ID from URI:", id);
    }
    // Add any additional logic you need with the id parameter
  }, [route.params]);
  useEffect(() => {
    console.log("data is", data);
    const socket = new WebSocket(`wss://api.welkinhawk.in`);
    socket.onopen = () => {
      console.log("WebSocket connection opened");

      // Join the room on WebSocket connection
      socket.send(
        JSON.stringify({
          type: "join",
          // room: generatedRoomId,
          user1: profile.matrimony_registration._id,
          user2: data._id,
          username: profile?.fullname,
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleMessage(data);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setWs(socket);
    const sortedUserIds = [profile.matrimony_registration._id, data._id].sort();
    const room = sortedUserIds.join("");
    setRoomId(room); // Replace with your room ID
    setProfileId(profile?.matrimony_registration?._id);

    return () => {
      // Leave the room and close the WebSocket connection when the component unmounts
      if (ws) {
        ws.send(JSON.stringify({ type: "leave", room: roomId }));
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Fetch messages from the backend endpoint
        const response = await fetch(
          `${baseUrl}api/message/fetch?senderId=${profile.matrimony_registration._id}&receiverId=${data._id}`
        );

        if (response.ok) {
          const fetchedMessages = await response.json();
          const formattedMessages = fetchedMessages.map((chatMessage) => {
            return {
              _id: `${Date.now()}_${Math.round(Math.random() * 1000000)}`,
              text: chatMessage.text,
              image: chatMessage.image,
              createdAt: new Date(chatMessage.timestamp),
              user: {
                _id: chatMessage.senderId,
                avatar:
                  chatMessage.senderId === profile.matrimony_registration._id
                    ? profile.matrimony_registration.profile_image
                    : data.profile_image,
              },
            };
          });
          setMessages(formattedMessages);
        } else {
          console.error("Error fetching messages:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [profile.matrimony_registration._id, data._id]);

  const onSend = async (newMessages = []) => {
    const message = newMessages[0];
    // console.log("Sending message:", message);

    ws.send(
      JSON.stringify({
        type: "message",
        senderId: profile.matrimony_registration._id,
        receiverId: data._id,
        text: message.text,
      })
    );

    try {
      const response = await fetch(`${baseUrl}api/message/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: profile.matrimony_registration._id,
          receiverId: data._id,
          text: message.text,
        }),
      });

      if (response.ok) {
        const sentMessage = {
          _id: message._id,
          text: message.text,
          createdAt: new Date(),
          user: {
            _id: profile.matrimony_registration._id,
            avatar: profile.matrimony_registration.profile_image, // Assuming profile_image is the avatar URL
          },
        };

        // Update local state immediately
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [sentMessage])
        );
      } else {
        console.error("Error sending message:", response);
      }
      const result = await apiClient.post(apiClient.Urls.chatNotification, {
        token: data.fcm,
        title: data.fullname,
        body: message.text,
        type: "ChatBox",
      });
      console.warn("result---->", result);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const onSendImage = async () => {
    let options = {
      title: "Select Image",
      customButtons: [],
      includeBase64: true,
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
      quality: 0.3,
    };
    try {
      ImagePicker.launchImageLibrary(options, (response) => {
        console.log("Response = ", response);
        if (response.didCancel) {
          console.log("User cancelled image picker");
          // alert('User cancelled image picker');
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
          // alert('ImagePicker Error: ' + response.error);
        } else {
          // Resize the image here
          const { uri } = response.assets[0];

          const base64Image = response.assets[0].base64;

          const imageMessage = {
            _id: `${Date.now()}_${Math.round(Math.random() * 1000000)}`,
            image: `data:${response.assets[0].type};base64,${base64Image}`, // Include the image data
            createdAt: new Date(),
            user: {
              _id: profile.matrimony_registration._id,
              avatar: profile.matrimony_registration.profile_image,
            },
          };

          // Update local state immediately
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [imageMessage])
          );
          ws.send(
            JSON.stringify({
              type: "image",
              senderId: profile.matrimony_registration._id,
              receiverId: data._id,
              image: `data:${response.assets[0].type};base64,${base64Image}`, // Include the image data
              createdAt: imageMessage.createdAt,
            })
          );
        }
      });
    } catch (error) {
      console.error("Error selecting image:", error);
    }
  };

  const onSendCameraImage = async () => {
    let options = {
      title: "Select Image",
      customButtons: [],
      includeBase64: true,
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
      quality: 0.3,
    };
    try {
      ImagePicker.launchCamera(options, (response) => {
        console.log("Response = ", response);
        if (response.didCancel) {
          console.log("User cancelled image picker");
          // alert('User cancelled image picker');
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
          // alert('ImagePicker Error: ' + response.error);
        } else {
          // Resize the image here
          const base64Image = response.assets[0].base64;

          const imageMessage = {
            _id: `${Date.now()}_${Math.round(Math.random() * 1000000)}`,
            image: `data:${response.assets[0].type};base64,${base64Image}`, // Include the image data
            createdAt: new Date(),
            user: {
              _id: profile.matrimony_registration._id,
              avatar: profile.matrimony_registration.profile_image,
            },
          };

          // Update local state immediately
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [imageMessage])
          );
          ws.send(
            JSON.stringify({
              type: "image",
              senderId: profile.matrimony_registration._id,
              receiverId: data._id,
              image: `data:${response.assets[0].type};base64,${base64Image}`, // Include the image data
              createdAt: imageMessage.createdAt,
            })
          );
        }
      });
    } catch (error) {
      console.error("Error selecting image:", error);
    }
  };

  // const handleMessage = (msg) => {
  //   // console.log("Received data:", msg);

  //   // Check if the message already exists in the messages state
  //   const messageIndex = messages.findIndex((m) => m._id === msg._id);

  //   // console.log("Message index:", messageIndex);

  //   // If the message already exists, update it
  //   if (messageIndex !== -1) {
  //     // console.log("Updating existing message:", msg);
  //     setMessages((previousMessages) => {
  //       const updatedMessages = [...previousMessages];
  //       updatedMessages[messageIndex] = {
  //         ...msg,
  //         _id: `${Date.now()}_${Math.round(Math.random() * 1000000)}`, // Ensure a unique key
  //       };
  //       return updatedMessages;
  //     });
  //   } else {
  //     // console.log("Appending new message:", msg);
  //     // If the message doesn't exist and is not sent by the current user, append it to the messages state
  //     if (msg.senderId !== profile.matrimony_registration._id) {
  //       setMessages((previousMessages) =>
  //         GiftedChat.append(previousMessages, [
  //           {
  //             ...msg,
  //             user: {
  //               _id: msg.senderId,
  //               name: msg.fullname,
  //             },
  //             _id: `${Date.now()}_${Math.round(Math.random() * 1000000)}`,
  //           },
  //         ])
  //       );
  //     }
  //   }
  // };

  const handleMessage = (msg) => {
    console.log("Received data:", msg);

    // Check if the message already exists in the messages state
    const messageExists = messages.some((m) => m._id === msg._id);

    console.log("Message exists:", messageExists);

    // If the message already exists, ignore it to prevent duplication
    if (messageExists) {
      console.log("Ignoring duplicate message:", msg);
      return;
    }

    // If the message doesn't exist and is not sent by the current user, append it to the messages state
    if (msg.senderId !== profile.matrimony_registration._id) {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [
          {
            ...msg,
            user: {
              _id: msg.senderId,
              name: msg.fullname,
            },
            // id: `${Date.now()}${Math.round(Math.random() * 1000000)}`,
          },
        ])
      );
    }
  };

  const renderBubble = (props) => {
    const messageSenderId = props.currentMessage.user._id;
    console.log(props.currentMessage.user._id);
    return (
      <Bubble
        {...props}
        position={
          messageSenderId === profile.matrimony_registration._id
            ? "right"
            : "left"
        }
        textStyle={{
          right: {
            color: colors.white,
            fontSize: 14,
          },
          left: {
            fontSize: 14,
          },
        }}
        wrapperStyle={{
          right: {
            backgroundColor: colors.primaryColor,
            marginRight: 5,
            marginVertical: 5,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 0,
          },
          left: {
            backgroundColor: "#d9d9d9",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 10,
            // paddingHorizontal: 5,
            paddingVertical: 2,
          },
        }}
      />
    );
  };
  const renderTime = (props) => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          right: {
            color: "white", // Text color for sender's time
            fontSize: 10,
          },
          left: {
            color: "black", // Text color for receiver's time
            fontSize: 10,
          },
        }}
        containerStyle={{
          right: {
            marginRight: 10, // Adjust the right margin for sender's time
          },
          left: {
            marginLeft: 10, // Adjust the left margin for receiver's time
          },
        }}
      />
    );
  };

  const CustomActions = (props) => {
    const renderOptions = () => {
      if (props.text) {
        // If there is text input, show only the send option
        return null;
      } else {
        // If there is no text input, show camera and gallery options
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              position: "absolute",
              zIndex: 1,
              right: 10,
              top: 10,
            }}
          >
            <TouchableOpacity
              onPress={onSendCameraImage}
              style={{ marginRight: 10 }}
            >
              <Icon name="camera-outline" type="ionicon" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onSendImage}>
              <Icon name="folder-outline" type="ionicon" />
            </TouchableOpacity>
          </View>
        );
      }
    };

    return <>{renderOptions()}</>;
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };
  const MessageImage = (props) => {
    return (
      <TouchableOpacity
        onPress={() => openImageModal(props.currentMessage.image)}
      >
        <Image
          source={{ uri: props.currentMessage.image }}
          style={{
            width: 200,
            height: 200,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomLeftRadius: 10,
          }}
        />
      </TouchableOpacity>
    );
  };

  const renderMessageImage = (props) => {
    if (props.currentMessage.image) {
      return <MessageImage {...props} />;
    }
    return null;
  };

    const handleInputTextChanged = (text) => {
      setInputText(text);
    };

    useEffect(() => {
      if (messages.length > 0) {
        setInputText("");
      }
    }, [messages]);


  const handleKeyPress=(event)=>{
    if (inputText.trim() !== "") {
      onSend([
        {
          _id: Math.random().toString(36).substring(7),
          text: inputText.trim(),
          createdAt: new Date(),
          user: {
            _id: profileId,
          },
        },
      ]);
    } else {
      console.warn("hat bsdk");
    }
  }
  return (
    <SafeAreaView style={{flex:1,backgroundColor:colors.white}} >
      {profile._id && (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
              elevation: 1,
              borderBottomWidth: 1,
              borderColor: "#d3d3d3",
            }}
          >
            <Pressable onPress={() => navigation.goBack()}>
              <Icon name="chevron-back-outline" type="ionicon" />
            </Pressable>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProfileDetail", { data: data, view: true })
              }
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Image
                source={{ uri: data.profile_image }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  marginHorizontal: 10,
                }}
              />
              <Text style={styles.h5}>{data.fullname}</Text>
            </TouchableOpacity>
          </View>
          <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{ _id: profile.matrimony_registration._id }}
            showUserAvatar={false}
            renderTime={renderTime}
            renderBubble={renderBubble}
            renderActions={(props) => <CustomActions {...props} />}
            renderMessageImage={renderMessageImage}
            textInputStyle={{
              color: "black", // Set text color to black
            }}
            // textInputProps={{
            //   onChangeText: handleInputTextChanged, // Handle text input changes
            //   value: inputText, // Set the value of the text input
            //   onSubmit: (e) => {
            //     // Detect Enter key press
            //     // if (e.nativeEvent.key === "Enter") {
            //       handleKeyPress();
            //     // }
            //   },
            // }}
          />

          <FullImageView
            imageUrl={selectedImage}
            modalVisible={modalVisible}
            onClose={closeImageModal}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ChatBox;

const FullImageView = ({ imageUrl, modalVisible, onClose }) => {
  return (
    <Modal visible={modalVisible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.8)", // Adjust the opacity as needed
        }}
      >
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            backgroundColor: "white",
            padding: 10,
            borderRadius: 50,
            zIndex: 999,
          }}
        >
          <Icon name="close-outline" type="ionicon" />
        </TouchableOpacity>
        <Image
          source={{ uri: imageUrl }}
          style={{ width: "100%", height: "100%", resizeMode: "cover" }}
        />
      </View>
    </Modal>
  );
};
