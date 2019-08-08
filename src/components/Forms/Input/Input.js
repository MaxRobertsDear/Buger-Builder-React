import React from 'react'

import classes from './Input.module.css'

const input = (props) => {
  let inputElement = null
  let validationError = null
  const inputClasses = [classes.inputElement]

  if (props.invalid && props.shouldValitdate && props.touched) {
    inputClasses.push(classes.Invalid)
  }

  if (props.invalid && props.touched) {
    validationError = <p className={classes.validationError}>Please enter a valid input</p>
  }

  switch (props.elementType) {
    case ('input'):
      inputElement = <input 
        className={inputClasses.join(' ')} 
        {...props.elementConfig}
        value={props.value}
        onChange={props.changed} />
      break
    case ('textarea'):
      inputElement = <textarea 
        className={inputClasses.join(' ')} 
        {...props.elementConfig}
        value={props.value}
        onChange={props.changed} />
      break
    case ('select'):
      inputElement = (
        <select 
          className={inputClasses.join(' ')} 
          value={props.value}
          onChange={props.changed}>
            {props.elementConfig.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.displayValue}
              </option>
            ))}
        </select>
      )
      break
    default:
      inputElement = <input 
        className={classes.InputElement} 
        {...props.elementConfig}
        value={props.value}
        onChange={props.changed} />
  }
  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      {inputElement}
      {validationError}
    </div>
  )
}



export default input