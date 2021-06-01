import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { db, storage } from '../firebase';
import firebase from 'firebase';
import './ImageUpload.css';

function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');


    const handleChanged = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0])
        }
    };

    const handleUpload = (e) => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress);
            },
            (error) => {
                // error function
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function
                storage
                .ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        url: url,
                        username: username,
                    })
                });

                setProgress(0);
                setCaption("");
                setImage(null);
            }
        )
    };

    return (
        <div className="imageupload">
            <progress className="imageupload_progress" value={progress} max="100"/>
            <input type="text" placeholder="Enter a Caption.." onChange={event => setCaption(event.target.value)} value={caption}/>
            <input type="file" onChange={handleChanged}/>
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
