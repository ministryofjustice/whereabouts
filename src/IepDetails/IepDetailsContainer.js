import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'

import IepHistory from './IepHistory'
import CurrentIepLevel from './CurrentIepLevel'
import IepHistoryForm from './IepHistoryForm'
import { setIepHistoryResults, setIepHistoryFilter } from '../redux/actions'
import OffenderPage from '../OffenderPage/OffenderPage'

const axios = require('axios')

class IepDetailsContainer extends Component {
  componentDidMount() {
    this.getIepDetails({})
  }

  componentDidUpdate = prevProps => {
    const { offenderNo } = this.props

    if (offenderNo !== prevProps.offenderNo) {
      this.getIepDetails({})
    }
  }

  getIepDetails = async ({ establishment, level, fromDate, toDate }) => {
    const {
      offenderNo,
      handleError,
      resetErrorDispatch,
      setLoadedDispatch,
      setIepHistoryResults: setResults,
    } = this.props

    resetErrorDispatch()
    setLoadedDispatch(false)

    try {
      const { data: results } = await axios.get(`/api/bookings/${offenderNo}/iepSummary`, {
        params: {
          establishment,
          level,
          fromDate: fromDate && fromDate.format('YYYY-MM-DD'),
          toDate: toDate && toDate.format('YYYY-MM-DD'),
        },
      })

      setResults({ ...results })
    } catch (error) {
      handleError(error)
    }

    setLoadedDispatch(true)
  }

  applyFilter = async formValues => {
    this.updateResults({ ...formValues })
  }

  updateResults = async fields => {
    const { setIepHistoryFilter: setFilter } = this.props
    setFilter(fields)
    return this.getIepDetails(fields)
  }

  reset = () => {
    const { setIepHistoryFilter: setFilter } = this.props
    setFilter({ establishment: null, level: null, fromDate: null, toDate: null })
    this.getIepDetails({})
  }

  render() {
    const { offenderNo, handleError, setLoadedDispatch, history } = this.props
    return (
      <OffenderPage
        title={({ firstName, lastName }) => `IEP details for ${firstName} ${lastName}`}
        handleError={handleError}
        offenderNumber={offenderNo}
        setLoaded={setLoadedDispatch}
      >
        <CurrentIepLevel history={history} />
        <IepHistoryForm search={this.applyFilter} reset={this.reset} />
        <IepHistory />
      </OffenderPage>
    )
  }
}

IepDetailsContainer.propTypes = {
  offenderNo: PropTypes.string.isRequired,
  handleError: PropTypes.func.isRequired,
  setIepHistoryResults: PropTypes.func.isRequired,
  setIepHistoryFilter: PropTypes.func.isRequired,
  // history from Redux Router Route
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
  fieldValues: PropTypes.shape({
    establishment: PropTypes.string,
    level: PropTypes.string,
    fromDate: PropTypes.instanceOf(moment),
    toDate: PropTypes.instanceOf(moment),
  }).isRequired,

  // redux dispatch
  resetErrorDispatch: PropTypes.func.isRequired,
  setLoadedDispatch: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  error: state.app.error,
  results: state.iepHistory.results,
  fieldValues: {
    establishment: state.iepHistory.establishment,
    level: state.iepHistory.level,
    fromDate: state.iepHistory.fromDate,
    toDate: state.iepHistory.toDate,
  },
})

const mapDispatchToProps = {
  setIepHistoryResults,
  setIepHistoryFilter,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IepDetailsContainer)
