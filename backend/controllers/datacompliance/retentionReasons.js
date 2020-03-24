const {
  app: { notmEndpointUrl: dpsUrl },
} = require('../../config')
const { serviceUnavailableMessage } = require('../../common-messages')

const retentionReasonsFactory = logError => {
  const getOffenderUrl = offenderNo => `${dpsUrl}offenders/${offenderNo}`

  const renderError = (req, res, error) => {
    const { offenderNo } = req.params
    if (error) logError(req.originalUrl, error, serviceUnavailableMessage)

    return res.render('error.njk', { url: getOffenderUrl(offenderNo) })
  }

  const renderTemplate = async (req, res) => {
    try {
      return res.render('retentionReasons.njk', {})
    } catch (error) {
      return renderError(req, res, error)
    }
  }

  const index = async (req, res) => renderTemplate(req, res)

  return { index }
}

module.exports = {
  retentionReasonsFactory,
}
