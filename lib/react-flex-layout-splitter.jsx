import React from 'react'

export default class LayoutSplitter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      active: false
    }
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
      let layout1 = this.props.previousLayout
      let layout2 = this.props.nextLayout
      if (layout1 && layout2) {
        let current = this.props.orientation === 'horizontal' ? event.clientX : event.clientY

        let isLayout1Flex = layout1.props.layoutWidth === 'flex'
        let isLayout2Flex = layout2.props.layoutWidth === 'flex'
        if (isLayout1Flex && isLayout2Flex) {
          throw 'Do not support resizing two flex Layouts'
        } else if (isLayout1Flex) {
          // Layout 2 has fixed size
          let newSize = layout2.props.layoutSize - (current - position)
          layout2.setState({layoutWidth: newSize})
        } else if (isLayout2Flex) {
        } else {

        }

        let size = this.props.orientation === 'horizontal' ? width : height
        let position = this.state.position
        let newSize = size - (position - current)
        this.setState({
            position: current
        })
        if (newSize >= this.props.minSize) {
          layout1.setState({
              size: newSize
          })
        }
      }
    }
  }

  up() {

  }

  handleDown(event) {
    let position = this.props.orientation === 'horizontal' ? event.clientX : event.clientY;
    this.setState({
        active: true,
        position: position
    })
  }

  render() {
    let orientation = this.props.orientation;
    let classes = ['Resizer', orientation];
    return <span className={classes.join(' ')} onMouseDown={this.handleDown.bind(this)} />
  }
}

LayoutSplitter.propTypes = {
  orientation: React.PropTypes.string,
  previousLayout: React.PropTypes.object,
  nextLayout: React.PropTypes.object
}
