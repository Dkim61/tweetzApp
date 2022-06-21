
export function loadTweets(callback) {
    const xhr = new XMLHttpRequest() // python = of xhr = SomeClasee()
    const method = 'GET' // post
    const url = 'http://127.0.0.1:8000/api/tweetz/'
    const responseType = "json"
    xhr.responseType = responseType
    xhr.open(method, url)
    xhr.onload = function() {
      callback(xhr.response, xhr.status)
    }
    xhr.onerror = function (e) {
      console.log(e)
      callback({'message': 'Request was an error'})
    }
    xhr.send()
}
