import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})

export class UserPage implements OnInit {

  thisIsYou: boolean;
  userIsFollowing: boolean;
  uid: string;
  displayName: string;
  userId: string;
  userDisplayName: string;
  followers: Observable<DocumentData[]>;
  following: Observable<DocumentData[]>;
  date: Date;
  currentTime: number;
  userProfileDoc;
  userActivity;
  photoUrl;
  userPhotoUrl;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              private afs: AngularFirestore,
              public toastController: ToastController) { }

  activity = [{user: "TommyD",
    title: "Who will win the 2020 Presidential election?",
    publisher: "The Wall Street Journal",
    date: "August 8th, 2020"},
    {user: "TommyD2",
    title: "it works",
    publisher: "wired",
    date: "August 8th, 2020"},
    {user: "TommyD3",
    title: "it works",
    publisher: "wired",
    date: "August 8th, 2020"},
    {user: "TommyD5",
    title: "it works", publisher: "wired",
    date: "August 8th, 2020"},
    {user: "TommyD",
    title: "it works",
    publisher: "wired",
    date: "August 8th, 2020"}]

  ngOnInit() {
    //check for user actions and set boolean class properties
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        
        console.log("currentUser: " + user);
        this.uid = user.uid;
        this.displayName = user.displayName;
        this.photoUrl = user.photoURL;

        this.userProfileDoc = this.afs.collection("users").doc(this.userId).get();
        console.log(this.userProfileDoc);

        this.userActivity = this.afs.collection("users").doc(this.userId).collection("activity").get();
        
        this.followers = this.afs.collection("users").doc(this.userId).collection("followers").valueChanges();
        this.following = this.afs.collection("users").doc(this.userId).collection("following").valueChanges();
      }
    })
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000
    });
    toast.present();
  }

  follow() {   
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const followRef1 = this.afs.collection("users").doc(this.userId).collection("followers");
        followRef1.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), 
                         followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followedIsTrue: (true) });

      const followRef2 = this.afs.collection("users").doc(this.userId).collection("publicActivity");
      followRef2.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), 
                       followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followedIsTrue: (true) });

      const followRef3 = this.afs.collection("users").doc(this.uid).collection("following");
      followRef3.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), 
                       followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followingIsTrue: (true) });

      const followRef4 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
      followRef4.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), 
                       followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followingIsTrue: (true) });

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const followRef5 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          followRef5.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), 
                           followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followingIsTrue: (true) });
        }
      })
      this.presentToast("Following");
  }

  unFollow() {
    if (this.userIsFollowing) {

      const unFollowRef1 = this.afs.collection("users").doc(this.userId).collection("followers", ref => 
        ref.where('uid', '==', this.uid)
           .where('userId', "==", this.userId));
      unFollowRef1.doc().delete().then(() => console.log("unFollowed"));
      
      const unFollowRef2 = this.afs.collection("users").doc(this.userId).collection("publicActivity", ref => 
        ref.where('uid', '==', this.uid)
           .where('userId', "==", this.userId));
      unFollowRef2.doc().delete().then(() => console.log("unFollowed"));
      
      const unFollowRef3 = this.afs.collection("articles").doc(this.uid).collection("following", ref => 
        ref.where('uid', '==', this.uid)
           .where('userId', "==", this.userId));
      unFollowRef3.doc().delete().then(() => console.log("unFollowed"));
      
      const unFollowRef4 = this.afs.collection("articles").doc(this.uid).collection("publicActivity", ref => 
        ref.where('uid', '==', this.uid)
           .where('userId', "==", this.userId));
      unFollowRef4.doc().delete().then(() => console.log("unFollowed"));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const unFollowRef5 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity", ref => 
            ref.where('uid', '==', this.uid)
               .where('userId', "==", this.userId));
          unFollowRef5.doc().delete().then(() => console.log("unFollowed"));
        }
      })
    }
  }

}