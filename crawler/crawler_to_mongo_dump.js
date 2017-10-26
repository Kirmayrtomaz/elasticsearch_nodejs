const request = require('request')
const cheerio = require('cheerio')
const Promise = require('bluebird')
const fs = require('fs')
const pages = new Array(1481)
const url = 'http://www.adorocinema.com/filmes/todos-filmes/notas-espectadores/?page='
let $

const movies = []

function crawler (page) {
  return new Promise((resolve, reject) => {
    request(`${url}${page}`, function (error, response, body) {
      if (error) {
        reject(error)
      }

      $ = cheerio.load(body)
      getInfo()
      resolve()
    })
  })
}
Promise.coroutine(function * () {
  let count = 1
  for (const page of pages) {
    console.log(count)
    try{
      yield crawler(count, page)
    }catch(e){
      console.log('@_@', e)
    }
    count++
  }
 // yield saveData()

  console.log('uhuuuuuul')
})()

function saveData () {
  return new Promise((resolve, reject) => {
    fs.writeFile('movies_2.json', JSON.stringify(movies), function (err) {
      if (err) {
        console.log('@_____@')
        reject(err)
      }
      resolve('The file was saved!')
    })
  })
}
function appendData (movie) {
  return new Promise((resolve, reject) => {
    fs.appendFile('movies_dump.json', JSON.stringify(movie) + '\n', function (err) {
      if (err) {
        console.log('@_____@')
        reject(err)
      }
      resolve('The file was appended!')
    })
  })
}

function getInfo () {
  $('#col_content .data_box').map(function (e, l) {
    return Promise.coroutine(function * () {
      const data = {
        id: $(l).find('.titlebar_02 .bold').text().replace(/\n/g, '').replace('.', ''),
        title: $(l).find('.no_underline').text().replace(/\n/g, ''),
        release: $(l).find('.list_item_p2v .oflow_a').eq(0).text().replace(/\n/g, ''), // need separate date and hour duration
        productr: $(l).find('.list_item_p2v .oflow_a').eq(1).text().replace(/\n/g, ''),
        actors: $(l).find('.list_item_p2v .oflow_a').eq(2).text().replace(/\n/g, '').split(','),
        genre: $(l).find('.list_item_p2v .oflow_a').eq(3).text().replace(/\n/g, '').split(','),
        description: $(l).find('p').text().replace(/\n/g, ''),
        note: parseFloat($(l).find('.note').text().replace(',', '.')),
        link: 'http://www.adorocinema.com/' + $(l).find('h2 a').prop('href'),
        image: $(l).find('.img_side_content img').prop('src')
      }

      yield appendData(data)
    })()
  })
}
