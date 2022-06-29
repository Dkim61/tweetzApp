import {backendLookup} from '../lookup'

export function apiTweetCreate(newTweet, callback) {
  backendLookup('POST', '/tweetz/create/', callback, {content: newTweet})
}

export function apiTweetAction(tweetId, action, callback){
  const data = {id: tweetId, action: action}
  backendLookup("POST", "/tweetz/action/", callback, data)
}

export function apiTweetDetail(tweetId, callback) {
  backendLookup('GET', `/tweetz/${tweetId}/`, callback)
}

export function apiTweetList(username, callback) {
  let endpoint = '/tweetz/'
  if (username) {
    endpoint = `/tweetz/?username=${username}`
  }
  backendLookup('GET', endpoint, callback)
}
