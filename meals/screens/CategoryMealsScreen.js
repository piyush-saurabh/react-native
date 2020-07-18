import React from 'react';

import { CATEGORIES } from '../data/dummy-data';

import { useSelector } from 'react-redux';
//import { FlatList } from 'react-native-gesture-handler';

import MealList from '../components/MealList';

const CategoryMealsScreen = (props) => {
    const catId = props.navigation.getParam('categoryId');

    // Get data from redux store
    const availableMeals = useSelector(state => state.meals.filteredMeals);

    const displayedMeals = availableMeals.filter(meal => meal.categoryIds.indexOf(catId) >= 0);
    return (
        // Forward the navigation component to child component
        <MealList listData={displayedMeals} navigation={props.navigation} />
        
    );
};

//Setting title on the header
CategoryMealsScreen.navigationOptions = (navigationData) => {
    const catId = navigationData.navigation.getParam('categoryId');
    const selectedCategory = CATEGORIES.find(cat => cat.id === catId);

    return ({
        headerTitle: selectedCategory.title
    });
};


export default CategoryMealsScreen;