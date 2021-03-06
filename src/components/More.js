import React, { Component } from 'react'
import PropTypes from 'prop-types'

if (process.env.BROWSER) {
  require('./More.css')
}

export default class More extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { loadMore, children } = this.props
    let points = '0,0 25,10 50,0'
    let width = 50
    let height = 11

    return (
      <div className="more-articles arrow clearfix" onClick={loadMore}>
        { children ? React.Children.only(children) : <span>更多文章</span> }
        <div>
          <svg width={width} height={height}>
            <polyline points={points} fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    )
  }
}

More.propTypes = {
  loadMore: PropTypes.func.isRequired
}

export { More }
