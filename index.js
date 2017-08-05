import React, { Component } from 'react'
import PropTypes from 'prop-types'
import HyperList from 'hyperlist'

class HyperListReact extends React.Component {
  render() {
    return React.createElement('div', this.state.element,
      this.state.fragment
    )
  }

  constructor(props) {
    super(props)

    this.handleRef = this.handleRef.bind(this)

    this.state = {
      element: {
        ref: this.handleRef
      },
      scroller: {
        key: 'scroller',
        style: {
          position: 'relative'
        }
      },
      fragment: [],
      node: {}
    }
  }

  handleRef(node) {
    this.setState({
      node
    })
  }

  componentDidMount() {
    const { height, itemHeight, total, reverse, generate } = this.props

    const config = {
      height,
      itemHeight,
      total,
      generate,
      scroller: React.createElement('div', this.state.scroller),
      useFragment: false,
      overrideScrollPosition: () => this.state.node.scrollTop || 0,
      inspectElement: (element, key) => element.props[key === 'class' ? 'className' : key] || null,
      transformElement: (element, values) => {
        if (values.class) {
          values.className = values.class
          delete values.class
        }

        return React.cloneElement(element, values)
      },
      mergeStyle: (element, style, forceClone) => {
        if (forceClone) {
          return React.cloneElement(element, { style })
        }

        for (let i in style) {
          if (element.props.style[i] !== style[i]) {
            element.props.style[i] = style[i]
          }
        }

        return element
      },
      applyPatch: (element, fragment) => {
        this.setState({
          element: Object.assign({}, this.state.element, {
            style: Object.assign({}, this.state.element.style, element.props.style)
          }),
          fragment
        })
      },
    }

    this.list = HyperList.create(this, config)

    // Bind to the resize event, and since you should only ever have one
    // handler bound to this, we pave over whatever you had set before.
    window.onresize = e => {
      config.height = window.innerHeight
      this.list.refresh(this, config)
    }
  }

  componentWillUnmount() {
    window.onresize = null
    this.list.destroy()
  }
}

HyperListReact.propTypes = {
  style: PropTypes.object,
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  itemHeight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  total: PropTypes.number.isRequired,
  reverse: PropTypes.bool,
  generate: PropTypes.func.isRequired
}

HyperListReact.defaultProps = {
  style: {},
  height: window.innerHeight,
  itemHeight: 50,
  reverse: false
}

export default HyperListReact
