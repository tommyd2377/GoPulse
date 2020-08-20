import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-article',
  templateUrl: './article.page.html',
  styleUrls: ['./article.page.scss'],
})

export class ArticlePage implements OnInit {
  
  userHasRead: boolean = false;
  userHasShared: boolean;
  userHasCommented: boolean;
  userHasFlagged: boolean;
  uid: string;
  title: string = "2020 election";
  publisher: string;
  publishDate: string;
  comment: string;
  titleID: string = this.title.replace(/[^A-Z0-9]+/ig, "-");
  reads: Observable<DocumentData[]>;
  shares: any;
  flags: Observable<DocumentData[]>;
  comments: Observable<DocumentData[]>;
  commentLikes: Observable<DocumentData[]>;
  commentReplies: Observable<DocumentData[]>;
  sends: Observable<DocumentData[]>;
  followers: Observable<DocumentData[]>;
  date: Date;
  currentTime: number;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              private afs: AngularFirestore,
              public toastController: ToastController,
              public iab: InAppBrowser) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        
        console.log(user.displayName);
        this.uid = user.uid;
        
        this.reads = this.afs.collection("articles").doc(this.title).collection("reads").valueChanges(); 
        this.shares = this.afs.collection("articles").doc(this.title).collection("shares").valueChanges();
        this.flags = this.afs.collection("articles").doc(this.title).collection("flags").valueChanges();
        this.sends = this.afs.collection("articles").doc(this.title).collection("sends").valueChanges();
        this.comments = this.afs.collection("articles").doc(this.title).collection("comments").valueChanges();

        //check for user actions and set boolean class properties
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

  openArticle() {
    // const browser = this.iab.create('https://ionicframework.com/');
    //   browser.on('closePressed').subscribe(data => {
    //     browser.close();
    //   })
  }

  share() {
    
    if (!this.userHasRead) {
      this.presentToast("Articles must be read before they can be shared");
    }
    
    else {    
      
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("shares");
        shareRef1.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), sharedIsTrue: (true) });

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("activity");
        shareRef2.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), sharedIsTrue: (true) });

      const shareRef3 = this.afs.collection("articles").doc(this.titleID).collection("shares");
        shareRef3.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), sharedIsTrue: (true) });

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), sharedIsTrue: (true) });
        }
      })

      this.presentToast("Article shared");
  
    }
  }

  unshare() {
    if (this.userHasShared) {

      const unShareRef1 = this.afs.collection("users").doc(this.uid).collection("shares", ref => 
        ref.where('uid', '==', this.uid)
         .where('titleId', "==", this.titleID)).snapshotChanges();

      
    }

  }

  flag(flagType) {
    if (!this.userHasRead) {
      this.presentToast("Articles must be read before they can be flagged as biased");
    }
    
    else {
      
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("flags");
        shareRef1.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), flaggedIsTrue: (true) });

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("activity");
        shareRef2.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), flaggedIsTrue: (true) });

      const shareRef3 = this.afs.collection("articles").doc(this.title).collection("flags");
        shareRef3.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), flaggedIsTrue: (true) });

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), flaggedIsTrue: (true) });
        }
      })

      this.presentToast("Article flagged as biased");
    
  
  }

  }

  unflag() {
    //delete from flags, activity, followers activity using id with loops or collection group queries

  }

  send() {
    if (!this.userHasRead) {
      this.presentToast("Articles must be read before they can be sent to someone");
    }
    
    else {
      
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("sends");
        shareRef1.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), sentIsTrue: (true) });

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("activity");
        shareRef2.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), sentIsTrue: (true) });

      const shareRef3 = this.afs.collection("articles").doc(this.title).collection("sends");
        shareRef3.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), sentIsTrue: (true) });

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), sentIsTrue: (true) });
        }
      })

      this.presentToast("Article sent");
    
  
  }

  }

  newComment() {
    if (!this.userHasRead) {
      this.presentToast("Articles must be read before they can be commented on");
    }
    
    else {
      
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("comments");
        shareRef1.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("activity");
        shareRef2.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      const shareRef3 = this.afs.collection("articles").doc(this.title).collection("comments");
        shareRef3.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });
        }
      })

      this.presentToast("Comment posted");
    
  }

  }

  deleteComment() {
    //delete from comments, activity, followers activity using id with loops or collection group queries
  }

  likeComment() {
    if (!this.userHasRead) {
      this.presentToast("Articles must be read before they can be commented on");
    }
    
    else {
      
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("comments");
        shareRef1.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("activity");
        shareRef2.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      const shareRef3 = this.afs.collection("articles").doc(this.title).collection("comments");
        shareRef3.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });
        }
      })

      this.presentToast("Comment posted");
    
  }

  }

  unlikeComment() {
    //delete from commentLikes, activity, followers activity using id with loops or collection group queries

  }

  commentReply() {
    if (!this.userHasRead) {
      this.presentToast("Articles must be read before they can be commented on");
    }
    
    else {
      
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("comments");
        shareRef1.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("activity");
        shareRef2.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      const shareRef3 = this.afs.collection("articles").doc(this.title).collection("comments");
        shareRef3.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });
        }
      })

      this.presentToast("Comment posted");
    
  }

  }

  deleteCommentReply() {
    //delete from commentReplies, activity, followers activity using id with loops or collection group queries

  }

}