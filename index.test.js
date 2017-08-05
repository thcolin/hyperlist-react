import React from 'react'
import renderer from 'react-test-renderer'
import HyperListReact from './index.js'

test('HyperListReact constructor', () => {
  const component = renderer.create(
    <HyperListReact
      itemHeight={30}
      total={10}
      generate={row => (<div>{ 'Item ' + row }</div>)}
    ></HyperListReact>
  )

  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
