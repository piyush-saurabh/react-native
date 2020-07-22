import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, AsyncStorage } from 'react-native';

import { useDispatch } from 'react-redux';
import * as authActions from '../store/actions/auth';

import Colors from '../constants/Colors';

const StartupScreen = props => {
    const dispatch = useDispatch();

    // Check the Async Storage for login
    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData');

            // Check if async storage is set
            if (!userData){
                props.navigation.navigate('Auth');
                return
            }

            // Extract the token from Async Storage
            const transformedData = JSON.parse(userData);
            const { token, userId, expiryDate } = transformedData;

            // Check if the token is valid
            const expirationDate = new Date(expiryDate);
            if (expirationDate <= new Date() || !token || !userId){
                props.navigation.navigate('Auth');
            }

            // Token is valid
            // Redirect user to shopping screen
            props.navigation.navigation('Shop');

            // Log the user in using the stored token on the disk
            dispatch(authActions.authenticate(userId, token));

        };

    }, [dispatch]);

    return (
        <View style={styles.screen}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    );

};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
    
});

export default StartupScreen;