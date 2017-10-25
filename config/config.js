const Promise = require('bluebird')

function loadElasticSearchConfig () {
  return Promise.coroutine(
    function * () {
      let configElasticSearch = {
        hosts: process.env.ELASTICSEARCH_HOST || 'elasticsearch:9200',
        maxRetries: 5,
        sniffOnConnectionFault: true,
        apiVersion: '5.1',
        log: 'error'
      }

      configElasticSearch.httpAuth = process.env.ELASTICSEARCH_AUTH || 'elastic:changeme'

      return configElasticSearch
    }
  )()
}

module.exports = {
  elasticSearch: loadElasticSearchConfig
}
