import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import DatePicker from './datePicker'

const DatePickerInput = props => {
  const { additionalClassName, handleDateChange, label, value, inputId, error } = props
  return (
    <DatePicker
      inputProps={{
        placeholder: 'Today',
        className: `datePickerInput form-control ${additionalClassName}`,
        label,
        error,
      }}
      name="date"
      shouldShowDay={date =>
        date.isAfter(
          moment()
            .subtract(1, 'days')
            .startOf('day')
        )
      }
      title="Date"
      handleDateChange={handleDateChange}
      inputId={inputId}
      value={value}
    />
  )
}

DatePickerInput.propTypes = {
  handleDateChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  inputId: PropTypes.string.isRequired,
  additionalClassName: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
}

DatePickerInput.defaultProps = {
  additionalClassName: '',
  label: '',
  error: '',
  value: '',
}

export default DatePickerInput
