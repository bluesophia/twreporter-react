import React from 'react'
import PropTypes from 'prop-types'
import { google } from '../conf/storage'
import { replaceStorageUrlPrefix } from '../utils/url'

const spinnerLogoUrl = `${google.schema}://${google.hostname}/${google.bucket}/images/spinner-logo.gif`

const LoadingSpinner = (props) => (
  <div className={props.className}>
    <img src={replaceStorageUrlPrefix(spinnerLogoUrl)} alt={props.alt}/>
  </div>
)

LoadingSpinner.propTypes = {
  alt: PropTypes.string,
  className: PropTypes.string
}

LoadingSpinner.defaultProps = {
  alt: '資料載入中'
}

export default LoadingSpinner
