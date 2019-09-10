import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import './AlertFlags.scss'

const AlertFlag = ({ children, ...props }) => (
  <Fragment>
    <span {...props}>{children}</span>{' '}
  </Fragment>
)

AlertFlag.propTypes = {
  children: PropTypes.string.isRequired,
}

const AlertFlags = ({ alerts, category }) => {
  function isShown(code) {
    if (alerts) {
      return alerts.some(alert => {
        if (alert.get) {
          if (!alert.get('expired')) {
            if (alert.get('alertCode') === code) return true
          }
        } else if (alert === code) return true
        return false
      })
    }
    return false
  }

  if (!alerts.length && !category) return null

  return (
    <div className="alerts">
      {isShown('HA') && <AlertFlag className="acct-status">ACCT</AlertFlag>}
      {isShown('XEL') && <AlertFlag className="elist-status">E-LIST</AlertFlag>}
      {isShown('PEEP') && <AlertFlag className="disability-status">PEEP</AlertFlag>}
      {(category === 'A' || category === 'E') && <AlertFlag className="cata-status">CAT A</AlertFlag>}
      {category === 'H' && <AlertFlag className="cata-high-status">CAT A High</AlertFlag>}
      {category === 'P' && <AlertFlag className="cata-prov-status">CAT A Prov</AlertFlag>}
    </div>
  )
}

AlertFlags.propTypes = {
  alerts: PropTypes.arrayOf(PropTypes.string),
  category: PropTypes.string,
}

AlertFlags.defaultProps = {
  alerts: [],
  category: undefined,
}

export default AlertFlags
