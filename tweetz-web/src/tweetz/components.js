import React, {useState} from 'react';
import {TweetCreate} from './create';
import { TweetzList } from './list';

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


 