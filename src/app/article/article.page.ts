import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-article',
  templateUrl: './article.page.html',
  styleUrls: ['./article.page.scss'],
})

export class ArticlePage implements OnInit {
  
  userHasRead: boolean = false;
  userHasShared: boolean = false;
  uid: string;
  title: string;
  comment: string;
  //titleID: string = this.title.replace(/[^A-Z0-9]+/ig, "-");
  reads: Observable<DocumentData[]>;
  shares: Observable<DocumentData[]>;
  flags: Observable<DocumentData[]>;
  comments: Observable<DocumentData[]>;
  sends: Observable<DocumentData[]>;
  followers: Observable<DocumentData[]>;
  shareRef;
  date;
  currentTime;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              private afs: AngularFirestore,
              public toastController: ToastController) { }

  ngOnInit() {

    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        
        console.log(user.displayName);
        this.uid = user.uid;
        
        this.reads = this.afs.collection("articles").doc(this.title).collection("reads").valueChanges();

          this.afs.collection('users', ref => ref.where('size', '==', 'large'))
        
        this.shares = this.afs.collection("articles").doc(this.title).collection("shares").valueChanges();
        
        this.flags = this.afs.collection("articles").doc(this.title).collection("flags").valueChanges();
        
        this.sends = this.afs.collection("articles").doc(this.title).collection("sends").valueChanges();
        
        this.comments = this.afs.collection("articles").doc(this.title).collection("comments").valueChanges();
      
      }
    })

  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000
    });
    toast.present();
  }

  share() {
    
    if (!this.userHasRead) {
      this.presentToast("You should probably read an article before sharing it")
    }
    
    else {    
      
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("shares");
        shareRef1.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), sharedIsTrue: (true) });

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("activity");
        shareRef2.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), sharedIsTrue: (true) });

      const shareRef3 = this.afs.collection("articles").doc(this.title).collection("shares");
        shareRef3.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), sharedIsTrue: (true) });

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), sharedIsTrue: (true) });
        }
      })

      this.presentToast("Article shared with followers");
    
  
    }
  }

  unshare() {
    //delete from shares, activity, followers activity using id with loops or collection group queries
  
  }

  flag(flagType) {
    if (!this.userHasRead) {
      this.presentToast("You should probably read an article before flagging it as biased")
    }
    
    else {
      
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("flags");
        shareRef1.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), flaggedIsTrue: (true) });

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("activity");
        shareRef2.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), flaggedIsTrue: (true) });

      const shareRef3 = this.afs.collection("articles").doc(this.title).collection("flags");
        shareRef3.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), flaggedIsTrue: (true) });

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), flaggedIsTrue: (true) });
        }
      })

      this.presentToast("Article flagged for followers");
    
  
  }

  }

  unflag() {
    //delete from flags, activity, followers activity using id with loops or collection group queries

  }

  send() {
    if (!this.userHasRead) {
      this.presentToast("You should probably read an article before sending it to someone")
    }
    
    else {
      
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("sends");
        shareRef1.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), sentIsTrue: (true) });

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("activity");
        shareRef2.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), sentIsTrue: (true) });

      const shareRef3 = this.afs.collection("articles").doc(this.title).collection("sends");
        shareRef3.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), sentIsTrue: (true) });

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), sentIsTrue: (true) });
        }
      })

      this.presentToast("Article shared with followers");
    
  
  }

  }

  newComment() {
    if (!this.userHasRead) {
      this.presentToast("You should probably read an article before commenting on it")
    }
    
    else {
      
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("comments");
        shareRef1.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), title: (this.title), commentIsTrue: (true) });

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("activity");
        shareRef2.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), title: (this.title), commentIsTrue: (true) });

      const shareRef3 = this.afs.collection("articles").doc(this.title).collection("comments");
        shareRef3.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), title: (this.title), commentIsTrue: (true) });

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), title: (this.title), commentIsTrue: (true) });
        }
      })

      this.presentToast("Article shared with followers");
    
  }

  }

  deleteComment() {
    //delete from comments, activity, followers activity using id with loops or collection group queries
  }

  likeComment() {
    //add to commentLikes, activity, followers activity

  }

  unlikeComment() {
    //delete from commentLikes, activity, followers activity using id with loops or collection group queries

  }

  commentReply() {
    //add to commentReplies, activity, followers activity

  }

  deleteCommentReply() {
    //delete from commentReplies, activity, followers activity using id with loops or collection group queries

  }

}