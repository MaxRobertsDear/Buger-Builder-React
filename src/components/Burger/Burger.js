import React from 'react'

import classes from './Burger.module.css'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'

const burger = (props) => {
  // incoming props (ingredients) are an object. Therefore need to transform into array before mapping over
  let transformedIngredients = Object.keys(props.ingredients) // Object.keys extracts the keys of an object and puts them into an array
    .map(igKey => { 
      return [...Array(props.ingredients[igKey])].map((_, i) => {
        return <BurgerIngredient key={igKey + 1} type={igKey} />
      })
    })
    .reduce((arr, el) => {
      return arr.concat(el)
    }, [])
    if (transformedIngredients.length === 0){
      transformedIngredients = <p>Please start adding ingredients</p>
    }
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      {transformedIngredients}
      <BurgerIngredient type="bread-bottom" />
    </div>
  )
}

export default burger