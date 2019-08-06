/* eslint-disable react/jsx-no-comment-textnodes */
import React, { Component } from 'react'

import Modal from '../../components/UI/Modal/Modal'

// takes axios as second argument so that the wrapper knows whether there is an error to show
const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = {
      error: null
    }
    componentWillMount () {
      this.reqInterceptor = axios.interceptors.request.use(req => {
        // clear any errors when sending a request
        this.setState({error: null})
        return req
      })
      this.resInterceptor = axios.interceptors.response.use(res => res, error => {
        // set error state to the error returned by firebase 
        this.setState({error: error})
      })
    }

    componentWillUnmount () {
      axios.interceptors.request.eject(this.reqInterceptor)
      axios.interceptors.response.eject(this.resInterceptor)
    }

    errorConfirmedHandler=() => {
      this.setState({error: null})
    }

    render () {
      return (
        <>
          <Modal 
            show={this.state.error}
            // remove error message when backdrop is clicked
            // ternary expression because Modal is always present (even if not shown)
            modalClosed={this.errorConfirmedHandler}>
            {this.state.error ? this.state.error.message : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </>
          // distribute any props that might be received with the wrapped component because I don't know these props
          // but definitely want to show them
      )
    }
  }
}

export default withErrorHandler