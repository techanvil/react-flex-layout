import React from 'react'

export default class LayoutSplitter extends React.Component {
  constructor(props) {
    super(props)
    this.document = props.document || document

    this.state = {
      active: false
    }
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
  }

  componentDidMount() {
    this.document.addEventListener('mouseup', this.handleMouseUp)
    this.document.addEventListener('mousemove', this.handleMouseMove)
    if (this.props.orientation === 'horizontal') {
      this.state.layoutWidth = this.props.layoutWidth || 11
      this.setState(this.state)
      this.props.layoutChanged()
    }
    if (this.props.orientation === 'vertical') {
      this.state.layoutHeight = this.props.layoutHeight || 11
      this.setState(this.state)
      this.props.layoutChanged()
    }
  }

  componentWillUnmount() {
    this.document.removeEventListener('mouseup', this.handleMouseUp)
    this.document.removeEventListener('mousemove', this.handleMouseMove)
  }

  handleMouseMove(event) {
    if (this.state.active) {
      let currentPosition = this.props.orientation === 'horizontal' ? event.clientX : event.clientY;
      this.state.newPositionHandler(currentPosition)
    }
  }

  handleMouseUp() {
    if (this.state.active) {
      this.setState({ active: false })
      this.props.restoreSelection()
    }
  }

  handleMouseDown(event) {
    let downPosition = this.props.orientation === 'horizontal' ? event.clientX : event.clientY;
    let layoutProp = this.props.orientation === 'horizontal' ? 'layoutWidth' : 'layoutHeight'
    let updateFunctionName = this.props.orientation === 'horizontal' ? 'setWidth' : 'setHeight'
    let layout1 = this.props.getPreviousLayout()
    let layout2 = this.props.getNextLayout()
    if ((layout1.props.layoutWidth === 'flex' && layout2.props.layoutWidth === 'flex') ||
        (layout1.props.layoutHeight === 'flex' && layout2.props.layoutHeight === 'flex')) {
      throw new Error('You cannot place a LayoutSplitter between two flex Layouts')
    }

    if (layout1 && layout2) {
      this.props.hideSelection()
      let isLayout1Flex = layout1.props[layoutProp] === 'flex'
      let isLayout2Flex = layout2.props[layoutProp] === 'flex'
      let newPositionHandler

      if (isLayout1Flex && isLayout2Flex) {
        throw new Error('Do not support resizing two flex Layouts')
      } else if (isLayout1Flex) {
        // Layout 2 has fixed size
        let originalSize = layout2.state[layoutProp]
        newPositionHandler = (currentPosition) => {
          let delta = downPosition - currentPosition
          let newSize = originalSize + delta
          layout2[updateFunctionName](newSize)
        }
      } else if (isLayout2Flex) {
        // Layout 1 has fixed size
        let originalSize = layout1.state[layoutProp]
        newPositionHandler = (currentPosition) => {
          let delta = currentPosition - downPosition
          let newSize = originalSize + delta
          layout1[updateFunctionName](newSize)
        }
      }
      else {
        // Both are fixed width
        let originalSize1 = layout1.state[layoutProp]
        let originalSize2 = layout2.state[layoutProp]
        newPositionHandler = (currentPosition) => {
          let delta = currentPosition - downPosition
          layout1[updateFunctionName](originalSize1 + delta)
          layout2[updateFunctionName](originalSize2 - delta)
        }
      }

      this.setState({
        active: true,
        newPositionHandler: newPositionHandler
      })
    }
  }

  render() {
    //let orientation = this.props.orientation;
    let classes = ['Resizer', this.props.orientation];
    let style = {
      width: this.state.layoutWidth || this.props.containerWidth,
      height: this.state.layoutHeight || this.props.containerHeight
    }

    return <div className={classes.join(' ')} style={style} onMouseDown={this.handleMouseDown} />
  }
}

LayoutSplitter.propTypes = {
  orientation: React.PropTypes.string,
  getPreviousLayout: React.PropTypes.func,
  getNextLayout: React.PropTypes.func
}
