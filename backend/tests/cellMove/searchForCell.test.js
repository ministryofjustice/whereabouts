Reflect.deleteProperty(process.env, 'APPINSIGHTS_INSTRUMENTATIONKEY')
const moment = require('moment')

const searchForCell = require('../../controllers/cellMove/searchForCell')
const { serviceUnavailableMessage } = require('../../common-messages')

describe('select location', () => {
  let req
  let res
  let logError
  let controller

  const prisonApi = {}

  const whereaboutsApi = {}
  const oauthApi = {}

  const offenderNo = 'ABC123'

  const getDetailsResponse = {
    bookingId: 1234,
    firstName: 'Test',
    lastName: 'User',
    csra: 'High',
    agencyId: 'MDI',
    assessments: [],
    assignedLivingUnit: {},
    alerts: [
      {
        active: true,
        addedByFirstName: 'John',
        addedByLastName: 'Smith',
        alertCode: 'XC',
        alertCodeDescription: 'Risk to females',
        alertId: 1,
        alertType: 'X',
        alertTypeDescription: 'Security',
        bookingId: 14,
        comment: 'has a large poster on cell wall',
        dateCreated: '2019-08-20',
        dateExpires: null,
        expired: false,
        expiredByFirstName: 'John',
        expiredByLastName: 'Smith',
        offenderNo,
      },
      {
        active: true,
        addedByFirstName: 'John',
        addedByLastName: 'Smith',
        alertCode: 'XGANG',
        alertCodeDescription: 'Gang member',
        alertId: 1,
        alertType: 'X',
        alertTypeDescription: 'Security',
        bookingId: 14,
        comment: 'has a large poster on cell wall',
        dateCreated: '2019-08-20',
        dateExpires: null,
        expired: false,
        expiredByFirstName: 'John',
        expiredByLastName: 'Smith',
        offenderNo,
      },
      {
        alertId: 3,
        alertType: 'V',
        alertTypeDescription: 'Vulnerability',
        alertCode: 'VIP',
        alertCodeDescription: 'Isolated Prisoner',
        comment: 'test',
        dateCreated: '2020-08-20',
        expired: false,
        active: true,
        addedByFirstName: 'John',
        addedByLastName: 'Smith',
      },
    ],
  }

  beforeEach(() => {
    logError = jest.fn()

    req = {
      originalUrl: 'http://localhost',
      params: { offenderNo },
      query: {},
      protocol: 'http',
      get: jest.fn().mockReturnValue('localhost'),
    }
    res = { locals: {}, render: jest.fn() }

    prisonApi.getDetails = jest.fn().mockResolvedValue(getDetailsResponse)
    prisonApi.getNonAssociations = jest.fn().mockResolvedValue({ nonAssociations: [] })
    prisonApi.getCellAttributes = jest.fn().mockResolvedValue([
      {
        domain: 'HOU_UNIT_ATT',
        code: 'A',
        description: 'Cat A Cell',
        activeFlag: 'Y',
        listSeq: 99,
        systemDataFlag: 'N',
        subCodes: [],
      },
      {
        domain: 'HOU_UNIT_ATT',
        code: 'DO',
        description: 'Double Occupancy',
        activeFlag: 'Y',
        listSeq: 99,
        systemDataFlag: 'N',
        subCodes: [],
      },
      {
        domain: 'HOU_UNIT_ATT',
        code: 'ELC',
        description: 'E List Cell',
        activeFlag: 'Y',
        listSeq: 99,
        systemDataFlag: 'N',
        subCodes: [],
      },
      {
        domain: 'HOU_UNIT_ATT',
        code: 'GC',
        description: 'Gated Cell',
        activeFlag: 'Y',
        listSeq: 99,
        systemDataFlag: 'N',
        subCodes: [],
      },
      {
        domain: 'HOU_UNIT_ATT',
        code: 'LC',
        description: 'Listener Cell',
        activeFlag: 'Y',
        listSeq: 99,
        systemDataFlag: 'N',
        subCodes: [],
      },
      {
        domain: 'HOU_UNIT_ATT',
        code: 'LF',
        description: 'Locate Flat',
        activeFlag: 'Y',
        listSeq: 99,
        systemDataFlag: 'N',
        subCodes: [],
      },
      {
        domain: 'HOU_UNIT_ATT',
        code: 'MO',
        description: 'Multiple Occupancy',
        activeFlag: 'Y',
        listSeq: 99,
        systemDataFlag: 'N',
        subCodes: [],
      },
      {
        domain: 'HOU_UNIT_ATT',
        code: 'NSMC',
        description: 'Non Smoker Cell',
        activeFlag: 'Y',
        listSeq: 99,
        systemDataFlag: 'N',
        subCodes: [],
      },
      {
        domain: 'HOU_UNIT_ATT',
        code: 'OC',
        description: 'Observation Cell',
        activeFlag: 'Y',
        listSeq: 99,
        systemDataFlag: 'N',
        subCodes: [],
      },
      {
        domain: 'HOU_UNIT_ATT',
        code: 'SC',
        description: 'Safe Cell',
        activeFlag: 'Y',
        listSeq: 99,
        systemDataFlag: 'N',
        subCodes: [],
      },
      {
        domain: 'HOU_UNIT_ATT',
        code: 'SO',
        description: 'Single Occupancy',
        activeFlag: 'Y',
        listSeq: 99,
        systemDataFlag: 'N',
        subCodes: [],
      },
      {
        domain: 'HOU_UNIT_ATT',
        code: 'SPC',
        description: 'Special Cell',
        activeFlag: 'Y',
        listSeq: 99,
        systemDataFlag: 'N',
        subCodes: [],
      },
      {
        domain: 'HOU_UNIT_ATT',
        code: 'WA',
        description: 'Wheelchair Access',
        activeFlag: 'Y',
        listSeq: 99,
        systemDataFlag: 'N',
        subCodes: [],
      },
    ])

    whereaboutsApi.searchGroups = jest.fn().mockResolvedValue([
      { name: 'Casu', key: 'Casu', children: [] },
      {
        name: 'Houseblock 1',
        key: 'Houseblock 1',
        children: [],
      },
      {
        name: 'Houseblock 2',
        key: 'Houseblock 2',
      },
      {
        name: 'Houseblock 3',
        key: 'Houseblock 3',
        children: [],
      },
    ])

    oauthApi.userRoles = jest.fn().mockResolvedValue([{ roleCode: 'CELL_MOVE' }])
    prisonApi.userCaseLoads = jest.fn().mockResolvedValue([{ caseLoadId: 'MDI' }])

    controller = searchForCell({ oauthApi, prisonApi, whereaboutsApi, logError })
  })

  it('Makes the expected API calls', async () => {
    await controller(req, res)

    expect(prisonApi.getDetails).toHaveBeenCalledWith(res.locals, offenderNo, true)
    expect(prisonApi.getNonAssociations).toHaveBeenCalledWith(res.locals, 1234)
    expect(prisonApi.getCellAttributes).toHaveBeenCalledWith(res.locals)
    expect(whereaboutsApi.searchGroups).toHaveBeenCalledWith(res.locals, 'MDI')
  })

  it('Redirects when offender not in user caseloads', async () => {
    prisonApi.userCaseLoads = jest.fn().mockResolvedValue([{ caseLoadId: 'BWY' }])
    await controller(req, res)

    expect(res.render).toHaveBeenCalledWith('notFound.njk', { url: '/prisoner-search' })
  })

  it('Should render error template when there is an API error', async () => {
    prisonApi.getDetails.mockImplementation(() => Promise.reject(new Error('Network error')))

    await controller(req, res)

    expect(logError).toHaveBeenCalledWith(req.originalUrl, new Error('Network error'), serviceUnavailableMessage)
    expect(res.render).toHaveBeenCalledWith('error.njk', {
      url: '/prisoner/ABC123/cell-move/search-for-cell',
      homeUrl: '/prisoner/ABC123',
    })
  })

  describe('Header data', () => {
    it('populates the data correctly when no non-associations and no assessments', async () => {
      await controller(req, res)

      expect(res.render).toHaveBeenCalledWith(
        'cellMove/searchForCell.njk',
        expect.objectContaining({
          prisonerDetails: getDetailsResponse,
          breadcrumbPrisonerName: 'User, Test',
          prisonerName: 'Test User',
          numberOfNonAssociations: 0,
          showNonAssociationsLink: false,
          showCsraLink: false,
          alerts: [
            { alertCodes: ['XGANG'], classes: 'alert-status alert-status--gang-member', label: 'Gang member' },
            { alertCodes: ['VIP'], classes: 'alert-status alert-status--isolated-prisoner', label: 'Isolated' },
          ],
          offenderNo,
        })
      )
    })

    it('populates the data correctly when some non-associations, but not in the same establishment', async () => {
      prisonApi.getNonAssociations = jest.fn().mockResolvedValue({
        agencyDescription: 'MOORLAND',
        nonAssociations: [
          {
            offenderNonAssociation: {
              agencyDescription: 'LEEDS',
            },
          },
        ],
      })
      await controller(req, res)

      expect(res.render).toHaveBeenCalledWith(
        'cellMove/searchForCell.njk',
        expect.objectContaining({
          numberOfNonAssociations: 0,
          showNonAssociationsLink: false,
        })
      )
    })

    it('populates the data correctly when some non-associations, but not effective yet', async () => {
      prisonApi.getNonAssociations = jest.fn().mockResolvedValue({
        agencyDescription: 'MOORLAND',
        nonAssociations: [
          {
            effectiveDate: moment().add(1, 'days'),
            offenderNonAssociation: {
              agencyDescription: 'MOORLAND',
            },
          },
        ],
      })
      await controller(req, res)

      expect(res.render).toHaveBeenCalledWith(
        'cellMove/searchForCell.njk',
        expect.objectContaining({
          numberOfNonAssociations: 0,
          showNonAssociationsLink: false,
        })
      )
    })

    it('populates the data correctly when some non-associations, but expired', async () => {
      prisonApi.getNonAssociations = jest.fn().mockResolvedValue({
        agencyDescription: 'MOORLAND',
        nonAssociations: [
          {
            effectiveDate: moment().subtract(10, 'days'),
            expiryDate: moment().subtract(1, 'days'),
            offenderNonAssociation: {
              agencyDescription: 'MOORLAND',
            },
          },
        ],
      })
      await controller(req, res)

      expect(res.render).toHaveBeenCalledWith(
        'cellMove/searchForCell.njk',
        expect.objectContaining({
          numberOfNonAssociations: 0,
          showNonAssociationsLink: false,
        })
      )
    })

    it('populates the data correctly when some non-associations in the same establishment', async () => {
      prisonApi.getNonAssociations = jest.fn().mockResolvedValue({
        agencyDescription: 'MOORLAND',
        nonAssociations: [
          {
            effectiveDate: moment(),
            offenderNonAssociation: {
              agencyDescription: 'MOORLAND',
            },
          },
        ],
      })
      await controller(req, res)

      expect(res.render).toHaveBeenCalledWith(
        'cellMove/searchForCell.njk',
        expect.objectContaining({
          numberOfNonAssociations: 1,
          showNonAssociationsLink: true,
        })
      )
    })

    it('populates the data correctly when CSR Rating assessment does not have a comment', async () => {
      prisonApi.getDetails = jest.fn().mockResolvedValue({
        ...getDetailsResponse,
        assessments: [
          {
            assessmentCode: 'CSR',
          },
        ],
      })
      await controller(req, res)

      expect(res.render).toHaveBeenCalledWith(
        'cellMove/searchForCell.njk',
        expect.objectContaining({
          showCsraLink: false,
        })
      )
    })

    it('populates the data correctly when CSR Rating assessment has a comment', async () => {
      prisonApi.getDetails = jest.fn().mockResolvedValue({
        ...getDetailsResponse,
        assessments: [
          {
            assessmentCode: 'CSR',
            assessmentComment: 'Test comment',
          },
        ],
      })
      await controller(req, res)

      expect(res.render).toHaveBeenCalledWith(
        'cellMove/searchForCell.njk',
        expect.objectContaining({
          showCsraLink: true,
        })
      )
    })

    it('populates the dropdowns correctly', async () => {
      await controller(req, res)

      expect(res.render).toHaveBeenCalledWith(
        'cellMove/searchForCell.njk',
        expect.objectContaining({
          locations: [
            { text: 'Casu', value: 'Casu' },
            { text: 'Houseblock 1', value: 'Houseblock 1' },
            { text: 'Houseblock 2', value: 'Houseblock 2' },
            { text: 'Houseblock 3', value: 'Houseblock 3' },
          ],
          cellAttributes: [
            { text: 'Cat A Cell', value: 'A' },
            { text: 'Double Occupancy', value: 'DO' },
            { text: 'E List Cell', value: 'ELC' },
            { text: 'Gated Cell', value: 'GC' },
            { text: 'Listener Cell', value: 'LC' },
            { text: 'Locate Flat', value: 'LF' },
            { text: 'Multiple Occupancy', value: 'MO' },
            { text: 'Non Smoker Cell', value: 'NSMC' },
            { text: 'Observation Cell', value: 'OC' },
            { text: 'Safe Cell', value: 'SC' },
            { text: 'Single Occupancy', value: 'SO' },
            { text: 'Special Cell', value: 'SPC' },
            { text: 'Wheelchair Access', value: 'WA' },
          ],
        })
      )
    })
  })
})