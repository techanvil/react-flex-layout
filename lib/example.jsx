import React from 'react'
import Layout from './react-flex-layout.jsx'
import domready from 'domready'
import locationBar from 'location-bar'

class Example extends React.Component {
  render() {
    var example = <div>Select an example</div>
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
