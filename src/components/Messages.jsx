import React, { useContext, useEffect, useState } from 'react'
import Message from './Message'
import { ChatContext } from '../Context/ChatContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export const Messages = () => {
  const [Messages,setMessages]=useState([])
  const { data } =useContext(ChatContext)

  useEffect(()=>{
    const unSub= onSnapshot(doc(db,"chats",data.chatId), (doc)=>[
      doc.exists() && setMessages(doc.data().messages)
    ])

    return () =>{
        unSub()
    }
  },[data.chatId])

  console.log(Messages)
  return ( 
    <div className='messages'>
        {Messages.map(m=>(
        <Message message ={m} key={m.id} />
        ))} 
    </div>
  )
}
