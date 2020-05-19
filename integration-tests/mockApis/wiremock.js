const superagent = require('superagent')

const url = 'http://localhost:9191/__admin'

const stubFor = mapping => superagent.post(`${url}/mappings`).send(mapping)

const getRequests = () => superagent.get(`${url}/requests`)

const resetStubs = () => Promise.all([superagent.delete(`${url}/mappings`), superagent.delete(`${url}/requests`)])

const getFor = ({ body, urlPattern }) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: body,
    },
  })

module.exports = {
  stubFor,
  getRequests,
  resetStubs,
  getFor,
}
