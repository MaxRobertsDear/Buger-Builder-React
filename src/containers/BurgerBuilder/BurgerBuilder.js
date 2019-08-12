import React, { Component } from 'react'

import Burger from '../../components/Burger/Burger'
import Modal from '../../components/UI/Modal/Modal'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENT_PRICES = {
  salad: 0.5, 
  cheese: 0.4, 
  meat: 1.3, 
  bacon: 0.7
}

export class BurgerBuilder extends Component {
  
  constructor() {
    super()
    console.log('[BurgerBuilder.js] constructor')
    this.state = {
      ingredients: null,
      totalPrice: 4, 
      purchaseable: false, 
      purchasing: false, 
      Loading: false, 
      error: false
  }
  }
  


  componentDidMount () {
    console.log('[BurgerBuilder.js] didMount')
    axios.get('https://burger-builder-e640e.firebaseio.com/ingredients.json')
    .then(response => {
        this.setState({ingredients: response.data})
      })
      .catch(error => {
        this.setState({error: true})
      })
  }

  updatePurchaseState (ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey]
      })
      .reduce((sum, el) => {
        return sum + el
      }, 0)
    this.setState({purchaseable: sum > 0})
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type]
    console.log('[BurgerBuilder] Ingredients:', this.state.ingredients)
    const updatedCount = oldCount + 1
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updatedCount
    const priceAddition = INGREDIENT_PRICES[type]
    const oldPrice = this.state.totalPrice
    const newPrice = oldPrice + priceAddition
    this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
    this.updatePurchaseState(updatedIngredients)
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type]
    if (oldCount <= 0) {
      return
    }
    const updatedCount = oldCount - 1
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updatedCount
    const priceDeduction = INGREDIENT_PRICES[type]
    const oldPrice = this.state.totalPrice
    const newPrice = oldPrice - priceDeduction
    this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
    this.updatePurchaseState(updatedIngredients)
  }

  purchaseHandler =  () => {
    this.setState({purchasing: true})
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false})
  }

  purchaseContinueHandler = () => {
    // alert('You continue!')
    const queryParams = []
    for (let i in this.state.ingredients) {
      queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
    }
    queryParams.push('price=' + this.state.totalPrice)
    const queryString = queryParams.join('&')
    this.props.history.push({
      pathname:'/checkout', 
      search: '?' + queryString
    })
  }

  render() {
    console.log('[BurgerBuilder.js] rendering ...')
    // passes information as to whether LESS button should be disabled/enabled
    const disabledInfo = {
      ...this.state.ingredients
      // distributed ingredients which effectively copies it in an immutable way
    }
    for (let key in disabledInfo) { // loop through all the keys in disableInfor
      disabledInfo[key] = disabledInfo[key] <= 0
      // update the disabledInfor[key] - salad, bacon, etc. - with the info
      // of the check i.e. salad true, meat true (true = disabled)
    }
    
    let orderSummary = null
    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />

    if (this.state.ingredients) {
      burger = (
        <>
          <Burger ingredients={this.state.ingredients}/>
          <BuildControls 
            ingredientAdded={this.addIngredientHandler} 
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            purchaseable={this.state.purchaseable }
            price={this.state.totalPrice}
            ordered={this.purchaseHandler} />
        </>
      )
      orderSummary = <OrderSummary 
        ingredients={this.state.ingredients}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContiued={this.purchaseContinueHandler}
        price={this.state.totalPrice} />
    }
    if (this.state.loading) {
      orderSummary = <Spinner />
    }
    return (
      <>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </>
    )
  }
}

export default withErrorHandler(BurgerBuilder, axios)