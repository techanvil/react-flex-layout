import React from 'react'

export default class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = { width: 0, height: 0 }
    this.handleResize = this.handleResize.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  componentWillMount() {
    this.handleResize(true)
  }

  componentWillDismount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize(willMount) {
    if (this.props.fill === 'window' && window) {
      this.setLayoutDimensions(window.innerWidth, window.innerHeight)
    } else if (!willMount) {
      var domNode = React.findDOMNode(this)
      this.setLayoutDimensions(domNode.parentElement.clientWidth, domNode.parentElement.clientHeight)
    }
  }

  setLayoutDimensions(layoutWidth, layoutHeight) {
    if (this.state.layoutWidth !== layoutWidth ||
        this.state.layoutHeight !== layoutHeight) {

      var state = { layoutWidth: layoutWidth, layoutHeight: layoutHeight}
      if (this.props.children) {

        var numberOfFlexWidths = 0
        var totalAllocatedWidth = 0
        var numberOfFlexHeights = 0
        var totalAllocatedHeight = 0
        for (var i = 0; i < this.props.children.length; i++) {
          var child = this.props.children[i]
          if (child.type === Layout) {
            if (child.props.layoutWidth === 'flex') { numberOfFlexWidths++ }
            else if (this.isNumber(child.props.layoutWidth)) { totalAllocatedWidth += child.props.layoutWidth }
            if (child.props.layoutHeight === 'flex') { numberOfFlexHeights++ }
            else if (this.isNumber(child.props.layoutHeight)) { totalAllocatedHeight += child.props.layoutHeight }
          }
        }
        if (numberOfFlexHeights > 0 && numberOfFlexWidths > 0) {
          throw 'Cannot have layout children with both flex widths and heights'
        }
        if (numberOfFlexWidths > 0) {
          state.calculatedFlexWidth = (layoutWidth - totalAllocatedWidth) / numberOfFlexWidths
        }
        if (numberOfFlexHeights > 0) {
          state.calculatedFlexHeight = (layoutHeight - totalAllocatedHeight) / numberOfFlexHeights
        }
      }
      this.setState(state)
    }
  }

  render() {
    var width = this.props.layoutWidth === 'flex' ? this.props.calculatedFlexWidth : (this.props.layoutWidth || this.state.layoutWidth)
    var height = this.props.layoutHeight === 'flex' ? this.props.calculatedFlexHeight : (this.props.layoutHeight || this.state.layoutHeight)
    var style = this.props.style || {}
    style.width = width
    style.height = height
    var calculatedFlexWidth = this.state.calculatedFlexWidth
    var calculatedFlexHeight = this.state.calculatedFlexHeight
    var children = React.Children.map(
      this.props.children,
      child => {
        if (child._isReactElement) {
          var newProps = {
            calculatedFlexWidth: calculatedFlexWidth,
            calculatedFlexHeight: calculatedFlexHeight,
            layoutWidth: child.props.layoutWidth || width,
            layoutHeight: child.props.layoutHeight || height
          }
          if (calculatedFlexWidth){
            var childStyle = child.props.style || {}
            childStyle.float = 'left'
            newProps.style = childStyle
          }
          var cloned = React.cloneElement(child, newProps)
          return cloned
        }
        return child
      })
    return <div style={style}>{children}</div>
  }

  isNumber(value) {
    return typeof value === 'number';
  }
}
