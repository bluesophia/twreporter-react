'use strict'
import commonStyles from './Common.scss'
import styles from './HeaderOne.scss'
import classNames from 'classnames'
import React from 'react' // eslint-disable-next-line

// lodash
import get from 'lodash/get'

export class HeaderOne extends React.PureComponent {
  render() {
    const { content } = this.props
    return (
      <header>
        <h1 className={classNames(commonStyles['inner-block'],
          styles['title'], 'text-justify')} dangerouslySetInnerHTML={{ __html: get(content, [ 0 ], '') }} />
      </header>
    )
  }
}
