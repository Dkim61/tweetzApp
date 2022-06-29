import React from 'react';
import './index.css';
import App from './App';
import { TweetDetailComponent, TweetzComponent } from './tweetz';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';
import * as ReactDOM from 'react-dom';

const appEl = document.getElementById('root');
if (appEl){
  const rootAppEl = createRoot(appEl)
  rootAppEl.render(<App/>)
}

const e = React.createElement
const tweetsEl = document.getElementById("tweetme")
if (tweetsEl){
  const rootTweetEl = createRoot(tweetsEl)
  rootTweetEl.render(e(TweetzComponent, tweetsEl.dataset), tweetsEl)
}

const tweetDetailElements = document.querySelectorAll(".tweetme-detail")

tweetDetailElements.forEach(container=>{
  ReactDOM.render(
    e(TweetDetailComponent, container.dataset),
    container);
})
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
