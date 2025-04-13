import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../Context/AuthContext";
import { ChatContext } from "../Context/ChatContext";

export default function Chats() {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });
      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="chats">
      {chats &&
        Object.entries(chats).map((chat) => {
          const userInfo = chat[1]?.userInfo; // Safely access userInfo
          if (!userInfo) return null; // Skip rendering if userInfo is undefined
          

          return (
            <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
              <div className="img1">
                <img
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  src={chat[1].userInfo.photoURL || 'default-avatar-url'} // Use a default URL or handle missing photoURL
                  alt=""
                />
              </div>
              <div className="userchatinfo">
                <span>{chat[1].userInfo.displayName}</span>
                {/* <p>{chat[1].lastMessage?.text|| "No Messages"}</p> */}
              </div>
            </div>
          );
        })}
    </div>
  );
}
