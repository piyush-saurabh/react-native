import React from 'react';
import { View, FlatList, StyleSheet} from 'react-native';
//import { FlatList } from 'react-native-gesture-handler';

import MealItem from './MetalItem';

// Redux
import { useSelector } from 'react-redux';

const MealList = (props) => {

    const favoriteMeals = useSelector(state => state.meals.favoriteMeals);


    const renderMealItem = itemData => {
        const isFav = favoriteMeals.some(meal => meal.id === itemData.item.id);

        return (
            <MealItem data={itemData.item} onSelectMeal={() => {
                props.navigation.navigate({
                    routeName: 'MealDetail',
                    params: {
                        mealId: itemData.item.id,
                        mealTitle: itemData.item.title,
                        isFavorite: isFav
                    }
                    });
            }} />
        );

    };

    return (
        <View style={styles.list} >
            <FlatList data={props.listData} keyExtractor={(item, index) => item.id} renderItem={renderMealItem} style={{width: '100%'}} />
        </View>
    );;
};
const styles = StyleSheet.create({
    list: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15
    }
});

export default MealList;
