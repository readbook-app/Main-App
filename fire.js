import React from 'react'
import {View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image} from 'react-native'
import {firebaseConfig} from './firebaseKeys'
import * as firebase from 'firebase'

console.ignoredYellowBox = ['Setting a timer'];

class Fire {
  constructor(){
    console.ignoredYellowBox = ['Setting a timer'];
    firebase.initializeApp(firebaseConfig);
  }

  getPosts = async () => {
    console.ignoredYellowBox = ['Setting a timer'];
    let db = this.firestore;
    return new Promise((res, rej) => {
      let unsubscribePosts = db.collection("posts").onSnapshot((querySnapshot) => {
        let result = [];
        querySnapshot.forEach(doc => {
          result.push(doc.data());
        });
        res(result);
      });
    });
  }

  addPost = async ({text, localUri, user}) => {
    const remoteUri = await this.uploadPhotoAsync(localUri, `photos/${this.uid}/${Date.now()}.jpg`);

    return new Promise((res, rej) => {
      this.firestore
        .collection("posts")
        .add({
          text,
          uid: this.uid,
          timestamp: this.timeStamp,
          image: remoteUri,
          name: user.name,
          avatar: user.avatar,
        })
        .then(ref => {
          res(ref)
        })
        .catch(error => {
          rej(error);
        });
    });
  };

  uploadPhotoAsync = async (uri, filename) => {
    return new Promise(async (res, rej) => {
      const response = await fetch(uri);
      const file = await response.blob();

      let upload = firebase
        .storage()
        .ref(filename)
        .put(file);

      upload.on(
        "state_changed",
        snapshot => {},
        err => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
        }
      );
    });
  };

  getUserData = async () => {
    let docRef = this.firestore.collection("users").doc(this.uid);
    return new Promise(async (res, rej) => {
      docRef.get()
      .then(querySnapshot => {
          res(querySnapshot.data());
      })
      .catch(error => {
          rej(error);
      });
    });
  }

  addUser = async user => {
        let remoteUri = null;

        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);

            let db = this.firestore.collection("users").doc(this.uid);

            db.set({
                name: user.name,
                email: user.email,
                avatar: null
            });

            if (user.avatar) {
                remoteUri = await this.uploadPhotoAsync(user.avatar, `avatars/${this.uid}`);

                db.set({ avatar: remoteUri }, { merge: true });
            }
        } catch (error) {
            alert("Error: ", error);
        }
  };

  signOut = () => {
    firebase.auth().signOut();
  }

  get firestore(){
    return firebase.firestore();
  }

  get displayName(){
    return (firebase.auth().currentUser || {}).displayName;
  }

  get uid(){
    return (firebase.auth().currentUser || {}).uid;
  }

  get timeStamp(){
    return Date.now();
  }
}

Fire.shared = new Fire();
export default Fire;
