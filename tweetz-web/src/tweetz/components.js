import React, {useEffect, useState} from 'react';
import { loadTweets } from '../lookup';


export function TweetzComponent(props) {
  const textAreaRef = React.createRef()
  const [newTweetz, setNewTweetz] = useState([])
  const handleSubmit = (event) => {
    event.preventDefault()
    const newVal = textAreaRef.current.value
    let tempNewTweetz = [...newTweetz]
    tempNewTweetz.unshift({
      content: newVal,
      likes: 0,
      id: 12313
    })
    setNewTweetz(tempNewTweetz)
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
    // setTweetzInit(...props.newTweetz).concat(tweetzInit)
    useEffect(() =>{
      const final = [...props.newTweetz].concat(tweetzInit)
      if (final.length !== tweetz.length){
        setTweetz(final)
        console.log (tweetz)
      }      
    }, [props.newTweetz, tweetz, tweetzInit])

    useEffect(() => {
      const myCallback = (response, status) => {
        if (status === 200){
          setTweetzInit(response)
        } else {
          alert('Error')
        }
      }
      loadTweets(myCallback)
    }, [])
    return tweetz.map((item, index) => {
      return <Tweet tweet={item} className='my-5 py-5 border bg-white text-dark' key={`${index}-{item.id}`}/>
    })
  }
  export function ActionBtn(props) {
    const {tweet, action} = props
    const [likes, setLikes] = useState(tweet.likes ? tweet.likes : 0)
    const [userLike, setUserLike] = useState(tweet.userLike === true ? true : false)
    const className = props.className ? props.className : 'btn btn-primary btn-sm'
    const actionDisplay = action.display ? action.display : 'Action'
    const handleClick = (event) => {
        event.preventDefault()
        if (action.type === 'like'){
            if (userLike === true){
                setLikes(likes-1)
                setUserLike(false)
            } else {
                setLikes(tweet.likes+1)
                setUserLike(true)
            }
        }
    }
    const display = action.type === 'like' ? `${likes} ${actionDisplay}` : actionDisplay
    return <button className={className} onClick={handleClick} >{display}</button>
  }
  
  export function Tweet(props) {
    const {tweet} = props
    const className = props.className ? props.className : 'col-10 mx-auto col-md-6'
    return <div className={className}>
      <p>{tweet.id}) {tweet.content}</p>
      <div className='btn btn-group'>
        <ActionBtn tweet={tweet} action={{type:'like', display:'Likes'}}/>
        <ActionBtn tweet={tweet} action={{type:'unlike', display:'Unlike'}}/>
        <ActionBtn tweet={tweet} action={{type:'retweet', display:'Retweet'}}/>
      </div>
    </div>
  }