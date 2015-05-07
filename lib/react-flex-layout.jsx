import React from 'react'
import LayoutSplitter from './react-flex-layout-splitter.jsx'

export default class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      layoutWidth: 0,
      layoutHeight: 0,
      hideSelection: false
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
      let domNode = React.findDOMNode(this)
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
    let newFlexDimentions = {}
    if (this.props.children) {
      let numberOfFlexWidths = 0
      let totalAllocatedWidth = 0
      let numberOfFlexHeights = 0
      let totalAllocatedHeight = 0
      for (let i = 0; i < this.props.children.length; i++) {
        var childDefinition = this.props.children[i]
        var childType = childDefinition.type
        if (childType === Layout && !childDefinition.props.layoutWidth && !childDefinition.props.layoutHeight) {
          throw 'Child Layouts must have either layoutWidth or layoutHeight set'
        }

        if (childType === Layout || childType === LayoutSplitter) {
          let child = this.refs['layout' + i]
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
      } else if (numberOfFlexHeights > 0) {
        newFlexDimentions.height = (this.state.layoutHeight - totalAllocatedHeight) / numberOfFlexHeights
      }

      let isHorizontal = numberOfFlexWidths > 0 || totalAllocatedWidth > 0
      let isVertical = numberOfFlexHeights > 0 || totalAllocatedHeight > 0
      if (isHorizontal && isVertical) {
        throw 'You can only specify layoutHeight or layoutWidth at a single level'
      } else if (isHorizontal) {
        newFlexDimentions.orientation = 'horizontal'
      } else if (isVertical) {
        newFlexDimentions.orientation = 'vertical'
      }
    }

    return newFlexDimentions
  }

  render() {
    let width = this.props.layoutWidth === 'flex' ? this.props.calculatedFlexWidth : (this.state.layoutWidth || this.props.containerWidth)
    let height = this.props.layoutHeight === 'flex' ? this.props.calculatedFlexHeight : (this.state.layoutHeight || this.props.containerHeight)

    if (!width || !height) {
      // We don't know our size yet (maybe initial render)
      return <div />
    }
    let style = this.props.style || {}
    style.overflow = 'hidden'
    style.width = width
    style.height = height
    let count = -1
    let calculatedFlexDimentions = this.recalculateFlexLayout()
    let children = React.Children.map(
      this.props.children,
      child => {
        count++
        if (child.type === Layout) {
          let newProps = {
            layoutChanged: this.childLayoutChanged.bind(this),
            calculatedFlexWidth: calculatedFlexDimentions.width,
            calculatedFlexHeight: calculatedFlexDimentions.height,
            containerHeight: height,
            containerWidth: width,
            ref: 'layout' + count
          }
          if (calculatedFlexDimentions.orientation === 'horizontal') {
            let childStyle = child.props.style || {}
            childStyle.float = 'left'
            newProps.style = childStyle
          }
          let cloned = React.cloneElement(child, newProps)
          return cloned
        } else if (child.type === LayoutSplitter) {
          let newProps = {
            layoutChanged: this.childLayoutChanged.bind(this),
            orientation: calculatedFlexDimentions.orientation,
            containerHeight: height,
            containerWidth: width,
            ref: 'layout' + count,
            hideSelection: () => {
              this.setState({ hideSelection: true })
            },
            restoreSelection: () => {
              this.clearSelection()
              this.setState({ hideSelection: false })
            },
            getPreviousLayout: () => {
              let index = this.props.children.indexOf(child)
              return this.refs['layout' + (index - 1)]
            },
            getNextLayout: () => {
              let index = this.props.children.indexOf(child)
              return this.refs['layout' + (index + 1)]
            }
          }
          let cloned = React.cloneElement(child, newProps)
          return cloned
        }
        return child
      })

      let className = null
      if (this.state.hideSelection) {
        className = 'hideSelection'
      }
    return <div style={style} className={className}>{children}</div>
  }

  isNumber(value) {
    return typeof value === 'number';
  }

  clearSelection() {
    if (window.getSelection) {
      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {  // IE?
      document.selection.empty();
    }
  }
}

Layout.propTypes = {
  hideSelection: React.PropTypes.bool
}
