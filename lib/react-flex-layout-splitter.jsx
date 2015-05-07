import React from 'react'

export default class LayoutSplitter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      active: false
    }
    this.up = this.up.bind(this)
    this.move = this.move.bind(this)
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.up)
    document.addEventListener('mousemove', this.move)
    if (this.props.orientation === 'horizontal') {
      this.setState({layoutWidth: this.props.layoutWidth || 11})
      this.props.layoutChanged()
    }
    if (this.props.orientation === 'vertical') {
      this.setState({layoutHeight: this.props.layoutHeight || 11})
      this.props.layoutChanged()
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.up)
    document.removeEventListener('mousemove', this.move)
  }

  move(event) {
    if (this.state.active) {
      let currentPosition = this.props.orientation === 'horizontal' ? event.clientX : event.clientY;
      this.state.newPositionHandler(currentPosition)
    }
  }

  up() {
    if (this.state.active) {
      this.setState({ active: false })
      this.props.restoreSelection()
    }
  }

  handleDown(event) {
    let downPosition = this.props.orientation === 'horizontal' ? event.clientX : event.clientY;
    let layout1 = this.props.getPreviousLayout()
    let layout2 = this.props.getNextLayout()
    let layoutProp = this.props.orientation === 'horizontal' ? 'layoutWidth' : 'layoutHeight'
    let updateFunctionName = this.props.orientation === 'horizontal' ? 'setWidth' : 'setHeight'

    if (layout1 && layout2) {
      this.props.hideSelection()
      let isLayout1Flex = layout1.props[layoutProp] === 'flex'
      let isLayout2Flex = layout2.props[layoutProp] === 'flex'
      let newPositionHandler

      if (isLayout1Flex && isLayout2Flex) {
        throw 'Do not support resizing two flex Layouts'
      } else if (isLayout1Flex) {
        // Layout 2 has fixed size
        let originalSize = layout2.state[layoutProp]
        newPositionHandler = (currentPosition) => {
          let delta = downPosition - currentPosition
          let newSize = originalSize + delta
          layout2.setWidth(newSize)
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
        let originalWidth1 = layout1.state.layoutWidth
        let originalWidth2 = layout2.state.layoutWidth
        newPositionHandler = (currentPosition) => {
          let delta = currentPosition - downPosition
          layout1[updateFunctionName](originalWidth1 + delta)
          layout2[updateFunctionName](originalWidth2 - delta)
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
    let downHandler = this.handleDown.bind(this)
    let style = {
      width: this.state.layoutWidth || this.props.containerWidth,
      height: this.state.layoutHeight || this.props.containerHeight
    }

    return <div className={classes.join(' ')} style={style} onMouseDown={downHandler} />
  }
}

LayoutSplitter.propTypes = {
  orientation: React.PropTypes.string,
  getPreviousLayout: React.PropTypes.func,
  getNextLayout: React.PropTypes.func
}
