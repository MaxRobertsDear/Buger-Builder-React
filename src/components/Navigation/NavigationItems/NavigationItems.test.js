import React from 'react'

import { configure ,shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import NavigationItems from './NavigationItems'
import NavigationItem from './NavigationItem/NavigationItem'

import ShallowRenderer from 'react-test-renderer/shallow'


configure({adapter: new Adapter()})

describe('Using enzyme shallow', () => {
  describe('<NavigationItems />', () => {
    it('should render two <Navigation /> elements if not authenticated', () => {
      const wrapper = shallow(<NavigationItems />)
      expect(wrapper.find(NavigationItem)).toHaveLength(2)
    })
  })
})

describe('Using Jest ShowllowRenderer', () => {
  describe('<NavigationItems />', () => {
    it('should render two <Navigation /> elements if not authenticated', () => {
      const renderer = new ShallowRenderer()
      renderer.render(<NavigationItems />)
      const result = renderer.getRenderOutput()
      
      expect(result.props.children).toEqual([
        <NavigationItem link='/'>BurgerBuilder</NavigationItem>,
        <NavigationItem link='/orders'>Orders</NavigationItem>
      ]);
    })
  })
})
