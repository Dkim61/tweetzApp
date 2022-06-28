import React, {useEffect, useState} from 'react';
import { apiTweetList, apiTweetCreate, apiTweetAction} from './lookup';


export function TweetzComponent(props) {
  const textAreaRef = React.createRef()
  const [newTweetz, setNewTweetz] = useState([])
  const handleBackendUpdate = (response, status) => {
    // backend api handler
    let tempNewTweetz = [...newTweetz]
    if (status === 201) {
      tempNewTweetz.unshift(response)
      setNewTweetz(tempNewTweetz)
    } else {
      console.log(response)
      alert('An error occured')
    }
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    const newVal = textAreaRef.current.value
    // backend api request
    apiTweetCreate(newVal, handleBackendUpdate)
    textAreaRef.current.value = ''
  }
  return <div className={props.className}>
    <div className='col-12 mb-3'>
      <form onSubmit={handleSubmit}>
        <textarea ref={textAreaRef} required={true} className='form-control' name='tweet'>
        </textarea>
        <button type='submit' className='btn btn-primary my-3'>Tweet</button>
      </form>
    </div>
  <TweetzList newTweetz={newTweetz} />
  </div>
}

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
        apiTweetList(handleTweetLookup)
      }
    }, [tweetzInit, tweetzDidSet, setTweetzDidSet])

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
  export function ActionBtn(props) {
    const {tweet, action, didPerformAction} = props
    const likes = tweet.likes ? tweet.likes : 0
    const className = props.className ? props.className : 'btn btn-primary btn-sm'
    const actionDisplay = action.display ? action.display : 'Action'

    const handleActionBackendEvent = (response, status) => {
      console.log(response, status)
      if ((status === 200 || status === 201) && didPerformAction ) {
        didPerformAction(response, status)
      }
    }
    const handleClick = (event) => {
      event.preventDefault()
      apiTweetAction(tweet.id, action.type, handleActionBackendEvent )
     
    }
    const display = action.type === 'like' ? `${likes} ${actionDisplay}` : actionDisplay
    return <button className={className} onClick={handleClick} >{display}</button>
  }
  export function ParentTweet(props) {
    const {tweet} = props
    return tweet.parent ? <div className='row' >
          <div className='col-11 mx-auto p-3 border rounded' >
            <p className='mb-0 text-muted small' > RETWEET</p>
            <Tweet hideActions className={' '} tweet = {tweet.parent}/>
           </div>
        </div> : null
  }
  export function Tweet(props) {
    const {tweet, didRetweet, hideActions} = props
    const [actionTweet, setActionTweet] = useState(props.tweet ? props.tweet : null)
    const className = props.className ? props.className : 'col-10 mx-auto col-md-6'
    
    const handlePerformAction = (newActionTweet, status) => {
      if (status === 200) {
        setActionTweet(newActionTweet)
      } else if (status === 201) {
        if (didRetweet){
          didRetweet(newActionTweet)
        }
      }
    }
    
    
    return <div className={className}>
      <div>
        <p>{tweet.id}) {tweet.content}</p>
        <ParentTweet tweet={tweet} /> 
      </div>
      {(actionTweet && hideActions !== true) && <div className='btn btn-group'>
          <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} action={{type:'like', display:'Likes'}}/>
          <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} action={{type:'unlike', display:'Unlike'}}/>
          <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} action={{type:'retweet', display:'Retweet'}}/>
        </div>
      }
    </div>
  }