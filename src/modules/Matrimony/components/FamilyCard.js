import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import { Image } from 'react-native';
import styles from '../../navigation/styles';
import { colors } from '../../../styles';
import { useSelector } from 'react-redux';
import { Icon } from 'react-native-elements';
import { capitalizeFirstLetter } from './capitalizeFirstLetter';
import apiClient from '../../../utils/apiClient';

export default function FamilyCard({ navigation, data, refresh }) {

    const token = useSelector(state => state.session.authToken);

    const deleteMember = async (id) => {
        try {
            const response = await apiClient.delete(`${apiClient.Urls.deleteMember}/${id}`, {
                authToken: token
            })
            if (response.success) {
                refresh();
            }
            console.warn('delete response---->', response)
        } catch (error) {

        }
    }

    return data?.map((user, index) => {
        return (
            <Pressable
                style={style.container}>
                <View style={styles.flexRow}>
                    <Image
                        source={{ uri: user.image }}
                        resizeMode="contain"
                        style={{ width: 50, height: 50, borderRadius: 100 }}
                    />
                    <View style={style.userInfoContainer}>
                        <Text style={[styles.h4, { fontWeight: '600' }]}>
                            {capitalizeFirstLetter(user.full_name)}
                        </Text>
                        <Text style={[styles.p, { color: '#000', fontSize: 14 }]}>
                            {capitalizeFirstLetter(user.relation)}
                        </Text>
                    </View>
                </View>
                <View style={[styles.flexRow, { width: 80, justifyContent: 'space-around' }]}>
                    <Icon name='create-outline' type='ionicon' color={colors.black} size={20} onPress={() => navigation.navigate('EditMember', { data: user })} />
                    <View style={style.messageCount}>
                        <Icon name='trash-outline' onPress={() => { deleteMember(user._id) }} type='ionicon' color={colors.white} size={17} />
                    </View>
                </View>
            </Pressable>
        )
    });
}

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        paddingVertical: 15,
        borderBottomColor: '#d3d3d3',
        paddingHorizontal: 10
    },
    userInfoContainer: {
        paddingLeft: 10,
    },

    messageCount: {
        backgroundColor: colors.primaryColor,
        padding: 6,
        borderRadius: 100,
    },
});
