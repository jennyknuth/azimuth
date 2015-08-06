var zip = document.getElementById('zip')
var button = document.getElementById('button')
var uv = document.getElementById('uv')


button.addEventListener('click', function(e) {
  e.preventDefault()
  axios.post('/UV', {
      button: button.value
    })
    .then(function (response) {
      console.log(response)
      uv.innerHTML = response.data[0].UV_VALUE
    })
})
