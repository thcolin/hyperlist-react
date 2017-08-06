import React, { Component } from 'react'
import PropTypes from 'prop-types'
import HyperList from 'hyperlist'

class HyperListReact extends React.Component {
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
      node: {},
      config: {},
      hyperlist: null
    }

    this.state.config = {
      height: props.height,
      itemHeight: props.itemHeight,
      total: props.total,
      generate: props.generate,
      scroller: React.createElement('div', this.state.scroller),
      useFragment: false,
      overrideScrollPosition: () => this.state.node.scrollTop || 0,
      inspectElement: inspectElement,
      transformElement: transformElement,
      mergeStyle: mergeStyle,
      applyPatch: (element, fragment) => {
        this.setState({
          element: Object.assign({}, this.state.element, {
            style: Object.assign({}, this.state.element.style, element.props.style)
          }),
          fragment
        })
      }
    }
  }

  handleRef(node) {
    this.setState({
      node
    })
  }

  componentDidMount() {
    const hyperlist = HyperList.create(this, this.state.config)

    this.setState({ hyperlist })

    // Bind to the resize event, and since you should only ever have one
    // handler bound to this, we pave over whatever you had set before.
    window.onresize = e => {
      this.setState({
        config: Object.assign({}, this.state.config, {
          height: window.innerHeight
        })
      })

      this.state.hyperlist.refresh(this, this.state.config)
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      config: Object.assign({}, this.state.config, {
        height: props.height,
        itemHeight: props.itemHeight,
        total: props.total,
        generate: props.generate
      })
    })

    this.state.hyperlist.refresh(this, this.state.config)
  }

  componentWillUnmount() {
    window.onresize = null
    this.state.hyperlist.destroy()
  }

  render() {
    return React.createElement('div', this.state.element,
      this.state.fragment
    )
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

function inspectElement(element, key){
  switch (key) {
    case 'class':
      key = 'className'
    break;
  }

  return element.props[key] || null
}

function transformElement(element, values){
  if (values.class) {
    values.className = values.class
    delete values.class
  }

  return React.cloneElement(element, values)
}

function mergeStyle(element, style, forceClone){
  if (forceClone) {
    return React.cloneElement(element, { style })
  }

  for (let i in style) {
    if (element.props.style[i] !== style[i]) {
      element.props.style[i] = style[i]
    }
  }

  return element
}

export default HyperListReact
