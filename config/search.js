'use strict'

const Promise = require('bluebird')
let elasticsearch = require('elasticsearch')

const config = require('./config')
let connection

function createElasticSearch () {
  return Promise.coroutine(
    function * () {
      console.log('create connection')
      if (!connection) {
        connection = new elasticsearch.Client(yield config.elasticSearch())
      }
      return connection
    }
  )()
}

module.exports = createElasticSearch
