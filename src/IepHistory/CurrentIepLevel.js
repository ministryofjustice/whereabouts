import React from 'react'
import PropTypes from 'prop-types'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { CurrentIepLevelArea } from './IepHistory.styles'

const CurrentIepLevel = ({ level, days, nextReviewDate }) => (
  <CurrentIepLevelArea>
    <GridRow>
      <GridCol setWidth="one-quarter">
        <strong className="label">Current IEP level</strong>
        <p>{level}</p>
      </GridCol>
      <GridCol setWidth="one-quarter">
        <strong className="label">Days since review</strong>
        <p>{days}</p>
      </GridCol>
      <GridCol setWidth="one-quarter">
        <strong className="label">Date of next review</strong>
        <p>{nextReviewDate}</p>
      </GridCol>
    </GridRow>
  </CurrentIepLevelArea>
)

CurrentIepLevel.propTypes = {
  level: PropTypes.string,
  days: PropTypes.number,
  nextReviewDate: PropTypes.string,
}

CurrentIepLevel.defaultProps = {
  level: '',
  days: 0,
  nextReviewDate: '',
}

export default CurrentIepLevel
