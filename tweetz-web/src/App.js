import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';


function loadTweets(callback) {
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
function Tweet(props) {
  const {tweet} = props
  return <div className='col-10 mx-auto col-md-6'>
    <p>{tweet.content}</p>
  </div>
}

function App() {
  const [tweets, setTweets] = useState([])
  

  useEffect(() => {
    const myCallback = (response, status) => {
      console.log(response, status)
      if (status === 200){
        setTweets(response)
      } else {
        alert('Error')
      }
    }
    loadTweets(myCallback)
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          {tweets.map((item, index) => {
            return <Tweet tweet={item} />
          })}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
