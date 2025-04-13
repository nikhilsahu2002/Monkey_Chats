import React, { useContext, useState } from 'react';
import attact from '../assets/image/attachment.png';
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc, getDoc, setDoc } from 'firebase/firestore'; // Import getDoc and setDoc
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../firebase';

export default function Input() {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleError = (error) => {
    // Handle errors here
    console.error('Error:', error);
  };

  const handleUploadComplete = async (snapshot) => {
    try {
      const downloadURL = await getDownloadURL(snapshot.ref);
      updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          img: downloadURL,
        }),
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handlesend = async () => {
    if (image) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on('state_changed', (snapshot) => {
        // Handle upload progress if needed
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      }, handleError, () => handleUploadComplete(uploadTask.snapshot));
    } else {
      // Check if the document exists, and create it if it doesn't
      const chatDocRef = doc(db, 'chats', data.chatId);
      const chatDoc = await getDoc(chatDocRef);

      if (!chatDoc.exists()) {
        try {
          await setDoc(chatDocRef, {}, { merge: true });
        } catch (error) {
          handleError(error);
        }
      }

      // Update the messages array in the document
      try {
        updateDoc(chatDocRef, {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
      } catch (error) {
        handleError(error);
      }
    }

    // Update the last message and date for the current user
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text
      },
      [data.chatId + ".date"]: serverTimestamp()
    });

    // Update the last message and date for the other user
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text
      },
      [data.chatId + ".date"]: serverTimestamp()
    });

    // Clear text and image inputs
    setText("");
    setImage(null);
  };

  return (
    <div className='input'>
      <input type='text' placeholder='Type Something' value={text} onChange={(e) => setText(e.target.value)}  />
      <div className='send'>
        <input type='file' style={{ display: 'none' }} id='file' onChange={(e) => setImage(e.target.files[0])} />
        <label htmlFor='file'>
          <img src={attact} alt='' />
        </label>
        <button onClick={handlesend}>Send</button>
      </div>
    </div>
  );
}
