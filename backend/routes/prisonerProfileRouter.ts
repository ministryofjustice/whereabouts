import express from 'express'
import nunjucks from 'nunjucks'
import EsweService from '../services/esweService'
import telemetry from '../azure-appinsights'
import prisonerQuickLook from '../controllers/prisonerProfile/prisonerQuickLook'
import prisonerFullImage from '../controllers/prisonerProfile/prisonerFullImage'
import prisonerPersonal from '../controllers/prisonerProfile/prisonerPersonal'
import prisonerAlerts from '../controllers/prisonerProfile/prisonerAlerts'
import prisonerCaseNotes from '../controllers/prisonerProfile/prisonerCaseNotes'
import prisonerSentenceAndRelease from '../controllers/prisonerProfile/prisonerSentenceAndRelease'
import prisonerVisits from '../controllers/prisonerProfile/prisonerVisits'
import prisonerSchedule from '../controllers/prisonerProfile/prisonerSchedule'
import prisonerProfessionalContacts from '../controllers/prisonerProfile/prisonerProfessionalContacts'
import prisonerCellHistory from '../controllers/prisonerProfile/prisonerCellHistory'
import prisonerLocationHistory from '../controllers/prisonerProfile/prisonerLocationHistory'
import prisonerAdjudicationDetails from '../controllers/prisonerProfile/prisonerAdjudicationDetails'
import adjudicationsController from '../controllers/prisonerProfile/adjudicationHistory'
import prisonerIncentiveLevelDetails from '../controllers/prisonerProfile/prisonerIncentiveLevelDetails'
import prisonerChangeIncentiveLevelDetails from '../controllers/prisonerProfile/prisonerChangeIncentiveLevelDetails'
import prisonerCsraHistory from '../controllers/prisonerProfile/prisonerCsraHistory'
import prisonerCsraReview from '../controllers/prisonerProfile/prisonerCsraReview'
import prisonerWorkAndSkills from '../controllers/prisonerProfile/prisonerWorkAndSkills'
import prisonerDamageObligations from '../controllers/prisonerProfile/prisonerFinances/prisonerDamageObligations'
import prisonerPrivateCash from '../controllers/prisonerProfile/prisonerFinances/prisonerPrivateCash'
import prisonerSpends from '../controllers/prisonerProfile/prisonerFinances/prisonerSpends'
import prisonerSavings from '../controllers/prisonerProfile/prisonerFinances/prisonerSavings'
import prisonerProfileServiceFactory from '../services/prisonerProfileService'
import prisonerFinanceServiceFactory from '../services/prisonerFinanceService'
import personServiceFactory from '../services/personService'
import paginationService from '../services/paginationService'
import referenceCodesServiceFactory from '../controllers/reference-codes-service'
import adjudicationsHistoryService from '../services/adjudicationHistory'

const router = express.Router({ mergeParams: true })

const controller = ({
  prisonApi,
  keyworkerApi,
  oauthApi,
  caseNotesApi,
  allocationManagerApi,
  systemOauthClient,
  dataComplianceApi,
  pathfinderApi,
  logError,
  socApi,
  whereaboutsApi,
  complexityApi,
  offenderSearchApi,
  curiousApi,
}) => {
  const prisonerProfileService = prisonerProfileServiceFactory({
    prisonApi,
    keyworkerApi,
    oauthApi,
    dataComplianceApi,
    pathfinderApi,
    systemOauthClient,
    socApi,
    allocationManagerApi,
    complexityApi,
  })
  const personService = personServiceFactory(prisonApi)
  const prisonerFinanceService = prisonerFinanceServiceFactory(prisonApi)
  const referenceCodesService = referenceCodesServiceFactory(prisonApi)
  const adjudicationHistoryService = adjudicationsHistoryService(prisonApi)
  const esweService = EsweService.create(curiousApi, systemOauthClient)

  router.get(
    '/',
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ prisonerProfileService: { getP... Remove this comment to see the full error message
    prisonerQuickLook({ prisonerProfileService, prisonApi, telemetry, offenderSearchApi, systemOauthClient, logError })
  )
  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ prisonApi: any; logError: any;... Remove this comment to see the full error message
  router.get('/image', prisonerFullImage({ prisonApi, logError }))
  router.get(
    '/personal',
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ prisonerProfileService: { getP... Remove this comment to see the full error message
    prisonerPersonal({ prisonerProfileService, personService, prisonApi, allocationManagerApi, logError, esweService })
  )
  router.get(
    '/alerts',
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ prisonerProfileService: { getP... Remove this comment to see the full error message
    prisonerAlerts({ prisonerProfileService, referenceCodesService, paginationService, prisonApi, oauthApi, logError })
  )
  router.get(
    '/case-notes',
    prisonerCaseNotes({
      caseNotesApi,
      prisonerProfileService,
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ caseNotesApi: any; prisonerPro... Remove this comment to see the full error message
      prisonApi,
      paginationService,
      nunjucks,
      logError,
      oauthApi,
    })
  )
  router.get(
    '/sentence-and-release',
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ prisonerProfileService: { getP... Remove this comment to see the full error message
    prisonerSentenceAndRelease({ prisonerProfileService, prisonApi, systemOauthClient, offenderSearchApi, logError })
  )
  router.get('/work-and-skills', prisonerWorkAndSkills({ prisonerProfileService, esweService }))
  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ prisonApi: any; logError: any;... Remove this comment to see the full error message
  router.get('/visits', prisonerVisits({ prisonApi, logError }))
  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ prisonApi: any; logError: any;... Remove this comment to see the full error message
  router.get('/schedule', prisonerSchedule({ prisonApi, logError }))
  router.get(
    '/professional-contacts',
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ prisonApi: any; personService:... Remove this comment to see the full error message
    prisonerProfessionalContacts({ prisonApi, personService, allocationManagerApi, logError })
  )

  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ oauthApi: any; prisonApi: any;... Remove this comment to see the full error message
  router.get('/cell-history', prisonerCellHistory({ oauthApi, prisonApi, logError }))
  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ prisonApi: any; whereaboutsApi... Remove this comment to see the full error message
  router.get('/location-history', prisonerLocationHistory({ prisonApi, whereaboutsApi, caseNotesApi, logError }))

  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ prisonApi: any; logError: any;... Remove this comment to see the full error message
  router.get('/adjudications/:adjudicationNumber', prisonerAdjudicationDetails({ prisonApi, logError }))

  router.use(
    '/adjudications',
    adjudicationsController({
      adjudicationHistoryService,
      paginationService,
      prisonApi,
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ adjudicationHistoryService: { ... Remove this comment to see the full error message
      logError,
    })
  )

  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ prisonApi: any; oauthApi: any;... Remove this comment to see the full error message
  router.get('/incentive-level-details', prisonerIncentiveLevelDetails({ prisonApi, oauthApi, logError }))
  router.get(
    '/incentive-level-details/change-incentive-level',
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ prisonApi: any; logError: any;... Remove this comment to see the full error message
    prisonerChangeIncentiveLevelDetails({ prisonApi, logError }).index
  )
  router.post(
    '/incentive-level-details/change-incentive-level',
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ prisonApi: any; logError: any;... Remove this comment to see the full error message
    prisonerChangeIncentiveLevelDetails({ prisonApi, logError }).post
  )

  router.get('/prisoner-finance-details/damage-obligations', prisonerDamageObligations({ prisonApi }))
  router.get('/prisoner-finance-details/private-cash', prisonerPrivateCash({ prisonApi, prisonerFinanceService }))
  router.get('/prisoner-finance-details/spends', prisonerSpends({ prisonApi, prisonerFinanceService }))
  router.get('/prisoner-finance-details/savings', prisonerSavings({ prisonApi, prisonerFinanceService }))

  router.get('/csra-history', prisonerCsraHistory({ prisonApi }))
  router.get('/csra-review', prisonerCsraReview({ prisonApi }))

  return router
}

export default (dependencies) => controller(dependencies)
