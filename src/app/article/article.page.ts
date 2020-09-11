import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { GlobalParamsService } from '../global-params.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.page.html',
  styleUrls: ['./article.page.scss'],
})

export class ArticlePage implements OnInit {
  
  userHasRead: boolean;
  userHasShared: boolean;
  userHasFlagged: boolean;
  uid: string;
  displayName: string;
  title: string;
  publisher: string;
  publishDate: string;
  articleUrl: string;
  comment: string;
  titleID: string;
  reads;
  shares;
  flags;
  comments;
  commentLikes;
  commentReplies;
  sends;
  followers;
  date: Date;
  currentTime: number;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              public route: ActivatedRoute,
              private afs: AngularFirestore,
              public toastController: ToastController,
              public iab: InAppBrowser,
              public globalProps: GlobalParamsService) {
                console.log(this.globalProps)
                this.title = this.globalProps.title;
                this.articleUrl = this.globalProps.articleUrl;
                this.publishDate = this.globalProps.publishDate;
                this.publisher = this.globalProps.publisher;
                this.titleID = this.globalProps.titleID;
               }

  ngOnInit() {
    console.log(this.globalProps.currentTab)
    //check for user actions and set boolean class properties
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
        this.displayName = user.displayName;
        this.reads = this.afs.collection("articles").doc(this.titleID).collection("reads").valueChanges(); 
        this.shares = this.afs.collection("articles").doc(this.titleID).collection("shares").valueChanges();
        this.flags = this.afs.collection("articles").doc(this.titleID).collection("flags").valueChanges();
        this.sends = this.afs.collection("articles").doc(this.titleID).collection("sends").valueChanges();
        
        this.comments = this.afs.collection("articles").doc(this.titleID).collection("comments").valueChanges()
          .subscribe(comments => this.comments = comments);
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
    this.iab.create(this.articleUrl);
    this.userHasRead = true;
    this.date = new Date();
      this.currentTime = this.date.getTime();

    const shareRef1 = this.afs.collection("users").doc(this.uid).collection("reads");
      shareRef1.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title),
        titleID: (this.titleID), readIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
          .then(()=> console.log("Read"))
          .catch((err)=> console.log("Read Error: " + err));

    const shareRef3 = this.afs.collection("articles").doc(this.titleID).collection("reads");
      shareRef3.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title),
        titleID: (this.titleID), readIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
          .then(()=> console.log("Read"))
          .catch((err)=> console.log("Read Error: " + err));
  }

  openUser($event, comment) {
    this.router.navigateByUrl("tabs/" + this.globalProps.currentTab + "/user/" + comment.uid);
  }

  share() {
     if (this.userHasRead) {    
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("shares");
        shareRef1.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title),
           titleID: (this.titleID), sharedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
              .then(()=> console.log("Shared"))
              .catch((err)=> console.log("Shared Error: " + err));

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
        shareRef2.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title),
          titleID: (this.titleID), sharedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Shared"))
          .catch((err)=> console.log("Shared Error: " + err));

      const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
        shareRef5.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title),
          titleID: (this.titleID), sharedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Shared"))
          .catch((err)=> console.log("Shared Error: " + err));

      const shareRef3 = this.afs.collection("articles").doc(this.titleID).collection("shares");
        shareRef3.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title),
          titleID: (this.titleID), sharedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Shared"))
          .catch((err)=> console.log("Shared Error: " + err));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title),
            titleID: (this.titleID), sharedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
          .then(()=> console.log("Shared to follower: " + result.followerUid))
          .catch((err)=> console.log("Shared Error: " + err));
        }
      })
      this.userHasShared = true;
      this.presentToast("Article shared");
    }
    else if (!this.userHasRead) {
      this.presentToast("Articles must be read before they can be shared");
    }
    else {
      this.presentToast("Articles must be read before they can be shared");
    }
   
  }

  unshare() {
      const unShareRef1 = this.afs.collection("users").doc(this.uid).collection("shares", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleID', "==", this.titleID));
      unShareRef1.doc().delete().then(() => console.log("unshared"));
      
      const unShareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleID', "==", this.titleID));
      unShareRef2.doc().delete().then(() => console.log("unshared"));

      const unShareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleID', "==", this.titleID));
      unShareRef5.doc().delete().then(() => console.log("unshared"));
      
      const unShareRef3 = this.afs.collection("articles").doc(this.titleID).collection("shares", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleID', "==", this.titleID));
      unShareRef3.doc().delete().then(() => console.log("unshared"));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const unShareRef4 = this.afs.collection("articles").doc(result.followerUid).collection("followingActivity", ref => 
            ref.where('uid', '==', this.uid)
              .where('titleID', "==", this.titleID));
          unShareRef4.doc().delete().then(() => console.log("unshared"));
        }
      })
      this.userHasShared = false;
  }

  flag() {
    
    if (this.userHasRead) {
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const flagRef1 = this.afs.collection("users").doc(this.uid).collection("flags");
        flagRef1.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title),
          titleID: (this.titleID), flaggedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Flagged"))
          .catch((err)=> console.log("Flagged Error: " + err));

      const flagRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
        flagRef2.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title),
          titleID: (this.titleID), flaggedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Flagged"))
          .catch((err)=> console.log("Flagged Error: " + err));

      const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
        shareRef5.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title),
          titleID: (this.titleID), flaggedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Flagged"))
          .catch((err)=> console.log("Flagged Error: " + err));

      const flagRef3 = this.afs.collection("articles").doc(this.title).collection("flags");
        flagRef3.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title),
          titleID: (this.titleID), flaggedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Flagged"))
          .catch((err)=> console.log("Flagged Error: " + err));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const flagRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          flagRef4.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title),
            titleID: (this.titleID), flaggedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
          .then(()=> console.log("Flagged to follower: " + result.followerUid))
          .catch((err)=> console.log("Flagged Error: " + err));
        }
      })
      this.presentToast("Article flagged as biased");
      this.userHasFlagged = true;
    }
    else if (!this.userHasRead) {
      this.presentToast("Articles must be read before they can be flagged as biased");
    }
    else {
      this.presentToast("Articles must be read before they can be flagged as biased");
    }
  }

  unflag() {
    if (this.userHasFlagged) {

      const unFlagRef1 = this.afs.collection("users").doc(this.uid).collection("flags", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleID', "==", this.titleID));
      unFlagRef1.doc().delete().then(() => console.log("unflagged"));
      
      const unFlagRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleID', "==", this.titleID));
      unFlagRef2.doc().delete().then(() => console.log("unflagged"));

      const unFlagRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity", ref => 
        ref.where('uid', '==', this.uid)
          .where('titleID', "==", this.titleID));
      unFlagRef5.doc().delete().then(() => console.log("unflagged"));
      
      const unFlagRef3 = this.afs.collection("articles").doc(this.titleID).collection("flags", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleID', "==", this.titleID));
      unFlagRef3.doc().delete().then(() => console.log("unflagged"));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const unFlagRef4 = this.afs.collection("articles").doc(result.followerUid).collection("followingActivity", ref => 
            ref.where('uid', '==', this.uid)
               .where('titleID', "==", this.titleID));
          unFlagRef4.doc().delete().then(() => console.log("unflagged"));
        }
      })
      this.userHasFlagged = false;
    }
  }

  send($event) {  
    if (this.userHasRead) {
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("sends");
        shareRef1.add({ senderUid: (this.uid), senderDisplayName: (this.displayName), sendeeUid: (this.uid), sendeeDisplayName: (this.displayName),
           createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), sentIsTrue: (true), articleUrl: (this.articleUrl),
            publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Sent"))
          .catch((err)=> console.log("Sent Error: " + err));

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
      shareRef2.add({ senderUid: (this.uid), senderDisplayName: (this.displayName), sendeeUid: (this.uid), sendeeDisplayName: (this.displayName),
        createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), sentIsTrue: (true), articleUrl: (this.articleUrl),
         publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Sent"))
          .catch((err)=> console.log("Sent Error: " + err));

      const shareRef4 = this.afs.collection("users").doc(this.uid).collection("sends");
      shareRef4.add({ senderUid: (this.uid), senderDisplayName: (this.displayName), sendeeUid: (this.uid), sendeeDisplayName: (this.displayName),
        createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), sentIsTrue: (true), articleUrl: (this.articleUrl),
         publishDate: (this.publishDate), publisher: (this.publisher) })
      .then(()=> console.log("Sent"))
        .catch((err)=> console.log("Sent Error: " + err));

    const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
    shareRef5.add({ senderUid: (this.uid), senderDisplayName: (this.displayName), sendeeUid: (this.uid), sendeeDisplayName: (this.displayName),
      createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), sentIsTrue: (true), articleUrl: (this.articleUrl),
       publishDate: (this.publishDate), publisher: (this.publisher) })
      .then(()=> console.log("Sent"))
        .catch((err)=> console.log("Sent Error: " + err));

      const shareRef3 = this.afs.collection("articles").doc(this.title).collection("sends");
      shareRef3.add({ senderUid: (this.uid), senderDisplayName: (this.displayName), sendeeUid: (this.uid), sendeeDisplayName: (this.displayName),
        createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), sentIsTrue: (true), articleUrl: (this.articleUrl),
         publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Sent"))
          .catch((err)=> console.log("Sent Error: " + err));

      this.presentToast("Article sent");
    }

    else if (!this.userHasRead) {
      this.presentToast("Articles must be read before they can be sent to someone");
    }

    else {
      this.presentToast("Articles must be read before they can be sent to someone");
    }
  }

  newComment() {
    if (this.userHasRead) {
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("comments");
        shareRef1.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), comment: (this.comment),
          titleID: (this.titleID), commentIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
          .then(()=> console.log("Comment"))
          .catch((err)=> console.log("Comment Error: " + err));

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
        shareRef2.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), comment: (this.comment),
          titleID: (this.titleID), commentIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
          .then(()=> console.log("Comment"))
          .catch((err)=> console.log("Comment Error: " + err));

      const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
      shareRef5.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), comment: (this.comment),
        titleID: (this.titleID), commentIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Comment"))
          .catch((err)=> console.log("Comment Error: " + err));

      const shareRef3 = this.afs.collection("articles").doc(this.titleID).collection("comments");
        shareRef3.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), comment: (this.comment),
          titleID: (this.titleID), commentIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
          .then(()=> console.log("Comment"))
          .catch((err)=> console.log("Comment Error: " + err));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), comment: (this.comment),
            titleID: (this.titleID), commentIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
            .then(()=> console.log("Comment to follower: " + result.followerUid))
          .catch((err)=> console.log("Comment Error: " + err));
        }
      })
      this.presentToast("Comment posted");
    }
    else if (!this.userHasRead) {
      this.presentToast("Articles must be read before they can be commented on");
    }
    else {
      this.presentToast("Articles must be read before they can be commented on");
    }
    
    
  }

  deleteComment() {
    if (this.userHasFlagged) {

      const unFlagRef1 = this.afs.collection("users").doc(this.uid).collection("comments", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleID', "==", this.titleID));
      unFlagRef1.doc().delete().then(() => console.log("comment deleted"));
      
      const unFlagRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleID', "==", this.titleID));
      unFlagRef2.doc().delete().then(() => console.log("comment deleted"));

      const unFlagRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleID', "==", this.titleID));
      unFlagRef5.doc().delete().then(() => console.log("comment deleted"));
      
      const unFlagRef3 = this.afs.collection("articles").doc(this.titleID).collection("comments", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleID', "==", this.titleID));
      unFlagRef3.doc().delete().then(() => console.log("comment deleted"));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const unFlagRef4 = this.afs.collection("articles").doc(result.followerUid).collection("followingActivity", ref => 
            ref.where('uid', '==', this.uid)
               .where('titleID', "==", this.titleID));
          unFlagRef4.doc().delete().then(() => console.log("comment deleted"));
        }
      })
    }
  }

  likeComment($event, comment) {
    if (!this.userHasRead) {
      this.presentToast("Articles must be read before comments can be liked");
    }
    
    else {
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("comments").doc().collection("commentLikes");
        shareRef1.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) })
          .then(()=> console.log("Like Comment"))
          .catch((err)=> console.log(" LikeComment Error: " + err));

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
        shareRef2.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) })
          .then(()=> console.log("Like Comment"))
          .catch((err)=> console.log(" LikeComment Error: " + err));

      const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
        shareRef5.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) })
          .then(()=> console.log("Like Comment"))
          .catch((err)=> console.log(" LikeComment Error: " + err));

      const shareRef3 = this.afs.collection("articles").doc(this.titleID).collection("comments", ref => 
                                                              ref.where('uid', '==', this.uid)
                                                                .where('titleId', "==", this.titleID)).doc().collection("commentLikes");
                                                              
        shareRef3.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) })
          .then(()=> console.log("Like Comment"))
          .catch((err)=> console.log(" LikeComment Error: " + err));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
            title: (this.title), titleID: (this.titleID), commentIsTrue: (true) })
            .then(()=> console.log("Like Comment"))
          .catch((err)=> console.log(" LikeComment Error: " + err));
        }
      })
      this.presentToast("Comment posted");
    }
  }

  unlikeComment($event, comment) {
    if (this.userHasFlagged) {

      const unFlagRef1 = this.afs.collection("users").doc(this.uid).collection("flags", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unFlagRef1.doc().delete().then(() => console.log("unLiked"));
      
      const unFlagRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unFlagRef2.doc().delete().then(() => console.log("unLiked"));

      const unFlagRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity", ref => 
        ref.where('uid', '==', this.uid)
          .where('titleId', "==", this.titleID));
      unFlagRef5.doc().delete().then(() => console.log("unLiked"));
      
      const unFlagRef3 = this.afs.collection("articles").doc(this.titleID).collection("flags", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unFlagRef3.doc().delete().then(() => console.log("unLiked"));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const unFlagRef4 = this.afs.collection("articles").doc(result.followerUid).collection("followingActivity", ref => 
            ref.where('uid', '==', this.uid)
              .where('titleId', "==", this.titleID));
          unFlagRef4.doc().delete().then(() => console.log("unLiked"));
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
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) })
          .then(()=> console.log("Comment Reply Added"))
          .catch((err)=> console.log("Comment Reply Error: " + err));

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
        shareRef2.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) })
          .then(()=> console.log("Comment Reply Added"))
          .catch((err)=> console.log("Comment Reply Error: " + err));

      const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
        shareRef5.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) })
          .then(()=> console.log("Comment Reply Added"))
          .catch((err)=> console.log("Comment Reply Error: " + err));

      const shareRef3 = this.afs.collection("articles").doc(this.title).collection("comments");
        shareRef3.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) })
          .then(()=> console.log("Comment Reply Added"))
          .catch((err)=> console.log("Comment Reply Error: " + err));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), comment: (this.comment), createdAt: (this.currentTime), 
            title: (this.title), titleID: (this.titleID), commentIsTrue: (true) })
            .then(()=> console.log("Comment Reply Added"))
            .catch((err)=> console.log("Comment Reply Error: " + err));
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
      unFlagRef1.doc().delete().then(() => console.log("reply deleted"));
      
      const unFlagRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unFlagRef2.doc().delete().then(() => console.log("reply deleted"));

      const unFlagRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unFlagRef5.doc().delete().then(() => console.log("reply deleted"));
      
      const unFlagRef3 = this.afs.collection("articles").doc(this.titleID).collection("flags", ref => 
        ref.where('uid', '==', this.uid)
           .where('titleId', "==", this.titleID));
      unFlagRef3.doc().delete().then(() => console.log("reply deleted"));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const unFlagRef4 = this.afs.collection("articles").doc(result.followerUid).collection("followingActivity", ref => 
            ref.where('uid', '==', this.uid)
              .where('titleId', "==", this.titleID));
          unFlagRef4.doc().delete().then(() => console.log("reply deleted"));
        }
      })
    }
  }

}