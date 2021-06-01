import React, { useState, useEffect } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from '../firebase';
import firebase from 'firebase';

function Post(props) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState();
    useEffect(() => {
        let unsubscribe;
        if(props.postId) {
            unsubscribe = db
            .collection("posts")
            .doc(props.postId)
            .collection("comments")
            .orderBy("timestamp", "asc")
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }
        return () => {
            unsubscribe();
        };
    }, [props.postId]);

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(props.postId).collection("comments").add({
            text: comment,
            username: props.user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setComment('');
    }
    
    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" alt=""/>
                <h3>{props.username}</h3>
            </div>
            <img className="post__image" src={props.url} alt=""/>
            <h4 className="post__text"><strong>{props.username} </strong>{props.caption}</h4>

            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>

            {props.user ?  (
                <form className="post__commentBox">
                    <input
                        className="post__input"
                        type="text"
                        value={comment}
                        placeholder="Add a comment.."
                        onChange={(e) => {setComment(e.target.value)}}
                    />
                    <button
                        disabled={!comment}
                        className="post__button"
                        type="submit"
                        onClick={postComment}
                    >Post</button>
                </form>
            ) : (
                <form className="post__commentBox">
                    <input
                        disabled="true"
                        className="post__input post__inputDisablee"
                        type="text"
                        value={comment}
                        placeholder="Add a comment.."
                        onChange={(e) => {setComment(e.target.value)}}
                    />
                    <button
                        disabled="true"
                        className="post__button post__buttonDisable"
                        type="submit"
                        onClick={postComment}
                    >Post</button>
                </form>
            )}
        </div>
    )
}

export default Post
