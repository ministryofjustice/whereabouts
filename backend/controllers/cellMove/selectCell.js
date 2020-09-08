const moment = require('moment')
const { serviceUnavailableMessage } = require('../../common-messages')
const { alertFlagLabels, cellMoveAlertCodes } = require('../../shared/alertFlagValues')
const { putLastNameFirst, hasLength, groupBy, pascalToString, properCaseName } = require('../../utils')
const { showNonAssociationsLink, showCsraLink } = require('./cellMoveUtils')
const {
  app: { notmEndpointUrl: dpsUrl },
} = require('../../config')

const defaultSubLocationsValue = { text: 'Select area in residential unit', value: '' }
const noAreasSelectedDropDownValue = { text: 'No areas to select', value: '' }
const toDropDownValue = entry => ({ text: entry.name, value: entry.key })

const extractQueryParameters = query => {
  const { location, subLocation, attribute, locationId } = query

  return {
    location: location || 'ALL',
    attribute,
    subLocation,
    locationId,
  }
}
const sortByDescription = (a, b) => a.description.localeCompare(b.description)

const sortByLatestAssessmentDateDesc = (left, right) => {
  const leftDate = moment(left.assessmentDate, 'DD/MM/YYYY')
  const rightDate = moment(right.assessmentDate, 'DD/MM/YYYY')

  if (leftDate.isBefore(rightDate)) return 1
  if (leftDate.isAfter(rightDate)) return -1

  return 0
}

const getCellOccupants = async (res, { elite2Api, activeCaseLoadId, cells, alertsToShow }) => {
  const currentCellOccupants = (await Promise.all(
    cells.map(cell => cell.id).map(cellId => elite2Api.getInmatesAtLocation(res.locals, cellId, {}))
  )).flatMap(occupant => occupant)

  const occupantOffenderNos = Array.from(new Set(currentCellOccupants.map(occupant => occupant.offenderNo)))

  const occupantAlerts = await elite2Api.getAlerts(res.locals, {
    agencyId: activeCaseLoadId,
    offenderNumbers: occupantOffenderNos,
  })

  const occupantAssessments = await elite2Api.getCsraAssessments(res.locals, occupantOffenderNos)
  const assessmentsGroupedByOffenderNo = occupantAssessments ? groupBy(occupantAssessments, 'offenderNo') : []

  const cellSharingAssessments = Object.keys(assessmentsGroupedByOffenderNo)
    .map(
      offenderNumber =>
        assessmentsGroupedByOffenderNo[offenderNumber]
          .filter(assessment => assessment.assessmentCode.includes('CSR') && assessment.assessmentComment)
          .sort(sortByLatestAssessmentDateDesc)[0]
    )
    .filter(Boolean)

  return cells.flatMap(cell => {
    const occupants = currentCellOccupants.filter(o => o.assignedLivingUnitId === cell.id)
    return occupants.map(occupant => {
      const csraInfo = cellSharingAssessments.find(rating => rating.offenderNo === occupant.offenderNo)

      return {
        cellId: cell.id,
        name: `${properCaseName(occupant.lastName)}, ${properCaseName(occupant.firstName)}`,
        alerts:
          alertsToShow &&
          alertsToShow.filter(als =>
            als.alertCodes.filter(code =>
              occupantAlerts
                .filter(alert => alert.offenderNo === occupant.offenderNo && !alert.expired)
                .map(alert => alert.code)
                .includes(code)
            )
          ),
        showCsraLink: showCsraLink(
          occupantAssessments.filter(assessment => assessment.offenderNo === occupant.offenderNo)
        ),
        csra: csraInfo && csraInfo.classification,
        csraDetailsUrl: `/prisoner/${occupant.offenderNo}/cell-move/cell-sharing-risk-assessment-details`,
      }
    })
  })
}

module.exports = ({ elite2Api, whereaboutsApi, logError }) => async (req, res) => {
  const { offenderNo } = req.params
  const { location, subLocation, attribute, locationId } = extractQueryParameters(req.query)
  const { activeCaseLoadId } = req.session.userDetails

  try {
    const prisonerDetails = await elite2Api.getDetails(res.locals, offenderNo, true)
    const nonAssociations = await elite2Api.getNonAssociations(res.locals, prisonerDetails.bookingId)
    const cellAttributesData = await elite2Api.getCellAttributes(res.locals)
    const locationsData = await whereaboutsApi.searchGroups(res.locals, prisonerDetails.agencyId)

    if (req.xhr) {
      return res.render('cellMove/partials/subLocationsSelect.njk', {
        subLocations:
          locationId === 'ALL'
            ? [noAreasSelectedDropDownValue]
            : [
                defaultSubLocationsValue,
                ...locationsData
                  .find(loc => loc.key.toLowerCase() === locationId.toLowerCase())
                  .children.map(toDropDownValue),
              ],
      })
    }

    const locations = [
      { text: 'All locations', value: 'ALL' },
      ...locationsData.map(loc => ({ text: loc.name, value: loc.key })),
    ]

    const cellAttributes = cellAttributesData
      .filter(cellAttribute => 'Y'.includes(cellAttribute.activeFlag))
      .map(cellAttribute => ({ text: cellAttribute.description, value: cellAttribute.code }))

    const subLocations =
      location === 'ALL'
        ? [noAreasSelectedDropDownValue]
        : [
            defaultSubLocationsValue,
            ...(
              locationsData.find(loc => loc.key.toLowerCase() === location.toLowerCase()) || { children: [] }
            ).children.map(toDropDownValue),
          ]

    const prisonersActiveAlertCodes = prisonerDetails.alerts
      .filter(alert => !alert.expired)
      .map(alert => alert.alertCode)

    const alertsToShow = alertFlagLabels.filter(alertFlag =>
      alertFlag.alertCodes.some(
        alert => prisonersActiveAlertCodes.includes(alert) && cellMoveAlertCodes.includes(alert)
      )
    )

    // If the location is 'ALL' we do not need to call the whereabouts API,
    // we can directly call prisonApi.
    const cells =
      location === 'ALL'
        ? await elite2Api.getCellsWithCapacity(res.locals, prisonerDetails.agencyId, attribute)
        : await whereaboutsApi.getCellsWithCapacity(res.locals, {
            agencyId: prisonerDetails.agencyId,
            groupName: subLocation ? `${location}_${subLocation}` : location,
            attribute,
          })

    const cellOccupants = await getCellOccupants(res, { activeCaseLoadId, elite2Api, cells })

    return res.render('cellMove/selectCell.njk', {
      formValues: {
        location,
        subLocation,
        attribute,
      },
      breadcrumbPrisonerName: putLastNameFirst(prisonerDetails.firstName, prisonerDetails.lastName),
      showNonAssociationsLink:
        nonAssociations && showNonAssociationsLink(nonAssociations, prisonerDetails.assignedLivingUnit),
      showCsraLink: prisonerDetails.assessments && showCsraLink(prisonerDetails.assessments),
      alerts: alertsToShow,
      cells:
        hasLength(cells) &&
        cells
          .map(cell => ({
            ...cell,
            occupants: cellOccupants.filter(occupant => occupant.cellId === cell.id).filter(entry => Boolean(entry)),
            spaces: cell.capacity - cell.noOfOccupants,
            type: hasLength(cell.attributes) && cell.attributes.sort(sortByDescription),
          }))
          .sort(sortByDescription),
      locations,
      subLocations,
      cellAttributes,
      prisonerDetails,
      offenderNo,
      dpsUrl,
      nonAssociationLink: `/prisoner/${offenderNo}/cell-move/non-associations`,
      offenderDetailsUrl: `/prisoner/${offenderNo}/cell-move/offender-details`,
      csraDetailsUrl: `/prisoner/${offenderNo}/cell-move/cell-sharing-risk-assessment-details`,
      selectLocationRootUrl: `/prisoner/${offenderNo}/cell-move/select-location`,
      selectCellRootUrl: `/prisoner/${offenderNo}/cell-move/select-cell`,
      formAction: `/prisoner/${offenderNo}/cell-move/select-cell`,
    })
  } catch (error) {
    if (error) logError(req.originalUrl, error, serviceUnavailableMessage)

    return res.render('error.njk', {
      url: `/prisoner/${offenderNo}/cell-move/select-location`,
      homeUrl: `/prisoner/${offenderNo}`,
    })
  }
}
