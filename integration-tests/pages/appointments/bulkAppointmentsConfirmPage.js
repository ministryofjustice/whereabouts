const page = require('../page')

const bulkAppointmentsConfirmPage = () =>
  page('Confirm appointments', {
    form: () => ({
      submitButton: () => cy.get('button[type="submit"]'),
    }),
    appointmentType: () => cy.get('[data-qa="appointment-details-summary-appointment-type"]'),
    appointmentLocation: () => cy.get('[data-qa="appointment-details-summary-appointment-location"]'),
    appointmentStartDate: () => cy.get('[data-qa="appointment-details-summary-appointment-start-date"]'),
    appointmentStartTime: () => cy.get('[data-qa="appointment-details-summary-appointment-start-time"]'),
    appointmentsHowOften: () => cy.get('[data-qa="appointment-details-summary-appointment-how-often"]'),
    appointmentsOccurrences: () => cy.get('[data-qa="appointment-details-summary-appointment-occurrences"]'),
    appointmentsEndDate: () => cy.get('[data-qa="appointment-details-summary-appointment-end-date"]'),
    prisonersFound: () => cy.get('[data-qa="prisoners-found"]'),
  })

export default {
  verifyOnPage: bulkAppointmentsConfirmPage,
  goTo: () => {
    cy.visit('/bulk-appointments/confirm-appointments')
    return bulkAppointmentsConfirmPage()
  },
}
