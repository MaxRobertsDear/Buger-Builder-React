import * as actionTypes from './actions.js'

const initialState = {
  ingredients: {
    salad: 0, 
    bacon: 0, 
    cheese: 0, 
    meat: 0
  },
  totalPrice: 4, 
}

const INGREDIENT_PRICES = {
  salad: 0.5, 
  cheese: 0.4, 
  meat: 1.3, 
  bacon: 0.7
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      return {
        ...state, 
        ingredients: {
          ...state.ingredients, 
          [action.ingredientName]: state.ingredients[action.ingredientName] + 1
          // want to override a given ingredient, which I get as a payload of this action
          // [action.ingredientName] dynamically overwrite a property in a given JS object
          // pass a variable which contains the name that I actually want to use as a property name
          // I expect to get that property name on my action (maybe on an ingredientName action)
        }, 
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
      }
      case actionTypes.REMOVE_INGREDIENT:
        return {
          ingredients: {
            ...state.ingredients, 
            [action.ingredientName]: state.ingredients[action.ingredientName] - 1
          },
          totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]
      }
    default:
      return state
  }
}

export default reducer