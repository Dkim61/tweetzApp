import React, {useState, useEffect} from 'react';
import {TweetCreate} from './create';
import { TweetzList } from './list';
import { apiTweetDetail } from './lookup';
import { Tweet } from './detail';
export function TweetzComponent(props) {
  const [newTweetz, setNewTweetz] = useState([])
  const canTweet = props.canTweet === "false" ? false : true
  const handleNewTweet = (newTweet) => {
    // backend api handler
    let tempNewTweetz = [...newTweetz]
    tempNewTweetz.unshift(newTweet)
    setNewTweetz(tempNewTweetz)
  }
  return <div className='props.classname'>
    {canTweet === true && <TweetCreate didTweet={handleNewTweet} className='col-12 mb-3'/> }
  <TweetzList newTweetz={newTweetz} {...props}/>
  </div>
}

export function TweetDetailComponent(props){
  const {tweetId} = props
  const [didLookup, setDidLookup] = useState(false)
  const [tweet, setTweet] = useState(null)
  const handleBackendLookup = (response, status) =>{
    if (status ===200){
      setTweet(response)
    } else {
      alert("There was an error finding your tweet")
    }
  }
  useEffect(() =>{
    if (didLookup ===false) {
      apiTweetDetail(tweetId, handleBackendLookup)
      setDidLookup(true)
    }
  }, [tweetId, didLookup ,setDidLookup])
  return tweet === null ? null : <Tweet tweet={tweet}/>
}