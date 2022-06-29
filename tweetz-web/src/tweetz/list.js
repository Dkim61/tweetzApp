import React, {useEffect, useState} from 'react';
import { apiTweetList} from './lookup';
import { Tweet } from './detail';

export function TweetzList(props) {
    const [tweetzInit, setTweetzInit] = useState([])
    const [tweetz, setTweetz] = useState([])
    const [tweetzDidSet, setTweetzDidSet] = useState(false)

    // setTweetzInit(...props.newTweetz).concat(tweetzInit)
    useEffect(() =>{
      const final = [...props.newTweetz].concat(tweetzInit)
      if (final.length !== tweetz.length){
        setTweetz(final)
        console.log (tweetz)
      }      
    }, [props.newTweetz, tweetz, tweetzInit])

    useEffect(() => {
      if (tweetzDidSet === false) {
        const handleTweetLookup = (response, status) => {
          if (status === 200){
            setTweetzInit(response)
            setTweetzDidSet(true)
          } else {
            alert('Error')
          }
        }
        apiTweetList(props.username, handleTweetLookup)
      }
    }, [tweetzInit, tweetzDidSet, setTweetzDidSet, props.username])

    const handleDidRetweet = (newTweet) => {
      const updateTweetzInit = [...tweetzInit]
      updateTweetzInit.unshift(newTweet)
      setTweetzInit(updateTweetzInit)
      const updateFinalTweetz = [...tweetz]
      updateFinalTweetz.unshift(tweetz)
      setTweetz(updateFinalTweetz)
    }
    return tweetz.map((item, index) => {
      return <Tweet 
        tweet={item} 
        didRetweet={handleDidRetweet}
        className='my-5 py-5 border bg-white text-dark' 
        key={`${index}-{item.id}`}/>
    })
  }