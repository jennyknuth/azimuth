var zip = document.getElementById('zip')
var button = document.getElementById('button')
var uv = document.getElementById('uv')


button.addEventListener('click', function(e) {
  e.preventDefault()
  axios.post('/UV', {
      zip: zip.value
    })
    .then(function (response) {
      console.log(response)

      uv.innerHTML = 'The U.V. index right now is: ' + response.data.UV
    })
})
