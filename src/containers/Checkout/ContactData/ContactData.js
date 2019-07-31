import React, { Component } from 'react'

import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.module.css'
import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/Spinner'

class ContactData extends Component {
  state = {
    name: '', 
    email: '', 
    address: {
      street: '', 
      postalCode: ''
    }, 
    loading: false
  }

  orderHandler = (event) => {
    event.preventDefault()
    this.setState({loading: true})
    const order = {
      ingredients: this.props.ingredients, 
      price: this.props.price, 
      customer: {
        name: 'Max Roberts-Dear', 
        address: {
          street: 'Teststreet 1', 
          postcode: 'bg8 8he', 
          country: 'UK'
        }, 
        email: 'test@test.com'
      }, 
      deliveryMethod: 'fastest'
    }
    axios.post('/orders.json', order)
    .then( reponse => {
      this.setState({loading: false})
      this.props.history.push('/')
    })
    .catch(error => {
      this.setState({loading: false})
    })
  }

  render () {
    let form = (
      <form>
      <input type='text' name='name' placeholder='Your name' />
      <input type='email' name='email' placeholder='Your email' />
      <input type='text' name='street' placeholder='Your street' />
      <input type='text' name='postal' placeholder='Your post code' />
      <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
    </form>
    ) 
    if (this.state.loadng) {
      form = <Spinner />
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Info</h4>
        {form}
      </div>
    )
  }
}

export default ContactData