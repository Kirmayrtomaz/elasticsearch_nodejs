const Promise = require('bluebird')
let searchWrapper = require('../config/index').search

function searchWorks () {
  return Promise.coroutine(function * () {
    const searchClient = yield searchWrapper()

    const status = yield searchClient.ping({
      requestTimeout: 30000
    })
    return status
  })()
}

module.exports = {
  searchWorks
}
