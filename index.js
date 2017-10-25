const express = require('express')
const Promise = require('bluebird')
const app = express()

const search = require('./search')

app.get('/', function (req, res) {
  res.json({api: 'Hello nodejs with elasticSearch!'})
})
app.get('/search', function (req, res) {
  return Promise.coroutine(function * () {
    let result
    try {
      result = yield search.searchWorks()
    } catch (e) {
      result = e
    }
    return res.json(result)
  })()
})

app.listen(3000, function () {
  console.log('API READY')
})
