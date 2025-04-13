import React, { useState, useEffect, useContext } from 'react';
import { collection, query, where, getDocs, serverTimestamp, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from '../Context/AuthContext';

export const Search = () => {
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(null);
  const [chatVisible, setChatVisible] = useState(true); // State to control chat visibility
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const handleSearch = async () => {
      if (!userName) {
        setUser(null);
        setErr(null);
        return;
      }

      try {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);

        let foundUser = null;
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.displayName.toLowerCase().includes(userName.toLowerCase())) {
            foundUser = userData; // If a similar name is found, set it
          }
        });

        if (foundUser) {
          setUser(foundUser);
          setErr(null);
        } else {
          setErr("No User found");
          setUser(null);
        }
      } catch (error) {
        setErr("Error fetching user");
        setUser(null);
      }
    };

    const debounceTimeout = setTimeout(handleSearch, 300);

    return () => clearTimeout(debounceTimeout);
  }, [userName]);

  const handleSelect = async () => {
    if (!user) {
      return; // Return early if no user is selected
    }

    const combinedId = currentUser.uid > user.uid ? `${currentUser.uid}_${user.uid}` : `${user.uid}_${currentUser.uid}`;

    try {
      const userChatsRef = doc(db, "userChats", currentUser.uid);

      // Check if the combinedId already exists in userChats
      const userChatsData = (await getDoc(userChatsRef)).data();
      if (userChatsData && userChatsData[combinedId]) {
        return; // Chat already exists, no need to create it
      }

      // Create the chat for the current user
      await setDoc(userChatsRef, {
        [combinedId]: {
          userInfo: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          data: serverTimestamp()
        }
      }, { merge: true });

      // Now, update the chat for the other user
      const otherUserChatsRef = doc(db, "userChats", user.uid);
      await setDoc(otherUserChatsRef, {
        [combinedId]: {
          userInfo: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          data: serverTimestamp()
        }
      }, { merge: true });

      // Hide the chat after it's clicked
      setChatVisible(false);
    } catch (err) {
      console.error("Error while creating user chat:", err);
      setErr("Error while creating user chat");
    }
  };

  return (
    <div className='search'>
      <div className="searchForm">
        <input type="text" placeholder='Find A User' onChange={e => setUserName(e.target.value)} value={userName} />
      </div>
      {err && <span>{err}</span>}
      {user && chatVisible && ( // Check if chat is visible
        <div className="userChat" onClick={handleSelect}>
          <div className="img1">
            <img style={{ width: "50px", height: "50px", borderRadius: "50%" }} src={user.photoURL} alt="" />
          </div>
          <div className="userchatinfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};
