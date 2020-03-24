const express = require('express')
const { retentionReasonsFactory } = require('./retentionReasons')

const router = express.Router({ mergeParams: true })

const controller = ({ logError }) => {
  const { index } = retentionReasonsFactory(logError)

  router.get('/', index)

  return router
}

module.exports = dependencies => controller(dependencies)
