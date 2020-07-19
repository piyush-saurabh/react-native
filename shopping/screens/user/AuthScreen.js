import React, { useReducer, useCallback, useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert
} from 'react-native';

// Linear gradient
// npm install --save expo-linear-gradient
import { LinearGradient } from 'expo-linear-gradient';

// Import forms
import Input from '../../components/UI/Input';

import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';

import { useDispatch } from 'react-redux';
import * as authActions from '../../store/actions/auth';

// Fetching input from the form
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

// Fetching username, password from the form
const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
      const updatedValues = {
        ...state.inputValues,
        [action.input]: action.value
      };
      const updatedValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid
      };
      let updatedFormIsValid = true;
      for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }
      return {
        formIsValid: updatedFormIsValid,
        inputValidities: updatedValidities,
        inputValues: updatedValues
      };
    }
    return state;
  };

const AuthScreen = props => {

    const [isLoading, setIsLoading] = useState(false);

    const [isSignup, setIsSignup] = useState(false);

    const [error, setError] = useState();

    // For fetching input from the form
    // dispatchFormState gets triggered when the input changes
    // formState will store the input
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
          email: '',
          password: ''
        },
        inputValidities: {
          email: false,
          password: false
        },
        formIsValid: false
      });

    const dispatch = useDispatch();

    useEffect(() => {
        if (error){
            Alert.alert('Login failed', error, [{text: 'Okay'}]);
        }

    }, [error]);

    const authHandler = async () => {
        let action;
        
        if (isSignup){
            action = authActions.signup(formState.inputValues.email, formState.inputValues.password);
        } else {
            action = authActions.login(formState.inputValues.email, formState.inputValues.password);
        }
        setIsLoading(true);
        setError(null);
        try {
            await dispatch(action);

            // After successful login, navigate to shopping screen
            props.navigation.navigate('Shop');
        }catch (err){
            setError(err.message);
            setIsLoading(false);
        }
        
        
    };

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
          dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
          });
        },
        [dispatchFormState]
      );

    return (
        <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="E-Mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <View style={styles.buttonContainer}>
                {isLoading ? (<ActivityIndicator size='small' color={Colors.primary} />) : (<Button title={isSignup ? "Sign Up" : "Login"} color={Colors.primary} onPress={authHandler} />) }
              
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${isSignup ? "Login" : "Sign Up"}`}
                color={Colors.accent}
                onPress={() => {
                    setIsSignup(previousState => !previousState);
                }}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
    );
};

AuthScreen.navigationOptions = {
    headerTitle: 'Authenticate'
  };

const styles = StyleSheet.create({
    screen: {
      flex: 1
    },
    gradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    authContainer: {
      width: '80%',
      maxWidth: 400,
      maxHeight: 400,
      padding: 20
    },
    buttonContainer: {
      marginTop: 10
    }
  });
  
  export default AuthScreen;