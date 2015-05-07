import React from 'react/addons'
import expect from 'expect'
import Layout from './react-flex-layout.jsx'
import LayoutSplitter from './react-flex-layout-splitter.jsx'

var TestUtils = React.addons.TestUtils

describe('Layout splitter component', function() {
  it('Throws when both previous and next are flex on mouse down', function() {
    var container = document.createElement('div')
    container.style.height = '500px'
    container.style.width = '500px'
    document.body.appendChild(container)
    var components = <Layout>
        <Layout layoutWidth='flex' />
        <LayoutSplitter />
        <Layout layoutWidth='flex' />
      </Layout>
    var rendered = React.render(components, container)
    var splitterNode = React.findDOMNode(rendered.refs.layout1)
    expect(() => TestUtils.Simulate.mouseDown(splitterNode, { clientX: 100, ClientY: 100 })).toThrow()
  })

  it('Fixed panel on left', function() {
    var container = document.createElement('div')
    container.style.height = '500px'
    container.style.width = '500px'
    document.body.appendChild(container)
    var mouseMove
    var fakeDocument = { addEventListener: (e, h) => {
      if (e === 'mousemove') {
        mouseMove = h
      }
    }}
    var components = <Layout>
        <Layout layoutWidth={100} />
        <LayoutSplitter document={fakeDocument} />
        <Layout layoutWidth='flex' />
      </Layout>
    var rendered = React.render(components, container)
    var splitterNode = React.findDOMNode(rendered.refs.layout1)
    TestUtils.Simulate.mouseDown(splitterNode, { clientX: 100, clientY: 100 })
    mouseMove({ clientX: 110, clientY: 100 })
    var layout1 = React.findDOMNode(rendered.refs.layout0)
    var layout2 = React.findDOMNode(rendered.refs.layout2)
    expect(layout1.offsetWidth).toBe(110)
    expect(layout2.offsetWidth).toBe(390 - 11)
  })

  it('Fixed panel on right', function() {
    var container = document.createElement('div')
    container.style.height = '500px'
    container.style.width = '500px'
    document.body.appendChild(container)
    var mouseMove
    var fakeDocument = { addEventListener: (e, h) => {
      if (e === 'mousemove') {
        mouseMove = h
      }
    }}
    var components = <Layout>
        <Layout layoutWidth='flex' />
        <LayoutSplitter document={fakeDocument} />
        <Layout layoutWidth={100} />
      </Layout>
    var rendered = React.render(components, container)
    var splitterNode = React.findDOMNode(rendered.refs.layout1)
    TestUtils.Simulate.mouseDown(splitterNode, { clientX: 100, clientY: 100 })
    mouseMove({ clientX: 110, clientY: 100 })
    var layout1 = React.findDOMNode(rendered.refs.layout0)
    var layout2 = React.findDOMNode(rendered.refs.layout2)
    expect(layout1.offsetWidth).toBe(410 - 11)
    expect(layout2.offsetWidth).toBe(90)
  })


  it('Horizontal with both fixed', function() {
    var container = document.createElement('div')
    container.style.height = '500px'
    container.style.width = '500px'
    document.body.appendChild(container)
    var mouseMove
    var fakeDocument = { addEventListener: (e, h) => {
      if (e === 'mousemove') {
        mouseMove = h
      }
    }}
    var components = <Layout>
        <Layout layoutWidth={100} />
        <LayoutSplitter document={fakeDocument} />
        <Layout layoutWidth={100} />
      </Layout>
    var rendered = React.render(components, container)
    var splitterNode = React.findDOMNode(rendered.refs.layout1)
    TestUtils.Simulate.mouseDown(splitterNode, { clientX: 100, clientY: 100 })
    mouseMove({ clientX: 110, clientY: 100 })
    var layout1 = React.findDOMNode(rendered.refs.layout0)
    var layout2 = React.findDOMNode(rendered.refs.layout2)
    expect(layout1.offsetWidth).toBe(110)
    expect(layout2.offsetWidth).toBe(90)
  })

  it('Fixed panel on top', function() {
    var container = document.createElement('div')
    container.style.height = '500px'
    container.style.width = '500px'
    document.body.appendChild(container)
    var mouseMove
    var fakeDocument = { addEventListener: (e, h) => {
      if (e === 'mousemove') {
        mouseMove = h
      }
    }}
    var components = <Layout>
        <Layout layoutHeight={100} />
        <LayoutSplitter document={fakeDocument} />
        <Layout layoutHeight='flex' />
      </Layout>
    var rendered = React.render(components, container)
    var splitterNode = React.findDOMNode(rendered.refs.layout1)
    TestUtils.Simulate.mouseDown(splitterNode, { clientX: 100, clientY: 100 })
    mouseMove({ clientX: 100, clientY: 110 })
    var layout1 = React.findDOMNode(rendered.refs.layout0)
    var layout2 = React.findDOMNode(rendered.refs.layout2)
    expect(layout1.offsetHeight).toBe(110)
    expect(layout2.offsetHeight).toBe(390 - 11)
  })

  it('Fixed panel on bottom', function() {
    var container = document.createElement('div')
    container.style.height = '500px'
    container.style.width = '500px'
    document.body.appendChild(container)
    var mouseMove
    var fakeDocument = { addEventListener: (e, h) => {
      if (e === 'mousemove') {
        mouseMove = h
      }
    }}
    var components = <Layout>
        <Layout layoutHeight='flex' />
        <LayoutSplitter document={fakeDocument} />
        <Layout layoutHeight={100} />
      </Layout>
    var rendered = React.render(components, container)
    var splitterNode = React.findDOMNode(rendered.refs.layout1)
    TestUtils.Simulate.mouseDown(splitterNode, { clientX: 100, clientY: 100 })
    mouseMove({ clientX: 100, clientY: 110 })
    var layout1 = React.findDOMNode(rendered.refs.layout0)
    var layout2 = React.findDOMNode(rendered.refs.layout2)
    expect(layout1.offsetHeight).toBe(410 - 11)
    expect(layout2.offsetHeight).toBe(90)
  })

  it('Vertical with both fixed', function() {
    var container = document.createElement('div')
    container.style.height = '500px'
    container.style.width = '500px'
    document.body.appendChild(container)
    var mouseMove
    var fakeDocument = { addEventListener: (e, h) => {
      if (e === 'mousemove') {
        mouseMove = h
      }
    }}
    var components = <Layout>
        <Layout layoutHeight={100} />
        <LayoutSplitter document={fakeDocument} />
        <Layout layoutHeight={100} />
      </Layout>
    var rendered = React.render(components, container)
    var splitterNode = React.findDOMNode(rendered.refs.layout1)
    TestUtils.Simulate.mouseDown(splitterNode, { clientX: 100, clientY: 100 })
    mouseMove({ clientX: 100, clientY: 110 })
    var layout1 = React.findDOMNode(rendered.refs.layout0)
    var layout2 = React.findDOMNode(rendered.refs.layout2)
    expect(layout1.offsetHeight).toBe(110)
    expect(layout2.offsetHeight).toBe(90)
  })
})

// TODO Hides selection
