import React, { useContext } from 'react'
import Cam from '../assets/image/video-camera.png'
import add from '../assets/image/friends.png'
import more from '../assets/image/more.png'
import { Messages } from './Messages'
import Input from './Input'
import { ChatContext } from '../Context/ChatContext'

export default function Chat() {

  const { data } =useContext(ChatContext)
  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>{data.user.displayName}</span>
        <div className="charIcons">
          <img src={Cam} alt="" />
          <img src={add} alt="" />
          <img src={more} alt="" />
        </div>
      </div>
        <Messages />
        <Input />
    </div>
  )
}
