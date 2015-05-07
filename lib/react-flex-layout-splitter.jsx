import React from 'react'

export default class LayoutSplitter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      active: false,
      orientation: 'horizontal'
    }
    this.up = this.up.bind(this)
    this.move = this.move.bind(this)
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.up)
    document.addEventListener('mousemove', this.move)
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.up)
    document.removeEventListener('mousemove', this.move)
  }

  move(event) {
    if (this.state.active) {
      let currentPosition = this.state.orientation === 'horizontal' ? event.clientX : event.clientY;
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
    let downPosition = this.state.orientation === 'horizontal' ? event.clientX : event.clientY;
    let layout1 = this.props.getPreviousLayout()
    let layout2 = this.props.getNextLayout()
    if (layout1 && layout2) {
      this.props.hideSelection()
      let isLayout1Flex = layout1.props.layoutWidth === 'flex'
      let isLayout2Flex = layout2.props.layoutWidth === 'flex'
      let newPositionHandler

      if (isLayout1Flex && isLayout2Flex) {
        throw 'Do not support resizing two flex Layouts'
      } else if (isLayout1Flex) {
        // Layout 2 has fixed size
        let originalWidth = layout2.state.layoutWidth
        newPositionHandler = (currentPosition) => {
          let delta = downPosition - currentPosition
          let newSize = originalWidth + delta
          layout2.setWidth(newSize)
        }
      } else if (isLayout2Flex) {
        // Layout 1 has fixed size
        let originalWidth = layout1.state.layoutWidth
        newPositionHandler = (currentPosition) => {
          let delta = currentPosition - downPosition
          let newSize = originalWidth + delta
          layout1.setWidth(newSize)
        }
      }
      else {
        // Both are fixed width
        let originalWidth1 = layout1.state.layoutWidth
        let originalWidth2 = layout1.state.layoutWidth
        newPositionHandler = (currentPosition) => {
          let delta = currentPosition - downPosition
          layout1.setWidth(originalWidth1 + delta)
          layout2.setWidth(originalWidth2 - delta)
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
    let classes = ['Resizer', 'horizontal'];
    let downHandler = this.handleDown.bind(this)
    return <span className={classes.join(' ')} onMouseDown={downHandler} />
  }
}

LayoutSplitter.propTypes = {
  orientation: React.PropTypes.string,
  previousLayout: React.PropTypes.object,
  nextLayout: React.PropTypes.object
}
LayoutSplitter.defaultProps = {
  layoutWidth: 11,
  layoutHeight: 11
}
