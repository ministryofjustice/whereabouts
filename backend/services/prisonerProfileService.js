const moment = require('moment')
const { putLastNameFirst, hasLength, formatName } = require('../utils')
const alertFlagValues = require('../shared/alertFlagValues')
const {
  apis: {
    categorisation: { ui_url: categorisationUrl },
    pathfinder: { ui_url: pathfinderUrl },
    soc: { url: socUrl, enabled: socEnabled },
    useOfForce: { prisons: useOfForcePrisons, ui_url: useOfForceUrl },
  },
  app: { notmEndpointUrl, displayRetentionLink },
} = require('../config')
const logErrorAndContinue = require('../shared/logErrorAndContinue')

module.exports = ({
  elite2Api,
  keyworkerApi,
  oauthApi,
  dataComplianceApi,
  pathfinderApi,
  socApi,
  systemOauthClient,
}) => {
  const getPrisonerProfileData = async (context, offenderNo, username) => {
    const [currentUser, prisonerDetails] = await Promise.all([
      oauthApi.currentUser(context),
      elite2Api.getDetails(context, offenderNo, true),
    ])

    const offenderRetentionRecord =
      displayRetentionLink && (await dataComplianceApi.getOffenderRetentionRecord(context, offenderNo))

    const systemContext = await systemOauthClient.getClientCredentialsTokens(username)

    const {
      activeAlertCount,
      agencyId,
      alerts,
      assignedLivingUnit,
      bookingId,
      category,
      categoryCode,
      csra,
      inactiveAlertCount,
      interpreterRequired,
      writtenLanguage,
      language,
    } = prisonerDetails

    const [
      iepDetails,
      keyworkerSessions,
      userCaseloads,
      staffRoles,
      keyworkerDetails,
      userRoles,
      pathfinderDetails,
      socDetails,
    ] = await Promise.all(
      [
        elite2Api.getIepSummary(context, [bookingId]),
        elite2Api.getCaseNoteSummaryByTypes(context, { type: 'KA', subType: 'KS', numMonths: 1, bookingId }),
        elite2Api.userCaseLoads(context),
        elite2Api.getStaffRoles(context, currentUser.staffId, currentUser.activeCaseLoadId),
        keyworkerApi.getKeyworkerByCaseloadAndOffenderNo(context, agencyId, offenderNo),
        oauthApi.userRoles(context),
        pathfinderApi.getPathfinderDetails(systemContext, offenderNo),
        socApi.getSocDetails(systemContext, offenderNo, socEnabled),
      ].map(apiCall => logErrorAndContinue(apiCall))
    )

    const prisonersActiveAlertCodes = alerts.filter(alert => !alert.expired).map(alert => alert.alertCode)
    const alertsToShow = alertFlagValues.filter(alertFlag =>
      alertFlag.alertCodes.some(alert => prisonersActiveAlertCodes.includes(alert))
    )

    const canViewInactivePrisoner = userRoles && userRoles.some(role => role.roleCode === 'INACTIVE_BOOKINGS')
    const offenderInCaseload = userCaseloads && userCaseloads.some(caseload => caseload.caseLoadId === agencyId)

    const isCatToolUser = Boolean(
      userRoles &&
        userRoles.some(role =>
          [
            'CREATE_CATEGORISATION',
            'CREATE_RECATEGORISATION',
            'APPROVE_CATEGORISATION',
            'CATEGORISATION_SECURITY',
          ].includes(role.roleCode)
        )
    )

    const canViewProbationDocuments = Boolean(
      userRoles && userRoles.some(role => ['VIEW_PROBATION_DOCUMENTS', 'POM'].includes(role.roleCode))
    )

    const isPathfinderUser = Boolean(
      userRoles &&
        userRoles.some(role =>
          ['PF_STD_PRISON', 'PF_STD_PROBATION', 'PF_APPROVAL', 'PF_STD_PRISON_RO', 'PF_STD_PROBATION_RO'].includes(
            role.roleCode
          )
        )
    )

    const canViewPathfinderLink = Boolean(isPathfinderUser && pathfinderDetails)
    const useOfForceEnabledPrisons = useOfForcePrisons.split(',').map(prison => prison.trim().toUpperCase())

    const isSocUser = Boolean(
      userRoles &&
        userRoles.some(role =>
          ['SOC_CUSTODY', 'SOC_COMMUNITY', 'SOC_EXTERNAL_RO', 'SOC_EXTERNAL'].includes(role.roleCode)
        )
    )

    const canViewSocLink = Boolean(isSocUser && socDetails)

    return {
      activeAlertCount,
      agencyName: assignedLivingUnit.agencyName,
      alerts: alertsToShow,
      canViewProbationDocuments,
      canViewPathfinderLink,
      pathfinderProfileUrl:
        pathfinderUrl && pathfinderDetails && `${pathfinderUrl}nominal/${String(pathfinderDetails.id)}`,
      showPathfinderReferButton: Boolean(!pathfinderDetails && isPathfinderUser),
      pathfinderReferUrl: pathfinderUrl && `${pathfinderUrl}refer/offender/${offenderNo}`,
      canViewSocLink: socEnabled && canViewSocLink,
      socProfileUrl: socEnabled && socUrl && socDetails && `${socUrl}/nominal/${String(socDetails.id)}`,
      showSocReferButton: Boolean(socEnabled && !socDetails && isSocUser),
      socReferUrl: socEnabled && socUrl && `${socUrl}/refer/offender/${offenderNo}`,
      categorisationLink: `${categorisationUrl}${bookingId}`,
      categorisationLinkText: (isCatToolUser && 'Manage category') || (offenderInCaseload && 'View category') || '',
      category,
      categoryCode,
      csra,
      displayRetentionLink,
      incentiveLevel: iepDetails && iepDetails[0] && iepDetails[0].iepLevel,
      keyWorkerLastSession:
        keyworkerSessions && keyworkerSessions[0] && moment(keyworkerSessions[0].latestCaseNote).format('D MMMM YYYY'),
      keyWorkerName: keyworkerDetails && formatName(keyworkerDetails.firstName, keyworkerDetails.lastName),
      inactiveAlertCount,
      location: assignedLivingUnit.description,
      notmEndpointUrl,
      offenderName: putLastNameFirst(prisonerDetails.firstName, prisonerDetails.lastName),
      offenderNo,
      offenderRecordRetained: offenderRetentionRecord && hasLength(offenderRetentionRecord.retentionReasons),
      showAddKeyworkerSession: staffRoles && staffRoles.some(role => role.role === 'KW'),
      showReportUseOfForce: useOfForceEnabledPrisons.includes(currentUser.activeCaseLoadId),
      useOfForceUrl: `${useOfForceUrl}/report/${bookingId}/report-use-of-force`,
      userCanEdit: (canViewInactivePrisoner && ['OUT', 'TRN'].includes(agencyId)) || offenderInCaseload,
      language,
      interpreterRequired,
      writtenLanguage,
      staffId: currentUser.staffId,
      staffName: currentUser.name,
    }
  }

  return {
    getPrisonerProfileData,
  }
}
