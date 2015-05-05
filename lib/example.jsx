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

class Example extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    locationBar.route(/horizontal/, () => {
      this.setState({page: <Horizontal />})
    })
    locationBar.start()
  }

  render() {
    var example = this.state.page ? this.state.page : <div>Select an example</div>
    return <Layout fill='window'>
      <Layout layoutHeight={100}><a href='#horizontal'>Horizontal</a></Layout>
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
