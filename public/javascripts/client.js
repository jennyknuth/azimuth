var zip = document.getElementById('zip')
var button = document.getElementById('button')


button.addEventListener('click', function(e) {
  e.preventdefault()
  axios.post('/UV', {
      button: button.value
      console.log(response)
  })
})
