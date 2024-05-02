import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from "react-native";
import React, { useState } from "react";
import styles from "../navigation/styles";
import RNSTextInput from "../../components/RNSTextInput";
import { colors, fonts } from "../../styles";
import Button from "../../components/Button";
import * as ImagePicker from "react-native-image-picker";
import { Image } from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import apiClient from "../../utils/apiClient";
import { getProfile } from "../../redux/Matrimony/Search";
import ImageResizer from "react-native-image-resizer";
import { Icon } from "react-native-elements";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment'
import {setDob} from "../auth/signin"

export default function EditProfile({ navigation }) {
    const userId = useSelector(state => state.session?.profile?._id);
    const dispatch = useDispatch();
    const token = useSelector(state => state.session?.authToken);
    const dob = useSelector((state) => state.signin.dob);
    const [isVisible, setIsVisible] = useState(false);
    const profile = useSelector(state => state.session?.profile);
    const [isModalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState({
        uri: profile.profile_image,
        type: 'image/jpeg', // Set the appropriate MIME type
        name: 'profile.jpg', // Set the desired filename
    },)
    const [name, setName] = useState(profile.fullname);


   const updateProfile = async () => {
     setLoading(true);
     try {
       const data = {
         fullname: name,
         dob: dob,
       };
       // Check if image.uri is not empty or null
       if (image.uri && image.uri !== "") {
         data.image = image;
       }
       const response = await apiClient.post(
         `${apiClient.Urls.editProfile}/${userId}`,
         {
           ...data,
         },
         true
       );
       console.warn(response);
       if (response.success) {
         dispatch(getProfile(token));
         navigation.navigate("Menu");
         setLoading(false);
         Toast.show({
           text1: response.message || "Updated",
           type: "success",
         });
       } else {
         Toast.show({
           text1: response.message || "Something went wrong!",
           type: "error",
         });
         setLoading(false);
       }
     } catch (e) {
       Toast.show({
         text1: e.message || "Something went wrong!",
         type: "error",
       });
         setLoading(false);
     }
   };


    const educationOptions = [
        'High School',
        'Associate Degree',
        'Bachelor\'s Degree',
        'Master\'s Degree',
        'Ph.D.',
        'Other',
    ];
  //function to launch gallery
  const gallery = () => {
    let options = {
      title: "Select Image",
      customButtons: [],
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
      quality: 0.3,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log("Response = ", response);
      if (response.didCancel) {
        console.log("User cancelled image picker");
        // alert('User cancelled image picker');
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
        // alert('ImagePicker Error: ' + response.error);
      }
      else {
        // Resize the image here
        const { uri } = response.assets[0];

        ImageResizer.createResizedImage(uri, 800, 600, 'JPEG', 80)
          .then((resizedImage) => {
            setImage({
                uri: resizedImage.uri,
                type: 'image/jpeg',
                name: 'profile.jpg',
            });
            setModalVisible(false);
            console.warn('Resized image:', resizedImage.uri);
          })
          .catch((err) => {
            console.error('Image resize error:', err);
          });
      }
        });
  };

  const camera = () => {
    let options = {
      title: 'Select Image',
      customButtons: [],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.3,
    };

    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // Resize the image here
        const { uri } = response?.assets[0];

        ImageResizer.createResizedImage(uri, 800, 600, 'JPEG', 80)
          .then((resizedImage) => {
            console.log('Resized image:', resizedImage.uri);
            // Make sure 'dispatch' and 'setModalVisible' work as expected
            setImage({
                uri: resizedImage?.uri,
                type: 'image/jpeg',
                name: 'profile.jpg',
            });
            setModalVisible(false);
          })
          .catch((err) => {
            console.error('Image resize error:', err);
          });
      }
    });
  };

  const handlePicker = (date) => {
    console.warn('datyeis---->',date)
    if (dob == "") {
      dispatch(setDob(dob));
    }
    setIsVisible(false);
    console.warn(date);
    dispatch(setDob(moment(date).format("YYYY-MM-DD")));
  };
    return (
      <SafeAreaView style={{flex:1,backgroundColor:colors.white}} >
      <View style={style.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="chevron-back-outline" type="ionicon" size={20} />
          </Pressable>
          <Text style={[styles.h4, { marginLeft: 10 }]}>Edit Profile</Text>
        </View>
        <View
          style={[
            style.container,
            { paddingHorizontal: 25, paddingBottom: 20 },
          ]}
        >
          <View
            style={{
              borderWidth: 1,
              width: 100,
              height: 100,
              borderRadius: 50,
              alignSelf: "center",
              marginTop: 10,
              borderColor: colors.grey,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* {image.uri == "" || image.uri == null ? (
              <Icon
                name="person-outline"
                type="ionicons"
                size={35}
                color={colors.primaryBlue}
              />
            ) : ( */}
              <Image
                source={{
                  uri: image.uri
                    ? image.uri
                    : "https://www.emmegi.co.uk/wp-content/uploads/2019/01/User-Icon.jpg",
                }}
                style={{ height: "100%", width: "100%", borderRadius: 50 }}
              />
            {/* )} */}
            <Pressable
              onPress={() => setModalVisible(true)}
              style={{
                position: "absolute",
                backgroundColor: "#696969",
                padding: 7,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
                bottom: -5,
                right: -5,
              }}
            >
              <Icon
                name="create-outline"
                type="ionicon"
                size={15}
                color={colors.white}
              />
            </Pressable>
          </View>
          <Modal isVisible={isModalVisible}>
            <View style={style.modalContainer}>
              <Pressable
                onPress={(e) => {
                  camera();
                }}
                style={{
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Icon name="camera-outline" type="ionicon" size={20} />
                <Text
                  style={[
                    styles.h5,
                    { color: "#000", fontWeight: "100", marginLeft: 15 },
                  ]}
                >
                  Take from camera...
                </Text>
              </Pressable>
              <Pressable
                onPress={(e) => {
                  gallery();
                }}
                style={{
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Icon name="folder-outline" type="ionicon" size={20} />
                <Text
                  style={[
                    styles.h5,
                    { color: "#000", fontWeight: "100", marginLeft: 15 },
                  ]}
                >
                  Choose from Library...
                </Text>
              </Pressable>
              <Pressable
                onPress={(e) => {
                  setModalVisible(!isModalVisible);
                }}
                style={{
                  alignSelf: "flex-end",
                  right: 15,
                  top: 10,
                  marginBottom: 10,
                }}
              >
                <Text style={[styles.h6, { color: "red" }]}>Cancel</Text>
              </Pressable>
            </View>
          </Modal>
          <View style={{ width: "100%", paddingTop: 10 }}>
            <Text
              style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
            >
              Full Name
            </Text>
            <RNSTextInput
              placeHolder={"Enter your Full Name"}
              onChangeText={(e) => setName(e)}
              value={name}
            />
          </View>
          <Pressable
            onPress={() => setIsVisible(true)}
            style={{ width: "100%", paddingTop: 20 }}
          >
            <Text
              style={[styles.h6, { paddingBottom: 8, color: colors.black }]}
            >
              Date of Birth
            </Text>
            <Pressable
              onPress={() => setIsVisible(true)}
              style={{
                width: "100%",
                borderRadius: 10,
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#d3d3d3",
                paddingHorizontal: 15,
                paddingRight: 50,
                fontSize: 14,
                paddingVertical: 15,
                color: colors.gray,
                fontFamily: fonts.primaryRegular,
                alignSelf: "center",
                // alignItems:"center",
                // justifyContent:"center",
              }}
            >
              <Text
                style={{
                  color: colors.gray,
                  fontFamily: fonts.primaryRegular,
                }}
              >
                {dob != "" ? dob : "Enter Date of birth"}
              </Text>
              <View style={{ position: "absolute", right: 10, bottom: 10 }}>
                <Icon
                  name="calendar-outline"
                  type="ionicon"
                  color={"#696969"}
                />
              </View>
            </Pressable>
          </Pressable>
          <DateTimePicker
            isVisible={isVisible}
            mode={"date"}
            is24Hour={false}
            date={dob ? new Date(dob) : new Date()}
            maximumDate={new Date()}
            // minimumDate={new Date()}
            onConfirm={handlePicker}
            onCancel={() => setIsVisible(false)}
          />
        </View>

        {loading ? (
          <View style={{ paddingHorizontal: 25, paddingBottom: 50 }}>
            <Button load={true} backgroundColor={colors.primaryColor} />
          </View>
        ) : (
          <View style={{ paddingHorizontal: 25, paddingBottom: 50 }}>
            <Button
              text={"Update"}
              backgroundColor={colors.primaryColor}
              color={false}
              onpress={() => updateProfile()}
            />
          </View>
        )}
      </View>
      </SafeAreaView>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        // paddingHorizontal: 25,
        // paddingVertical: 20,
    },
    dropdownText: {
        fontSize: 12,
        color: "gray",
        textAlign: "left",
        backgroundColor: "#fff",
        width: "100%",
        borderWidth: 1,
        borderColor: "#d3d3d3",
        borderRadius: 15,
    },
    placeholder: {
        fontSize: 16,
        textAlign: "left",
        color: "gray",
    },
    // Modal styles
    modalContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 10,
    },
    modalOption: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    modalOptionText: {
        fontSize: 18,
    },
});
