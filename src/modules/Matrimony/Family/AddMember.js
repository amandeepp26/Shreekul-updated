import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "react-native-image-picker";
import { Image } from "react-native";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import ImageResizer from "react-native-image-resizer";
import styles from "../../navigation/styles";
import apiClient from "../../../utils/apiClient";
import Button from "../../../components/Button";
import RNSTextInput from "../../../components/RNSTextInput";
import { colors } from "../../../styles";
import { Icon } from "react-native-elements";
import SelectDropdown from "react-native-select-dropdown";

export default function AddMember({ navigation }) {
    const userId = useSelector(state => state.session.profile._id);
    const dispatch = useDispatch();
    const token = useSelector(state => state.session.authToken);
    const profile = useSelector(state => state.session.profile);
    const [isModalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState({
        uri: null,
        type: 'image/jpeg', // Set the appropriate MIME type
        name: 'profile.jpg', // Set the desired filename
    },)
    const [name, setName] = useState('');
    const [relation, setRelation] = useState('');


    const add = () => {
        const isEmptyField = !name || !image.uri || !relation;

        if (isEmptyField) {
            Toast.show({
                text1: "All fields are required",
                type: "error"
            });
        }
        else {
            addMember();
        }
    }
    const addMember = async () => {
        setLoading(true);
        try {
            const response = await apiClient.post(apiClient.Urls.addMember, {
                fullname: name,
                image: image,
                relation: relation,
                authToken: token
            }, true);
            console.warn(response)
            if (response.success) {
                navigation.goBack();
                setLoading(false);
                Toast.show({
                    text1: response.message || e || 'Added Successfully',
                    type: 'success',
                });
            } else {
                Toast.show({
                    text1: response.message || e || 'Something went wrong!',
                    type: 'error',
                });
                setLoading(false)
            }
        } catch (e) {
            Toast.show({
                text1: e.message || e || 'Something went wrong!',
                type: 'error',
            });
        }
    };


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
                const { uri } = response.assets[0];

                ImageResizer.createResizedImage(uri, 800, 600, 'JPEG', 80)
                    .then((resizedImage) => {
                        console.log('Resized image:', resizedImage.uri);
                        // Make sure 'dispatch' and 'setModalVisible' work as expected
                        setImage({
                            uri: resizedImage.uri,
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

    const relationOptions = [
        'Father',
        'Mother',
        'Sister',
        'Brother'
    ];
    return (
        <View style={style.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Icon name='chevron-back-outline' type='ionicon' size={20} />
                </Pressable>
                <Text style={[styles.h4, { marginLeft: 10 }]}>
                    Add Member
                </Text>
            </View>
            <View style={[style.container, { paddingHorizontal: 25, paddingBottom: 20 }]}>

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
                    {image.uri == null ? (
                        <Icon
                            name="person-outline"
                            type="ionicons"
                            size={35}
                            color={colors.primaryBlue}
                        />
                    ) : (
                        <Image
                            source={{ uri: image.uri }}
                            style={{ height: "100%", width: "100%", borderRadius: 50 }}
                        />
                    )}
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
                            style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}
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
                            style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}
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
                            style={{ alignSelf: "flex-end", right: 15, top: 10, marginBottom: 10 }}
                        >
                            <Text style={[styles.h6, { color: "red" }]}>Cancel</Text>
                        </Pressable>
                    </View>
                </Modal>
                <View style={{ width: "100%", paddingTop: 20 }}>
                    <Text style={[styles.h6, { paddingBottom: 10, color: colors.gray }]}>
                        Full Name
                    </Text>
                    <RNSTextInput
                        placeHolder={"Enter Full Name"}
                        onChangeText={(e) => setName(e)}
                        value={name}
                    />
                </View>
                <View style={{ paddingTop: 10 }}>
                    <Text style={[styles.h6, { paddingBottom: 10, color: colors.gray }]}>
                        Relation
                    </Text>
                    <SelectDropdown
                        data={relationOptions}
                        buttonStyle={style.dropdownText}
                        defaultValue={relation}
                        buttonTextStyle={style.placeholder}
                        onSelect={(selectedItem) => setRelation(selectedItem)}
                        buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                        dropdownStyle={{ borderRadius: 10 }}
                        rowTextStyle={{
                            left: 10,
                            position: 'absolute',
                        }}
                        rowTextForSelection={(item, index) => item}
                        defaultButtonText="Relation"
                    />
                </View>

            </View>

            {loading ? (
                <View style={{ paddingHorizontal: 25, paddingBottom: 50 }} >
                    <Button load={true}
                        backgroundColor={colors.primaryColor} />
                </View>
            ) : (
                <View style={{ paddingHorizontal: 25, paddingBottom: 50 }} >
                    <Button
                        text={"Add Member"}
                        backgroundColor={colors.primaryColor}
                        color={false}
                        onpress={() => add()}
                    />
                </View>
            )}


        </View>
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
