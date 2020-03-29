const contextProperties = require('../contextProperties')

const dataComplianceApiFactory = client => {
  const processResponse = context => response => {
    contextProperties.setResponsePagination(context, response.headers)
    return response.body
  }

  const map404ToNull = error => {
    if (!error.response) throw error
    if (!error.response.status) throw error
    if (error.response.status !== 404) throw error
    return null
  }

  const get = (context, url) => client.get(context, url).then(processResponse(context))

  const put = (context, url, data) => client.put(context, url, data).then(processResponse(context))

  const getOffenderRetentionReasons = context => get(context, `/retention/offenders/retention-reasons`)

  const getOffenderRetentionRecord = (context, offenderNo) =>
    get(context, `/retention/offenders/${offenderNo}`).catch(map404ToNull)

  const putOffenderRetentionRecord = (context, offenderNo, body) =>
    put(context, `/retention/offenders/${offenderNo}`, body)

  return {
    getOffenderRetentionReasons,
    getOffenderRetentionRecord,
    putOffenderRetentionRecord,
  }
}

module.exports = { dataComplianceApiFactory }
