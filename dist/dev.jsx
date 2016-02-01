import React from 'react'
import ReactDOM from 'react-dom'
import {Layout, LayoutSplitter} from './../lib/index.js'
import domready from 'domready'

class Dev extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <Layout fill='window'>
      <Layout layoutWidth={100}><div style={{height: '500px'}}>Column1</div></Layout>
      <LayoutSplitter />
      <Layout layoutWidth='flex'>Column2</Layout>
    </Layout>
  }
}

domready(() => {
  var container = document.createElement('div')
  document.body.appendChild(container)
  ReactDOM.render(<Dev />, container)
})
