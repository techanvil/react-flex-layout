import React from 'react'

export default class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = { width: 0, height: 0 }
  }

  componentWillMount() {
    this.handleResize()
  }

  componentDidMount() {
    window.addEventListener('resize', () => this.handleResize())
    this.handleResize()
  }

  componentWillDismount() {
    window.removeEventListener('resize', () => this.handleResize())
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.layoutWidth !== nextState.layoutWidth ||
        this.state.layoutHeight !== nextState.layoutHeight) {

      for (var i = 0; i < this.children.length; i++) {

      }
    }
  }

  handleResize() {
    if (this.props.fill === 'window' && window) {
      this.setState({ layoutWidth: window.innerWidth, layoutHeight: window.innerHeight })
    } else if (this.props.fill === 'container') {
      var domNode = React.findDOMNode(this)
      this.setState({ layoutWidth: domNode.parentElement.offsetWidth, layoutHeight: domNode.parentElement.clientHeight })
    }
  }

  render() {
    var style = { width: this.state.layoutWidth, height: this.state.layoutHeight }
    return <div style={style}>{this.props.children}</div>
  }
}
