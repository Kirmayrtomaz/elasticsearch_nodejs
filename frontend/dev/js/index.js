const hogan = require('hogan.js')
const axios = require('axios')

const template = hogan.compile(`
{{#movies}}
<div class="col s12 m3 l4">
<div class="card horizontal hoverable scale-transition" style="
height: 210px
">
  <div class="card-image">
    <img src="{{image}}">
  </div>
  <div class="card-stacked">
    <div class="card-content">
        <div class="col s12 m12 l12">{{title}}</div>
        <div class="col s12 m12 l12">Produtor: {{producer}}</div>
        <div class="col s12 m12 l12">Atores: {{actors}}</div>
        <div class="col s12 m12 l12">{{#genre}}<div class="chip">{{.}}</div>{{/genre}}</div>
        <div class="col s12 m12 l12">Nota: {{note}}</div>
    </div>
    <p style="display: none;">Don Vito Corleone (Marlon Brando) é o chefe de uma 'família' de Nova York que está feliz, pois Connie (Talia Shire), sua filha, se casou com Carlo....</p>
  </div>
</div>
</div>
{{/movies}}
`)
function render (movies) {
  const output = template.render(movies)
  const htmlMovies = document.getElementById('movies')
  htmlMovies.innerHTML = output
}

function search () {
  const q = document.getElementById('search').value
  return axios
    .get(`http://localhost:3000/movies?q=${q}`)
    .then(function (response) {
      console.log(response.data)
      render(response.data)
    })
    .catch(function (error) {
      console.log(error)
    })
}

window.movies = {
  search
}

search('rei leão')
