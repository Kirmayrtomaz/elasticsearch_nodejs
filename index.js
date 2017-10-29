const express = require('express')
const Promise = require('bluebird')
const app = express()

const search = require('./search')
const movies = require('./movies')

app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')

  const allowedHeaders = 'Origin, X-Requested-With, Content-Type, Accept,' +
    ' Cache-Control, Pragma, Expires, login, registration, Authorization, X-Session-Id'

  res.header('Access-Control-Allow-Headers', allowedHeaders)
  next()
})

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

app.get('/movies', function (req, res) {
  return Promise.coroutine(function * () {
    const query = req.query.q
    const page = req.query.page || 1
    const limit = req.query.limit || 25
    let result = []
    try {
      result = yield movies.search({query, page, limit})
    } catch (e) {
      result = e
    }
    return res.json(result)
  })()
})

app.listen(3000, function () {
  console.log('API READY')
})
