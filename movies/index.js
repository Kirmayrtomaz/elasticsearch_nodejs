'use strict'

const Promise = require('bluebird')
const _ = require('lodash')

let searchUserWrapper = require('../config').search

function mergeSourceAndHighlight (item) {
  return _.mergeWith(item._source, {
    nameHighlight: _.get(item, 'highlight.name[0]', item._source.name)
  })
}

function search (data) {
  return Promise.coroutine(
    function * () {
      const {limit, page, order, query} = data
      let {orderBy} = data
      let sort = {}
      const searchMovies = yield searchUserWrapper()
      const configSearch = {
        index: 'movies',
        type: 'blog',
        body: {
          from: page - 1,
          size: limit,
          query: {},
          sort: [
            { note: 'desc'},
            '_score'
          ],
          highlight: {
            fields: {
              name: {}
            }
          },
          _source: ['id', 'title', 'release', 'producer', 'actors', 'genre', 'description', 'link', 'image', 'note']
        }
      }
      configSearch.body.query = {
        multi_match: {
          query: query,
          fields: ['title', 'genre', 'description', 'actors']
        }
      }
      const results = yield searchMovies.search(configSearch)
      const total = _.get(results, 'hits.total', 0)
      const movies = _.map(_.get(results, 'hits.hits', []), (movie) => {
        return {
          id: _.get(movie, '_source.id', ''),
          title: _.get(movie, '_source.title', ''),
          release: _.get(movie, '_source.release', ''),
          producer: _.get(movie, '_source.producer', ''),
          actors: _.get(movie, '_source.actors', ''),
          genre: _.get(movie, '_source.genre', ''),
          description: _.get(movie, '_source.description', ''),
          link: _.get(movie, '_source.link', ''),
          image: _.get(movie, '_source.image', ''),
          note: _.get(movie, '_source.note')
        }
      })

      return {
        total,
      movies}
    })()
}

module.exports = {
search}
