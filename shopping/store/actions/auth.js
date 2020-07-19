export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';

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
        console.log(responseData);
        dispatch({
            type: SIGNUP,
            userId: responseData.idToken,
            token: responseData.localId
        });
    }
};

// https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=firebasekey',
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
            throw new Error(message);
            //throw new Error('Something went wrong!!');
        }

        const responseData = await response.json();

        //console.log(responseData);
        dispatch({
            type: LOGIN,
            userId: responseData.idToken,
            token: responseData.localId
        });
    }
};