import React from 'react';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';

import MealList from '../components/MealList';

import { useSelector } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';

import DefaultText from '../components/DefaultText';

const FavoritesScreen = props => {
    // Get data from redux store
    const favoriteMeal = useSelector(state => state.meals.favoriteMeals);

    // If there is no favorite item, show the fallback text
    if(favoriteMeal.length === 0 || !favoriteMeal){
        return (
            <View style={styles.content}>
                <DefaultText>No favorite meals found. Start adding some</DefaultText>
            </View>
        );

    }
    
    return (
        <MealList listData={favoriteMeal} navigation={props.navigation} />
    );
};

//Setting title on the header
FavoritesScreen.navigationOptions = navData => {
    return ({
        headerTitle: 'Your Favorites',
        headerLeft: <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item title="Menu" iconName="ios-menu" onPress={() =>{
            navData.navigation.toggleDrawer();
        }} /> 
    </HeaderButtons>

    });
    
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default FavoritesScreen;