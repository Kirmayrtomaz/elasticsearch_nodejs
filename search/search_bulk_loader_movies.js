'use strict'
const _ = require('lodash')
const Promise = require('bluebird')
let searchClientWrapper = require('../config/index').search
const fs = require('fs')

function getMovies () {
  return new Promise((resolve, reject) => {
    fs.readFile('movies.json', 'utf8', function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(JSON.parse(data))
    })
  })
}

function configurateSearch (searchClient) {
  return Promise.coroutine(
    function * () {
      const exists = yield searchClient.indices.exists({
        index: 'movies'
      })

      if (exists) {
        yield searchClient.indices.delete({
          index: 'movies'
        })
      }

      yield searchClient.indices.create({
        index: 'movies',
        body: {
          'settings': {
            'analysis': {
              'analyzer': {
                'partialAnalyzer': {
                  'type': 'custom',
                  'tokenizer': 'ngram_tokenizer',
                  'filter': [
                    'lowercase',
                    'asciifolding'
                  ]
                },
                'searchAnalyzer': {
                  'type': 'custom',
                  'tokenizer': 'standard',
                  'filter': [
                    'standard',
                    'lowercase',
                    'asciifolding'
                  ]
                },
                'keyword_lowercase': {
                  'type': 'custom',
                  'tokenizer': 'keyword',
                  'filter': [
                    'asciifolding',
                    'lowercase'
                  ]
                }
              },
              'tokenizer': {
                'ngram_tokenizer': {
                  'type': 'edge_ngram',
                  'min_gram': '5',
                  'max_gram': '15',
                  'token_chars': [
                    'letter',
                    'digit'
                  ]
                }
              }
            }
          },
          'mappings': {
            'blog': {
              'properties': {
                'id': {
                  'type': 'text'
                },
                'title': {
                  'type': 'text',
                  'analyzer': 'searchAnalyzer',
                  'search_analyzer': 'searchAnalyzer',
                  'term_vector': 'with_positions_offsets'
                },
                'release': {
                  'type': 'text'
                },
                'producer': {
                  'type': 'text',
                  'analyzer': 'searchAnalyzer',
                  'search_analyzer': 'partialAnalyzer'
                },
                'genre': {
                  'type': 'text',
                  'analyzer': 'searchAnalyzer',
                  'search_analyzer': 'partialAnalyzer'
                },
                'actors': {
                  'type': 'text',
                  'analyzer': 'searchAnalyzer',
                  'search_analyzer': 'searchAnalyzer'
                },
                'description': {
                  'type': 'text',
                  'analyzer': 'searchAnalyzer',
                  'search_analyzer': 'searchAnalyzer'
                },
                'link': {
                  'type': 'text'
                },
                'image': {
                  'type': 'text'
                }
              }
            }
          }

        }
      })
    })()
}

function mapMoviesForBulkInsert (movie) {
  return [{
    index: {
      _index: 'movies',
      _type: 'blog',
      _id: movie.id
    }
  }, {
    id: movie.id,
    title: movie.title,
    release: movie.release,
    producer: movie.productr,
    actors: movie.actors,
    genre: movie.genre,
    description: movie.description,
    link: movie.link,
    image: movie.image,
    note: movie.note

  }]
}

function loader () {
  return Promise.coroutine(
    function * () {
      const searchClient = yield searchClientWrapper()
      yield configurateSearch(searchClient)

      let moviesToIndex = []
      try {
        moviesToIndex = yield getMovies()
      } catch (err) {
        throw err
      }

      let errors = false
      const pageSize = 500

      if (moviesToIndex) {
        const chunkMovies = _.chunk(moviesToIndex, pageSize)

        for (const groupedMovies of chunkMovies) {
          const bulk = yield searchClient.bulk({
            body: _.flatMap(groupedMovies, mapMoviesForBulkInsert)
          })

          if (bulk.errors) {
            logger.error('BULK ERROR', bulk)
            errors = true
          }
        }
      }

      if (errors) {
        throw new Error('Bulk operation Error')
      }
    })()
}

module.exports = loader

loader()
