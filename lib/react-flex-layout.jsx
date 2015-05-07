import React from 'react'
import LayoutSplitter from './react-flex-layout-splitter.jsx'

export default class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      layoutWidth: 0,
      layoutHeight: 0
    }
    if (props.layoutWidth !== 'flex') {
      // TODO throw if not number
      this.state.layoutWidth = props.layoutWidth
    }
    if (props.layoutHeight !== 'flex') {
      // TODO throw if not number
      this.state.layoutHeight = props.layoutHeight
    }

    this.handleResize = this.handleResize.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize() {
    if (this.props.fill === 'window' && window) {
      this.setState({ layoutWidth: window.innerWidth, layoutHeight: window.innerHeight })
    } else if (!this.props.layoutWidth && !this.props.layoutHeight) {
      var domNode = React.findDOMNode(this)
      this.setState({ layoutWidth: domNode.parentElement.clientWidth, layoutHeight: domNode.parentElement.clientHeight })
    }
  }

  setWidth(newWidth) {
    this.state.layoutWidth = newWidth
    this.setState(this.state)
    if (this.props.layoutChanged) {
      this.props.layoutChanged()
    }
  }

  setHeight(newHeight) {
    this.setState({layoutHeight: newHeight})
    if (this.props.layoutChanged) {
      this.props.layoutChanged()
    }
  }

  childLayoutChanged() {
    // State hasn't changed but render relies on child properties
    this.setState(this.state)
  }

  recalculateFlexLayout() {
    var newFlexDimentions = {}
    if (this.props.children) {
      var numberOfFlexWidths = 0
      var totalAllocatedWidth = 0
      var numberOfFlexHeights = 0
      var totalAllocatedHeight = 0
      for (var i = 0; i < this.props.children.length; i++) {
        var childDefinition = this.props.children[i]
        var childType = childDefinition.type

        if (childType === Layout || childType === LayoutSplitter) {
          var child = this.refs['layout' + i]
          if (childDefinition.props.layoutWidth === 'flex') { numberOfFlexWidths++ }
          else if (!child && this.isNumber(childDefinition.props.layoutWidth)) { totalAllocatedWidth += childDefinition.props.layoutWidth }
          else if (child && this.isNumber(child.state.layoutWidth)) { totalAllocatedWidth += child.state.layoutWidth }

          if (childDefinition.props.layoutHeight === 'flex') { numberOfFlexHeights++ }
          else if (!child && this.isNumber(childDefinition.props.layoutHeight)) { totalAllocatedHeight += childDefinition.props.layoutHeight }
          else if (child && this.isNumber(child.state.layoutHeight)) { totalAllocatedHeight += child.state.layoutHeight }
        }
      }
      if (numberOfFlexHeights > 0 && numberOfFlexWidths > 0) {
        throw 'Cannot have layout children with both flex widths and heights'
      }
      if (numberOfFlexWidths > 0) {
        newFlexDimentions.width = (this.state.layoutWidth - totalAllocatedWidth) / numberOfFlexWidths
      }
      if (numberOfFlexHeights > 0) {
        newFlexDimentions.height = (this.state.layoutHeight - totalAllocatedHeight) / numberOfFlexHeights
      }
    }

    return newFlexDimentions
  }

  render() {
    var width = this.props.layoutWidth === 'flex' ? this.props.calculatedFlexWidth : (this.state.layoutWidth || this.props.containerWidth)
    var height = this.props.layoutHeight === 'flex' ? this.props.calculatedFlexHeight : (this.state.layoutHeight || this.props.containerHeight)

    if (!width || !height) {
      // We don't know our size yet (maybe initial render)
      return <div />
    }
    var style = this.props.style || {}
    style.overflow = 'hidden'
    style.width = width
    style.height = height
    var count = -1
    var calculatedFlexDimentions = this.recalculateFlexLayout()
    var children = React.Children.map(
      this.props.children,
      child => {
        count++
        if (child.type === Layout) {
          var newProps = {
            layoutChanged: this.childLayoutChanged.bind(this),
            calculatedFlexWidth: calculatedFlexDimentions.width,
            calculatedFlexHeight: calculatedFlexDimentions.height,
            containerHeight: height,
            containerWidth: width,
            ref: 'layout' + count
          }
          if (calculatedFlexDimentions.width) {
            var childStyle = child.props.style || {}
            childStyle.float = 'left'
            newProps.style = childStyle
          }
          var cloned = React.cloneElement(child, newProps)
          return cloned
        } else if (child.type === LayoutSplitter) {
          var newProps = {
            getPreviousLayout: () => {
              var index = this.props.children.indexOf(child)
              return this.refs['layout' + (index - 1)]
            },
            getNextLayout: () => {
              var index = this.props.children.indexOf(child)
              return this.refs['layout' + (index + 1)]
            }
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
