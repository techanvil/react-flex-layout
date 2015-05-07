import React from 'react/addons'
import expect from 'expect'
import Layout from './react-flex-layout.jsx'

var TestUtils = React.addons.TestUtils
document.body.style.margin = 0

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
    document.body.appendChild(container)
    var layout = React.render(<Layout fill='container' />, container)
    var domLayout = React.findDOMNode(layout)
    expect(domLayout.offsetHeight).toBe(500)
    var difference = domLayout.offsetWidth - (window.innerWidth / 2)
    expect(difference).toBeLessThan(1, 'differnce was greater than 1')
  })

  it('can have two flex width children', function() {
      var container = document.createElement('div')
      container.style.height = '500px'
      container.style.width = '500px'
      document.body.appendChild(container)
      var toRender = <Layout fill='container'>
          <Layout layoutWidth='flex' />
          <Layout layoutWidth='flex' />
        </Layout>
      var layout = React.render(toRender, container)
      var domLayout = React.findDOMNode(layout)
      var flex1 = domLayout.children[0]
      var flex2 = domLayout.children[1]
      expect(flex1.offsetHeight).toBe(500)
      expect(flex1.offsetWidth).toBe(250)
      expect(flex2.offsetHeight).toBe(500)
      expect(flex2.offsetWidth).toBe(250)
  })

  it('can have two flex height children', function() {
      var container = document.createElement('div')
      container.style.height = '500px'
      container.style.width = '500px'
      document.body.appendChild(container)
      var toRender = <Layout fill='container'>
          <Layout layoutHeight='flex' />
          <Layout layoutHeight='flex' />
        </Layout>
      var layout = React.render(toRender, container)
      var domLayout = React.findDOMNode(layout)
      var flex1 = domLayout.children[0]
      var flex2 = domLayout.children[1]
      expect(flex1.offsetHeight).toBe(250)
      expect(flex1.offsetWidth).toBe(500)
      expect(flex2.offsetHeight).toBe(250)
      expect(flex2.offsetWidth).toBe(500)
  })

  it('can have one fixed and one flex width children', function() {
      var container = document.createElement('div')
      container.style.height = '500px'
      container.style.width = '500px'
      document.body.appendChild(container)
      var toRender = <Layout fill='container'>
          <Layout layoutWidth={100} />
          <Layout layoutWidth='flex' />
        </Layout>
      var layout = React.render(toRender, container)
      var domLayout = React.findDOMNode(layout)
      var flex1 = domLayout.children[0]
      var flex2 = domLayout.children[1]
      expect(flex1.offsetWidth).toBe(100)
      expect(flex2.offsetWidth).toBe(400)
  })

  it('can have one fixed and one flex height children', function() {
      var container = document.createElement('div')
      container.style.height = '500px'
      container.style.width = '500px'
      document.body.appendChild(container)
      var toRender = <Layout fill='container'>
          <Layout layoutHeight={100} />
          <Layout layoutHeight='flex' />
        </Layout>
      var layout = React.render(toRender, container)
      var domLayout = React.findDOMNode(layout)
      var flex1 = domLayout.children[0]
      var flex2 = domLayout.children[1]
      expect(flex1.offsetHeight).toBe(100)
      expect(flex2.offsetHeight).toBe(400)
  })

  it('when child is resized flex widths are recalculated', function() {
    var container = document.createElement('div')
    container.style.height = '500px'
    container.style.width = '500px'
    document.body.appendChild(container)
    var toRender = <Layout fill='container'>
        <Layout layoutWidth={100} />
        <Layout layoutWidth='flex' />
      </Layout>
    var layout = React.render(toRender, container)
    layout.refs.layout0.setWidth(110)
    var domLayout = React.findDOMNode(layout)
    var fixed = domLayout.children[0]
    var flex2 = domLayout.children[1]
    expect(fixed.offsetWidth).toBe(110)
    expect(flex2.offsetWidth).toBe(390)
  })

  // TODO <Layout layoutWidth='100' /> --- need to coerce to a number
  // TODO Children of Layout is rendered properly
  // TODO Multiple nested, one horizontal, one vertical
  // TODO Text content <Layout>Foo</Layout>
  // TODO Children of layout must specify layoutHeight or layoutWidth 
})
