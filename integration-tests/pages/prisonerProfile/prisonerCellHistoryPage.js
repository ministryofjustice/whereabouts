const page = require('../page')

const prisonerCellHistoryPage = () =>
  page('location details', {
    establishment: () => cy.get("[data-test='establishment']"),
    location: () => cy.get("[data-test='location']"),
    occupants: () => cy.get("[data-test='occupants']"),
    cellDetailsLink: () => cy.get("[data-test='cell-details-link']"),
    cellMoveButton: () => cy.get("[data-test='cell-move-button']"),
    results: () => cy.get('[data-test="prisoner-cell-history"]'),
    agencyHeading: () => cy.get('[data-test="agency-heading"]'),
    currentLocationMovedInDate: () => cy.get("[data-test='current-location-moved-in-date']"),
    currentLocationMovedInBy: () => cy.get("[data-test='current-location-moved-in-by']"),
  })

export default {
  verifyOnPage: prisonerCellHistoryPage,
  goTo: offenderNo => {
    cy.visit(`/prisoner/${offenderNo}/cell-history`)
    return prisonerCellHistoryPage()
  },
}
