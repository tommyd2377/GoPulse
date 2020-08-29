import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { GlobalParamsService } from '../global-params.service';

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
  articleUrl: string;
  comment: string;
  titleID: string;
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
              public iab: InAppBrowser,
              public globalProps: GlobalParamsService) {
                this.globalProps.title = this.title;
                this.globalProps.articleUrl = this.articleUrl;
                this.globalProps.publishDate = this.publishDate;
                this.globalProps.publisher = this.publisher;
                this.globalProps.titleID = this.titleID;
               }

  ngOnInit() {
    //check for user actions and set boolean class properties
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        
        console.log(user.displayName);
        this.uid = user.uid;
        
        this.reads = this.afs.collection("articles").doc(this.titleID).collection("reads").valueChanges(); 
        this.shares = this.afs.collection("articles").doc(this.titleID).collection("shares").valueChanges();
        this.flags = this.afs.collection("articles").doc(this.titleID).collection("flags").valueChanges();
        this.sends = this.afs.collection("articles").doc(this.titleID).collection("sends").valueChanges();
        this.comments = this.afs.collection("articles").doc(this.titleID).collection("comments").valueChanges();
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

  openArticle() {
    // const browser = this.iab.create(this.articleUrl);
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

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
        shareRef2.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), sharedIsTrue: (true) });

      const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
        shareRef5.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), sharedIsTrue: (true) });

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
           .where('titleId', "==", this.titleID));
      unShareRef1.doc().delete().then(() => console.log("unshared"));
      
      const unShareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unShareRef2.doc().delete().then(() => console.log("unshared"));

      const unShareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unShareRef5.doc().delete().then(() => console.log("unshared"));
      
      const unShareRef3 = this.afs.collection("articles").doc(this.titleID).collection("shares", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unShareRef3.doc().delete().then(() => console.log("unshared"));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const unShareRef4 = this.afs.collection("articles").doc(result.followerUid).collection("followingActivity", ref => 
            ref.where('uid', '==', this.uid)
              .where('titleId', "==", this.titleID));
          unShareRef4.doc().delete().then(() => console.log("unshared"));
        }
      })
    }
  }

  flag() {
    if (!this.userHasRead) {
      this.presentToast("Articles must be read before they can be flagged as biased");
    }
    
    else {
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const flagRef1 = this.afs.collection("users").doc(this.uid).collection("flags");
        flagRef1.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), flaggedIsTrue: (true) });

      const flagRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
        flagRef2.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), flaggedIsTrue: (true) });

      const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
        shareRef5.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), flaggedIsTrue: (true) });

      const flagRef3 = this.afs.collection("articles").doc(this.title).collection("flags");
        flagRef3.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), flaggedIsTrue: (true) });

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const flagRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          flagRef4.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), flaggedIsTrue: (true) });
        }
      })
      this.presentToast("Article flagged as biased");
    }
  }

  unflag() {
    if (this.userHasFlagged) {

      const unFlagRef1 = this.afs.collection("users").doc(this.uid).collection("flags", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unFlagRef1.doc().delete().then(() => console.log("unflagged"));
      
      const unFlagRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unFlagRef2.doc().delete().then(() => console.log("unflagged"));

      const unFlagRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity", ref => 
        ref.where('uid', '==', this.uid)
          .where('titleId', "==", this.titleID));
      unFlagRef5.doc().delete().then(() => console.log("unflagged"));
      
      const unFlagRef3 = this.afs.collection("articles").doc(this.titleID).collection("flags", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unFlagRef3.doc().delete().then(() => console.log("unflagged"));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const unFlagRef4 = this.afs.collection("articles").doc(result.followerUid).collection("followingActivity", ref => 
            ref.where('uid', '==', this.uid)
               .where('titleId', "==", this.titleID));
          unFlagRef4.doc().delete().then(() => console.log("unflagged"));
        }
      })
    }
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

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
        shareRef2.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), sentIsTrue: (true) });

      const shareRef3 = this.afs.collection("articles").doc(this.title).collection("sends");
        shareRef3.add({ uid: (this.uid), createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), sentIsTrue: (true) });

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
        shareRef1.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
        shareRef2.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
      shareRef5.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
        title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      const shareRef3 = this.afs.collection("articles").doc(this.titleID).collection("comments");
        shareRef3.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
            title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });
        }
      })
      this.presentToast("Comment posted");
    }
  }

  deleteComment() {
    if (this.userHasFlagged) {

      const unFlagRef1 = this.afs.collection("users").doc(this.uid).collection("comments", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unFlagRef1.doc().delete().then(() => console.log("unflagged"));
      
      const unFlagRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unFlagRef2.doc().delete().then(() => console.log("unflagged"));

      const unFlagRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unFlagRef5.doc().delete().then(() => console.log("unflagged"));
      
      const unFlagRef3 = this.afs.collection("articles").doc(this.titleID).collection("comments", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unFlagRef3.doc().delete().then(() => console.log("unflagged"));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const unFlagRef4 = this.afs.collection("articles").doc(result.followerUid).collection("followingActivity", ref => 
            ref.where('uid', '==', this.uid)
               .where('titleId', "==", this.titleID));
          unFlagRef4.doc().delete().then(() => console.log("unflagged"));
        }
      })
    }
  }

  likeComment() {
    if (!this.userHasRead) {
      this.presentToast("Articles must be read before comments can be liked");
    }
    
    else {
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("comments");
        shareRef1.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
        shareRef2.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
        shareRef5.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      const shareRef3 = this.afs.collection("articles").doc(this.titleID).collection("comments", ref => 
                                                              ref.where('uid', '==', this.uid)
                                                                .where('titleId', "==", this.titleID)).doc().collection("commentLikes");
                                                              
        shareRef3.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
            title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });
        }
      })
      this.presentToast("Comment posted");
    }
  }

  unlikeComment() {
    if (this.userHasFlagged) {

      const unFlagRef1 = this.afs.collection("users").doc(this.uid).collection("flags", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unFlagRef1.doc().delete().then(() => console.log("unflagged"));
      
      const unFlagRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unFlagRef2.doc().delete().then(() => console.log("unflagged"));

      const unFlagRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity", ref => 
        ref.where('uid', '==', this.uid)
          .where('titleId', "==", this.titleID));
      unFlagRef5.doc().delete().then(() => console.log("unflagged"));
      
      const unFlagRef3 = this.afs.collection("articles").doc(this.titleID).collection("flags", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unFlagRef3.doc().delete().then(() => console.log("unflagged"));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const unFlagRef4 = this.afs.collection("articles").doc(result.followerUid).collection("followingActivity", ref => 
            ref.where('uid', '==', this.uid)
              .where('titleId', "==", this.titleID));
          unFlagRef4.doc().delete().then(() => console.log("unflagged"));
        }
      })
    }

  }

  commentReply() {
    if (!this.userHasRead) {
      this.presentToast("Articles must be read before they can be commented on");
    }
    
    else {
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("comments");
        shareRef1.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
        shareRef2.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
        shareRef5.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      const shareRef3 = this.afs.collection("articles").doc(this.title).collection("comments");
        shareRef3.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
            title: (this.title), titleID: (this.titleID), commentIsTrue: (true) });
        }
      })
      this.presentToast("Comment posted");
    }
  }

  deleteCommentReply() {
    if (this.userHasFlagged) {

      const unFlagRef1 = this.afs.collection("users").doc(this.uid).collection("flags", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unFlagRef1.doc().delete().then(() => console.log("unflagged"));
      
      const unFlagRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unFlagRef2.doc().delete().then(() => console.log("unflagged"));

      const unFlagRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unFlagRef5.doc().delete().then(() => console.log("unflagged"));
      
      const unFlagRef3 = this.afs.collection("articles").doc(this.titleID).collection("flags", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unFlagRef3.doc().delete().then(() => console.log("unflagged"));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const unFlagRef4 = this.afs.collection("articles").doc(result.followerUid).collection("followingActivity", ref => 
            ref.where('uid', '==', this.uid)
              .where('titleId', "==", this.titleID));
          unFlagRef4.doc().delete().then(() => console.log("unflagged"));
        }
      })
    }
  }

}