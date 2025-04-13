// ...
import { useContext, useEffect, useRef } from 'react'; // Import React dependencies
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';
import { format } from 'date-fns'; // Import date-fns library for date formatting
import pngegg from '../assets/image/pngegg.png'

export default function Messages({ message }) {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // Check if data.User is defined before accessing its properties
  const userPhotoURL = data.user ? data.user.photoURL : '';

  // Format the date using date-fns
  const formattedDate = message.date ? format(message.date.toDate(), 'h:mm a') : '';


  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
      <div className="messageInfo">
        <img
          src={message.senderId === currentUser.uid ? currentUser.photoURL : userPhotoURL}
          alt="User"
          onError={(e) => {
            e.target.onerror = null; // prevents looping
            e.target.src = pngegg ; // replace with your static image path
          }}
        />

        <span>{formattedDate}</span> {/* Render the formatted date */}
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} style={{height:"100px", width:"100px"}} alt="" />}
      </div>
    </div>
  );
}
