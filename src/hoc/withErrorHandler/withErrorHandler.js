/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useEffect } from 'react'

import Modal from '../../components/UI/Modal/Modal'

// takes axios as second argument so that the wrapper knows whether there is an error to show
const withErrorHandler = (WrappedComponent, axios) => {
  return (props) => {
    const [error, setError] = useState(null)

    const reqInterceptor = axios.interceptors.request.use(req => {
      // clear any errors when sending a request
      setError(null)
      return req
    })
    const resInterceptor = axios.interceptors.response.use(res => res, err => {
      // set error state to the error returned by firebase 
      setError(err)
    })


    useEffect(() => {
      return () => {
        axios.interceptors.request.eject(reqInterceptor)
        axios.interceptors.response.eject(resInterceptor)
      }
    }, [reqInterceptor, resInterceptor])
  
    const errorConfirmedHandler=() => {
      setError(null)
  }

    return (
      <>
        <Modal 
          show={error}
          // remove error message when backdrop is clicked
          // ternary expression because Modal is always present (even if not shown)
          modalClosed={errorConfirmedHandler}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </>
        // distribute any props that might be received with the wrapped component because I don't know these props
        // but definitely want to show them
    )
  }
}

export default withErrorHandler