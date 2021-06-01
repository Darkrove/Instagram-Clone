import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './components/Post';
import ImageUpload from './components/ImageUpload';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';

function getModalStyle() {
  const top = 50;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState ([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // useEffect - run a piece of code based on a specific condition
  useEffect(() => {
    // this is where code run 
    db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
      // every time a new post add fire this code
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id ,
        post: doc.data()
      })));
    })
  }, [])

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if(authUser){
        // user has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out
        setUser(null)
      }
    })
  }, [username, user]);

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));
    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));
    setOpenSignIn(false);
  }

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
              <center>
                <img 
                  className="app__headerImage" 
                  alt="" 
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />
              </center>

              <Input  
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp}>Sign Up</Button>
            </form>
        </div>
      </Modal>
    
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
              <center>
                <img 
                  className="app__headerImage" 
                  alt="" 
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />
              </center>

              <Input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>Sign In</Button>
            </form>
        </div>
      </Modal>

      <div className="app__header">
        <img 
          className="app__headerImage" 
          alt="" 
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />
          {user ? (
            <div className="app__loginContainer">
              <Button onClick={(() => auth.signOut())}>Log Out, {user.displayName}</Button>
            </div>
            ) : (
            <div className="app__loginContainer">
              <Button onClick={(() => setOpenSignIn(true))}>Sign In</Button>
              <Button onClick={(() => setOpen(true))}>Sign Up</Button>
            </div>
          )}
      </div>
      
      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} url={post.url}/>
            ))
          }
        </div> 
      </div>
        
      <div className="app__footer">
        {user?.displayName ? 
        (
          <ImageUpload username={user.displayName}/>
        ) 
        : 
        (
          <h3 className="center">hey, you need to login</h3>
        )} 
      </div>  
    </div>
  );
}

export default App;
