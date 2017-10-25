const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.json({api: 'Hello nodejs with elasticSearch!'})
})

app.listen(3000, function () {
  console.log('API READY')
})
