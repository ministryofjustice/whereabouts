const { dataComplianceApiFactory } = require('./dataComplianceApi')

const client = {}
const dataComplianceApi = dataComplianceApiFactory(client)
const context = { some: 'context' }

describe('data compliance api', () => {
  describe('get offender retention reasons', () => {
    const expectedResponse = { some: 'response' }
    let actual

    beforeEach(async () => {
      client.get = jest.fn().mockResolvedValue({ body: expectedResponse })
      actual = await dataComplianceApi.getOffenderRetentionReasons(context)
    })

    it('should call the correct endpoint', () => {
      expect(client.get).toBeCalledWith(context, '/retention/offenders/retention-reasons')
    })

    it('should return response from endpoint', async () => {
      // const actualResponse = await actual;
      expect(actual).toEqual(expectedResponse)
    })
  })

  describe('get offender retention record', () => {
    const responseBody = { some: 'response' }
    let actual

    beforeEach(async () => {
      client.get = jest.fn().mockResolvedValue({ body: responseBody })
      actual = await dataComplianceApi.getOffenderRetentionRecord(context, 'A1234BC')
    })

    it('should call the correct endpoint', () => {
      expect(client.get).toBeCalledWith(context, '/retention/offenders/A1234BC')
    })

    it('should return response from endpoint', () => {
      expect(actual).toEqual(responseBody)
    })

    it('should return null if 404 received', async () => {
      client.get = jest.fn().mockRejectedValue({ response: { status: 404 } })
      const errorResponse = await dataComplianceApi.getOffenderRetentionRecord(context, 'A1234BC')
      expect(errorResponse).toEqual(null)
    })
  })
})
