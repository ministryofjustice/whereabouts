const { toAppointmentDetailsSummary } = require('./appointmentsService')
const { serviceUnavailableMessage } = require('../../common-messages')

const unpackAppointmentDetails = req => {
  const appointmentDetails = req.flash('appointmentDetails')
  if (!appointmentDetails || !appointmentDetails.length) throw new Error('Appointment details are missing')

  return appointmentDetails.reduce(
    (acc, current) => ({
      ...acc,
      ...current,
    }),
    {}
  )
}

const selectCourtAppointmentCourtFactory = (elite2Api, logError) => {
  const courts = {
    london: 'City of London',
    kingston: 'Kingston-upon-Thames',
    southwark: 'Southwark',
    westminster: 'Westminster',
    wimbledon: 'Wimbledon',
  }

  const renderError = (req, res, error) => {
    if (error) logError(req.originalUrl, error, serviceUnavailableMessage)

    return res.render('error.njk')
  }

  const renderTemplate = async (req, res, pageData) => {
    const appointmentDetails = unpackAppointmentDetails(req)
    const { offenderNo, agencyId } = req.params

    try {
      const [offenderDetails, agencyDetails] = await Promise.all([
        elite2Api.getDetails(res.locals, offenderNo),
        elite2Api.getAgencyDetails(res.locals, agencyId),
      ])

      const { firstName, lastName } = offenderDetails
      const { startTime, endTime } = appointmentDetails

      req.flash('appointmentDetails', appointmentDetails)

      return res.render('addAppointment/selectCourtAppointmentCourt.njk', {
        ...pageData,
        courts: Object.keys(courts).map(key => ({ value: key, text: courts[key] })),
        details: toAppointmentDetailsSummary({
          firstName,
          lastName,
          offenderNo,
          startTime,
          endTime,
          agencyDescription: agencyDetails.description,
        }),
      })
    } catch (error) {
      return renderError(req, res, error)
    }
  }

  const index = async (req, res) => renderTemplate(req, res)

  const post = (req, res) => {
    const { offenderNo, agencyId } = req.params
    const { court } = req.body
    const appointmentDetails = unpackAppointmentDetails(req)

    if (!court) {
      req.flash('appointmentDetails', appointmentDetails)

      return renderTemplate(req, res, {
        errors: [{ text: 'Select a court', href: '#court' }],
      })
    }

    req.flash('appointmentDetails', { ...appointmentDetails, court: courts[court] })

    return res.redirect(`/${agencyId}/offenders/${offenderNo}/add-court-appointment/select-rooms`)
  }

  return { index, post }
}

module.exports = {
  selectCourtAppointmentCourtFactory,
}
