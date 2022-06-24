import React, {useEffect, useState} from 'react';
import { loadTweets, createTweet } from '../lookup';


export function TweetzComponent(props) {
  const textAreaRef = React.createRef()
  const [newTweetz, setNewTweetz] = useState([])
  const handleSubmit = (event) => {
    event.preventDefault()
    const newVal = textAreaRef.current.value
    let tempNewTweetz = [...newTweetz]
    createTweet(newVal, (response,status) => {
      if (status === 201) {
        tempNewTweetz.unshift(response)
      } else {
        console.log(response)
        alert('An error occured')
      }
   
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
        const myCallback = (response, status) => {
          if (status === 200){
            setTweetzInit(response)
            setTweetzDidSet(true)
          } else {
            alert('Error')
          }
        }
        loadTweets(myCallback)
      }
    }, [tweetzInit, tweetzDidSet, setTweetzDidSet])
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