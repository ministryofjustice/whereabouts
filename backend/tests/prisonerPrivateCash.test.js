const prisonerPrivateCash = require('../controllers/prisonerProfile/prisonerFinances/prisonerPrivateCash')

describe('Prisoner private cash', () => {
  const offenderNo = 'ABC123'
  const prisonApi = {}
  const prisonerFinanceService = {}

  let req
  let res
  let controller

  const prisonerFinanceData = {
    allTransactionsForDateRange: [],
    templateData: {
      currentBalance: '£95.00',
      formValues: {
        selectedMonth: 10,
        selectedYear: 2020,
      },
      monthOptions: [
        { text: 'January', value: 0 },
        { text: 'February', value: 1 },
        { text: 'March', value: 2 },
        { text: 'April', value: 3 },
        { text: 'May', value: 4 },
        { text: 'June', value: 5 },
        { text: 'July', value: 6 },
        { text: 'August', value: 7 },
        { text: 'September', value: 8 },
        { text: 'October', value: 9 },
        { text: 'November', value: 10 },
        { text: 'December', value: 11 },
      ],
      prisoner: {
        name: 'John Smith',
        nameForBreadcrumb: 'Smith, John',
        offenderNo: 'ABC123',
      },
      showDamageObligationsLink: false,
      yearOptions: [
        { text: 2017, value: 2017 },
        { text: 2018, value: 2018 },
        { text: 2019, value: 2019 },
        { text: 2020, value: 2020 },
      ],
    },
  }

  beforeEach(() => {
    req = {
      originalUrl: 'http://localhost',
      params: { offenderNo },
      query: {},
    }
    res = { locals: {}, render: jest.fn() }

    prisonerFinanceService.getPrisonerFinanceData = jest.fn().mockResolvedValue(prisonerFinanceData)

    prisonApi.getTransactionHistory = jest.fn().mockResolvedValue([])
    prisonApi.getAgencyDetails = jest.fn().mockResolvedValue({})

    controller = prisonerPrivateCash({ prisonApi, prisonerFinanceService })
  })

  it('should make the expected calls', async () => {
    await controller(req, res)

    expect(prisonApi.getTransactionHistory).toHaveBeenCalledWith(res.locals, offenderNo, {
      account_code: 'cash',
      transaction_type: 'HOA',
    })
    expect(prisonerFinanceService.getPrisonerFinanceData).toHaveBeenCalledWith(
      res.locals,
      offenderNo,
      'cash',
      undefined,
      undefined
    )
    expect(prisonApi.getAgencyDetails).not.toHaveBeenCalled()
  })

  describe('with data', () => {
    beforeEach(() => {
      prisonerFinanceService.getPrisonerFinanceData = jest.fn().mockResolvedValue({
        ...prisonerFinanceData,
        allTransactionsForDateRange: [
          {
            offenderId: 1,
            transactionId: 789,
            transactionEntrySequence: 1,
            entryDate: '2020-11-16',
            transactionType: 'POST',
            entryDescription: 'Bought some food',
            referenceNumber: null,
            currency: 'GBP',
            penceAmount: 10000,
            accountType: 'REG',
            postingType: 'DR',
            agencyId: 'LEI',
          },
        ],
      })
      prisonApi.getTransactionHistory = jest.fn().mockResolvedValue([
        {
          offenderId: 1,
          transactionId: 234,
          transactionEntrySequence: 1,
          entryDate: '2020-11-27',
          transactionType: 'HOA',
          entryDescription: 'HOLD',
          referenceNumber: null,
          currency: 'GBP',
          penceAmount: 1000,
          accountType: 'REG',
          postingType: 'DR',
          agencyId: 'MDI',
        },
      ])

      prisonApi.getAgencyDetails = jest
        .fn()
        .mockResolvedValue({ description: 'Moorland', agencyId: 'MDI' })
        .mockResolvedValueOnce({ description: 'Leeds', agencyId: 'LEI' })
    })

    it('should make additional expected API calls for agency data', async () => {
      await controller(req, res)

      expect(prisonApi.getAgencyDetails).toHaveBeenCalledWith({}, 'MDI')
      expect(prisonApi.getAgencyDetails).toHaveBeenCalledWith({}, 'LEI')
    })

    it('should render the correct template with the correct information', async () => {
      await controller(req, res)

      expect(res.render).toHaveBeenCalledWith('prisonerProfile/prisonerFinance/privateCash.njk', {
        ...prisonerFinanceData.templateData,
        nonPendingRows: [
          [{ text: '16/11/2020' }, { text: '' }, { text: '£100.00' }, { text: 'Bought some food' }, { text: 'Leeds' }],
        ],
        pendingBalance: '-£10.00',
        pendingRows: [
          [{ text: '27/11/2020' }, { text: '' }, { text: '£10.00' }, { text: 'HOLD' }, { text: 'Moorland' }],
        ],
      })
    })
  })

  describe('when selecting a month and year', () => {
    beforeEach(() => {
      req.query = {
        month: '6',
        year: '2020',
      }
    })

    it('should pass them to getPrisonerFinanceData', async () => {
      await controller(req, res)

      expect(prisonerFinanceService.getPrisonerFinanceData).toHaveBeenCalledWith(
        res.locals,
        offenderNo,
        'cash',
        '6',
        '2020'
      )
    })
  })

  describe('when there are errors', () => {
    it('set the redirect url and throw the error', async () => {
      const error = new Error('Network error')
      prisonerFinanceService.getPrisonerFinanceData.mockRejectedValue(error)

      await expect(controller(req, res)).rejects.toThrowError(error)
      expect(res.locals.redirectUrl).toBe(`/prisoner/${offenderNo}`)
    })
  })
})
