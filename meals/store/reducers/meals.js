import { MEALS } from '../../data/dummy-data';
import { TOGGLE_FAVORITE, SET_FILTERS } from '../actions/meals';

const initialState = {
  allMeals: MEALS,
  filteredMeals: MEALS,
  favoriteMeals: []
};

const mealsReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_FAVORITE:
      const existingIndex = state.favoriteMeals.findIndex(
        meal => meal.id === action.mealId
      );
      if (existingIndex >= 0) {
        const updatedFavMeals = [...state.favoriteMeals];
        updatedFavMeals.splice(existingIndex, 1);
        return { ...state, favoriteMeals: updatedFavMeals };
      } else {
        const meal = state.allMeals.find(meal => meal.id === action.mealId);
        return { ...state, favoriteMeals: state.favoriteMeals.concat(meal) };
      }
    case SET_FILTERS:
        const appliedFilters = action.filters;
        const updatedFilteredMeals = state.allMeals.filter(meal => {
            if (appliedFilters.isGlutenFree && !meal.isGluteenFree){
                return false;
            }
            if (appliedFilters.isLactoseFree && !meal.isLactoseFree){
                return false;
            }
            if (appliedFilters.isVegan && !meal.isVegan){
                return false;
            }
            if (appliedFilters.isVegetarian && !meal.isVegetarian){
                return false;
            }
            return true;
        });
        return ({...state, filteredMeals: updatedFilteredMeals})

    default:
      return state;
  }
};

export default mealsReducer;
