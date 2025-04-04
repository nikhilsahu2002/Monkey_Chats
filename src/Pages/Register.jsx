import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React, { useState } from 'react';
import Add from '../assets/image/gallery.png';
import { auth, storage, db } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [err, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Upload the avatar photo
      const storageRef = ref(storage, displayName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Handle upload progress if needed
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          // Handle unsuccessful uploads
          setError(true);
          console.error('Upload error:', error.message);
        },
        async () => {
          // Get the download URL of the uploaded photo
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Update the user's profile with the display name and photo URL
          await updateProfile(res.user, {
            displayName,
            photoURL: downloadURL,
          });

          // Create a user document in Firestore (you need to import 'db' for this to work)
          await setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            photoURL: downloadURL,
          });

          // Redirect to another page on successful registration (you can use React Router for this)
          navigate("/"); // Move this line here

        }
      );
    } catch (error) {
      setError(true);
      console.error('Registration error:', error.message);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="Head">Monkey Chat</span>
        <span className="sub">Register</span>
        <form onSubmit={handleSubmit} className="form">
          <input type="text" placeholder="Name" />
          <input type="email" name="" id="email" placeholder="Email" />
          <input type="password" name="" id="password" placeholder="Password" />
          <input style={{ display: 'none' }} type="file" name="" id="file" />
          <label htmlFor="file">
            <img width={'40px'} src={Add} alt="" />
            <span>Add An Avatar</span>
          </label>
          <button type="submit">Sign Up</button>
          <p className="con">
            Do You Have Account ? <a href="#">Login</a>
          </p>
        </form>
        {err && <span>Something Went Wrong</span>}
      </div>
    </div>
  );
};

export default Register;
