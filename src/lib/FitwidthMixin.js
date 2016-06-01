import ReactDOM from 'react-dom'
import _ from 'lodash'

let FitwidthMixin = (superclass) => class extends superclass {
  componentDidMount() {
    // set state for the width of the images and listen to window resize event
    this.fitToParentWidth()
    window.addEventListener('resize', this.fitToParentWidth)
  }

  fitToParentWidth() {
    const elem = ReactDOM.findDOMNode(this).parentNode
    const width = elem.clientWidth
    if (width !== this.state.width) {
      this.setState({
        width: width
      })
    }
  }

  _getHeight(width, original, defaultWidth, defaultHeight) {
    if (original) {
      const oriWidth = _.get(original, 'width', defaultWidth)
      const oriHeight = _.get(original, 'height', defaultHeight)
      return Math.round(width * oriHeight / oriWidth)
    }
    return defaultHeight
  }
}

export default FitwidthMixin
