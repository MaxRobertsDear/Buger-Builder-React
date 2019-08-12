import React, { Component } from 'react'
import { connect } from 'react-redux'

import Burger from '../../components/Burger/Burger'
import Modal from '../../components/UI/Modal/Modal'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actionTypes from '../../store/actions'

export class BurgerBuilder extends Component {
  
  constructor() {
    super()
    console.log('[BurgerBuilder.js] constructor')
    this.state = {
      purchasing: false, 
      Loading: false, 
      error: false
  }
  }
  


  componentDidMount () {
    console.log('[BurgerBuilder.js] didMount')
    // axios.get('https://burger-builder-e640e.firebaseio.com/ingredients.json')
    // .then(response => {
    //     this.setState({ingredients: response.data})
    //   })
    //   .catch(error => {
    //     this.setState({error: true})
    //   })
  }

  updatePurchaseState (ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey]
      })
      .reduce((sum, el) => {
        return sum + el
      }, 0)
    return sum > 0
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
      ...this.props.ings
      // distributed ingredients which effectively copies it in an immutable way
    }
    for (let key in disabledInfo) { // loop through all the keys in disableInfor
      disabledInfo[key] = disabledInfo[key] <= 0
      // update the disabledInfor[key] - salad, bacon, etc. - with the info
      // of the check i.e. salad true, meat true (true = disabled)
    }
    
    let orderSummary = null
    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />

    if (this.props.ings) {
      burger = (
        <>
          <Burger ingredients={this.props.ings}/>
          <BuildControls 
            ingredientAdded={this.props.onIngredientAdded} 
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            purchaseable={this.updatePurchaseState(this.props.ings) }
            price={this.props.price}
            ordered={this.purchaseHandler} />
        </>
      )
      orderSummary = <OrderSummary 
        ingredients={this.props.ings}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContiued={this.purchaseContinueHandler}
        price={this.props.price} />
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

const mapStateToProps = (state) => {
  return {
    ings: state.ingredients, 
    price: state.totalPrice
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
    onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (withErrorHandler(BurgerBuilder, axios))