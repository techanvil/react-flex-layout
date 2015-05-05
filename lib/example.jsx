import React from 'react'
import Layout from './react-flex-layout.jsx'
import domready from 'domready'
import LocationBar from 'location-bar'
var locationBar = new LocationBar();

class Horizontal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <Layout>
      <Layout layoutWidth={100}>Column1</Layout>
      <Layout layoutWidth='flex'>Column2</Layout>
    </Layout>
  }
}
class FixedRightPane extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <Layout>
      <Layout layoutWidth='flex'>Column1</Layout>
      <Layout layoutWidth={100}>Column2</Layout>
    </Layout>
  }
}

class ThreeColumn extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <Layout>
      <Layout layoutWidth={100}>Column1</Layout>
      <Layout layoutWidth='flex'>Column2</Layout>
      <Layout layoutWidth={100}>Column3</Layout>
    </Layout>
  }
}
class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    locationBar.route(/horizontal/, () => {
      this.setState({page: <Horizontal />})
    })
    locationBar.route(/fixedright/, () => {
      this.setState({page: <FixedRightPane />})
    })
    locationBar.route(/threecolumn/, () => {
      this.setState({page: <ThreeColumn />})
    })
    locationBar.start()
  }

  render() {
    var example = this.state.page ? this.state.page : <div>Select an example</div>
    return <Layout fill='window'>
      <Layout layoutHeight={100}>
        <a href='#horizontal'>Horizontal</a> |
        <a href='#fixedright'>Fixed right column</a> |
        <a href='#threecolumn'>Three column</a>
      </Layout>
      <Layout layoutHeight='flex'>
        {example}
      </Layout>
    </Layout>
  }
}

domready(() => {
  var container = document.createElement('div')
  document.body.appendChild(container)
  React.render(<Example />, container)
})
