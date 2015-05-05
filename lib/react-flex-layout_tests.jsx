import React from 'react/addons'
import expect from 'expect'
import Layout from './react-flex-layout.jsx'

var TestUtils = React.addons.TestUtils

describe('react-flex-layout', function() {
  it('can fill the browser frame', function() {
    var layout = TestUtils.renderIntoDocument(<Layout fill='window' />)
    var domLayout = React.findDOMNode(layout)
    expect(domLayout.style.height).toBe(window.innerHeight + 'px')
    expect(domLayout.style.width).toBe(window.innerWidth + 'px')
  })

  it('can fill the containing element', function() {
    var container = document.createElement('div')
    container.style.height = '500px'
    container.style.width = '50%'
    document.body.style.margin = 0
    document.body.appendChild(container)
    var layout = React.render(<Layout fill='container' />, container)
    var domLayout = React.findDOMNode(layout)
    expect(domLayout.offsetHeight).toBe(500)
    expect(domLayout.offsetWidth).toBe(window.innerWidth / 2)
  })

  it('can have two flex width children', function() {
      var container = document.createElement('div')
      container.style.height = '500px'
      container.style.width = '500px'
      document.body.appendChild(container)
      var layout = React.render(<Layout fill='container'><Layout layoutWidth='flex' /><Layout layoutWidth='flex' /></Layout>, container)
      var domLayout = React.findDOMNode(layout)
      var flex1 = domLayout.children[0]
      var flex2 = domLayout.children[1]
      expect(flex1.offsetHeight).toBe(500)
      expect(flex1.offsetWidth).toBe(250)
      expect(flex2.offsetHeight).toBe(500)
      expect(flex2.offsetWidth).toBe(250)
  })
})
