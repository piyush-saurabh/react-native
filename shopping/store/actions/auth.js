// Implement auto-login
import { AsyncStorage } from 'react-native';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';

export const LOGOUT = 'LOGOUT';

// Log the user in if async storage exists
export const authenticate = (userId, token) => {
    return {
        type: AUTHENTICATE,
        userId: userId,
        token: token
    };

};

// Refer https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
export const signup = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=firebasekey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        });

        if (!response.ok){
            const errorResponeData = await response.json();
            const errorId = errorResponeData.error.message;

            let message = 'Something went wrong';
            if (errorId === 'EMAIL_EXISTS'){
                message = 'This email already exists';
            } else if (errorId === 'TOO_MANY_ATTEMPTS_TRY_LATER'){
                message = 'Please try after some time';
            }
            throw new Error(message);
            //throw new Error('Something went wrong!!');
        }

        const responseData = await response.json();
        //console.log(responseData);
        dispatch(authenticate(responseData.localId, responseData.idToken));
        // dispatch({
        //     type: SIGNUP,
        //     userId: responseData.idToken,
        //     token: responseData.localId
        // });

        // Store the expiration date to check for token expiry
        const expirationDate = new Date(new Date().getTime() + parseInt(responseData.expiresIn) * 1000); // get the current time in ms

        // After login, save the login data to storage
        saveDataToStorage(responseData.idToken, responseData.localId, expirationDate);
    }
};

// https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=firebaseAPIkey',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        });

        if (!response.ok){
            const errorResponeData = await response.json();
            const errorId = errorResponeData.error.message;

            let message = 'Something went wrong';
            if (errorId === 'EMAIL_NOT_FOUND'){
                message = 'This email id could not be found';
            } else if (errorId === 'INVALID_PASSWORD'){
                message = 'The password you entered in incorrect';
            }
            //console.log(errorResponeData);
            throw new Error(message);
            //throw new Error('Something went wrong!!');
        }

        const responseData = await response.json();

        //console.log(responseData);
        dispatch(authenticate(responseData.localId, responseData.idToken));
        // dispatch({
        //     type: LOGIN,
        //     userId: responseData.idToken,
        //     token: responseData.localId
        // });

        // Store the expiration date to check for token expiry
        const expirationDate = new Date(new Date().getTime() + parseInt(responseData.expiresIn) * 1000); // get the current time in ms

        // After login, save the login data to storage
        saveDataToStorage(responseData.idToken, responseData.localId, expirationDate);
    }
};

// Logout on button click
export const logout = () => {
    return {
        type: LOGOUT
    }
};

// Auto Logout when token expires
// TODO

// Save login data on the mobile disk
const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: expirationDate.toISOString()
    }));
};

