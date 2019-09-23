import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'
import ContactData from './ContactData/ContactData'

class Checkout extends Component {
  constructor() {
    super()
    console.log('[Checkout.js] constructor')
  }

  checkoutCancelledHandler = () => {
    this.props.history.goBack()
  }

  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data')
  }

  render () {
    console.log('[Checkout.js] rendering ...')
    return (
      <div>
        <CheckoutSummary 
          ingredients={this.props.ings}
          checkoutCancelled={this.checkoutCancelledHandler}
          checkoutContinued={this.checkoutContinuedHandler} />
        <Route 
          path={this.props.match.path + '/contact-data'} 
          component={ContactData} /> 
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.ingredients
  }
}

export default connect(mapStateToProps)(Checkout)