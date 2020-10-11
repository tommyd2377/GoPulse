import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { GlobalParamsService } from '../global-params.service';
import { SendToPage } from '../send-to/send-to.page';

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
  photoUrl: string;
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
  followers;
  date: Date;
  currentTime: number;
  commentId: string;
  readCount: any;
  shareCount: any;
  isAnonymous: boolean;
  flagCount: any;
  sendCount: any;
  commentCount: any;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              public route: ActivatedRoute,
              private afs: AngularFirestore,
              public toastController: ToastController,
              public modalController: ModalController,
              public iab: InAppBrowser,
              public globalProps: GlobalParamsService,
              public analytics: AngularFireAnalytics) {
                console.log(this.globalProps)
                this.title = this.globalProps.title;
                this.articleUrl = this.globalProps.articleUrl;
                this.publishDate = this.globalProps.publishDate;
                this.publisher = this.globalProps.publisher;
                this.titleID = this.globalProps.titleID;
                this.isAnonymous = this.globalProps.isAnonymous;
              }

  ngOnInit() {
    console.log("anonymous" + this.isAnonymous);
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        
        this.uid = user.uid;
        this.displayName = user.displayName;
        this.photoUrl = user.photoURL;

        this.readCount = this.afs.collection("articles").doc(this.titleID).collection("reads").valueChanges();
        
        this.reads = this.afs.collection("articles").doc(this.titleID).collection("reads").valueChanges()
          .subscribe(results => {
            for (let result of results) { 
              if (result.uid === this.uid) {
                  this.userHasRead = true;
              }
              else {
                this.userHasRead = false;
              }
              console.log("userhasread" + this.userHasRead);
            }
        });

        this.shareCount = this.afs.collection("articles").doc(this.titleID).collection("shares").valueChanges();
        
        this.shares = this.afs.collection("articles").doc(this.titleID).collection("shares").valueChanges()
          .subscribe(results => {
            for (let result of results) { 
              if (result.uid === this.uid) {
                  this.userHasShared = true;
              }
              else {
                this.userHasShared = false;
              }
              console.log("userhasshared" + this.userHasRead);
            }
        });

        this.flagCount = this.afs.collection("articles").doc(this.titleID).collection("flags").valueChanges();
        
        this.flags = this.afs.collection("articles").doc(this.titleID).collection("flags").valueChanges()
            .subscribe(results => {
              for (let result of results) { 
                if (result.uid === this.uid) {
                    this.userHasFlagged = true;
                }
                else {
                  this.userHasFlagged = false;
                }
                console.log("userhasflagged" + this.userHasRead);
              }
        });
          
        this.sendCount = this.afs.collection("articles").doc(this.titleID).collection("sends").valueChanges();

        this.commentCount = this.afs.collection("articles").doc(this.titleID).collection("comments").valueChanges();
        
        this.comments = this.afs.collection("articles").doc(this.titleID).collection("comments").valueChanges()
          .subscribe(comments => this.comments = comments);
        
          
      }
    })
    console.log("userhasread " + this.userHasRead);
    console.log("comments " + this.comments);
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000
    });
    toast.present();
  }

   async presentModal() {
    if (this.userHasRead) { 
      const modal = await this.modalController.create({
        component: SendToPage,
        componentProps: {
          'title': this.title,
          'titleID': this.titleID,
          'articleUrl': this.articleUrl,
          'publishDate': this.publishDate,
          'publisher': this.publisher,
        }
      });
      return await modal.present();
    }
    else {
      this.presentToast("Articles must be read before they can be sent to someone");
    }
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

    this.analytics.logEvent("article read", {["uid"]: this.uid});
  }

  openUser($event, comment) {
    this.router.navigateByUrl("tabs/" + this.globalProps.currentTab + "/user/" + comment.uid);
  }

  share() {
     if (this.userHasRead) {    

      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("shares");
        shareRef1.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), photoUrl: (this.photoUrl),
           titleID: (this.titleID), sharedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
              .then(()=> console.log("Shared"))
              .catch((err)=> console.log("Shared Error: " + err));

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
        shareRef2.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), photoUrl: (this.photoUrl),
          titleID: (this.titleID), sharedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Shared"))
          .catch((err)=> console.log("Shared Error: " + err));

      const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
        shareRef5.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), photoUrl: (this.photoUrl),
          titleID: (this.titleID), sharedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Shared"))
          .catch((err)=> console.log("Shared Error: " + err));

      const shareRef3 = this.afs.collection("articles").doc(this.titleID).collection("shares");
        shareRef3.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), photoUrl: (this.photoUrl),
          titleID: (this.titleID), sharedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Shared"))
          .catch((err)=> console.log("Shared Error: " + err));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), photoUrl: (this.photoUrl),
            titleID: (this.titleID), sharedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
          .then(()=> console.log("Shared to follower: " + result.followerUid))
          .catch((err)=> console.log("Shared Error: " + err));
        }
      })
      this.userHasShared = true;
      this.presentToast("Article shared!");
    }
    else if (this.userHasRead) {    

      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef3 = this.afs.collection("articles").doc(this.titleID).collection("shares");
        shareRef3.add({ displayName: ("A person you're following"), createdAt: (this.currentTime), title: (this.title),
          titleID: (this.titleID), sharedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Shared"))
          .catch((err)=> console.log("Shared Error: " + err));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ displayName: ("A person you're following"), createdAt: (this.currentTime), title: (this.title),
            titleID: (this.titleID), sharedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
          .then(()=> console.log("Shared to follower: " + result.followerUid))
          .catch((err)=> console.log("Shared Error: " + err));
        }
      })
      this.userHasShared = true;
      this.presentToast("Article anonymously shared");
    }
    else if (!this.userHasRead) {
      console.log("else if" + this.isAnonymous)
      this.presentToast("Articles must be read before they can be shared");
    }
    else {
      console.log("else" + this.isAnonymous)
      this.presentToast("Articles must be read before they can be shared");
    }
   
  }

  unShare() {
    if (this.userHasShared) {
      const unShareRef1 = this.afs.collection("users").doc(this.uid).collection("shares", ref => 
        ref.where('titleID', "==", this.titleID)).valueChanges();
      console.log(unShareRef1.subscribe(data => console.log(data.values())))

    }
      
      // const unShareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity", ref => 
      //   ref.where('uid', '==', this.uid)
      //      .where('titleID', "==", this.titleID));
      // unShareRef2.doc().delete().then(() => console.log("unshared"));

      // const unShareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity", ref => 
      //   ref.where('uid', '==', this.uid)
      //      .where('titleID', "==", this.titleID));
      // unShareRef5.doc().delete().then(() => console.log("unshared"));
      
      // const unShareRef3 = this.afs.collection("articles").doc(this.titleID).collection("shares", ref => 
      //   ref.where('uid', '==', this.uid)
      //      .where('titleID', "==", this.titleID));
      // unShareRef3.doc().delete().then(() => console.log("unshared"));

      // this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      // this.followers.subscribe(results => {
      //   for (let result of results) { 
      //     const unShareRef4 = this.afs.collection("articles").doc(result.followerUid).collection("followingActivity", ref => 
      //       ref.where('uid', '==', this.uid)
      //         .where('titleID', "==", this.titleID));
      //     unShareRef4.doc().delete().then(() => console.log("unshared"));
      //   }
      // })
      // this.userHasShared = false;
  }

  flag() {
    if (this.userHasRead) {
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const flagRef1 = this.afs.collection("users").doc(this.uid).collection("flags");
        flagRef1.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), photoUrl: (this.photoUrl),
          titleID: (this.titleID), flaggedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Flagged"))
          .catch((err)=> console.log("Flagged Error: " + err));

      const flagRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
        flagRef2.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), photoUrl: (this.photoUrl),
          titleID: (this.titleID), flaggedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Flagged"))
          .catch((err)=> console.log("Flagged Error: " + err));

      const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
        shareRef5.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), photoUrl: (this.photoUrl),
          titleID: (this.titleID), flaggedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Flagged"))
          .catch((err)=> console.log("Flagged Error: " + err));

      const flagRef3 = this.afs.collection("articles").doc(this.titleID).collection("flags");
        flagRef3.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), photoUrl: (this.photoUrl),
          titleID: (this.titleID), flaggedIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Flagged"))
          .catch((err)=> console.log("Flagged Error: " + err));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const flagRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          flagRef4.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), photoUrl: (this.photoUrl),
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

  unFlag() {
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

  newComment() {
    if (this.userHasRead) {
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const id = this.afs.createId();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("comments");
        shareRef1.add({ uid: (this.uid), displayName: (this.displayName), photoUrl: (this.photoUrl), createdAt: (this.currentTime), title: (this.title), comment: (this.comment),
          titleID: (this.titleID), commentIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
          .then(()=> console.log("Comment"))
          .catch((err)=> console.log("Comment Error: " + err));

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
        shareRef2.add({ uid: (this.uid), displayName: (this.displayName), photoUrl: (this.photoUrl), createdAt: (this.currentTime), title: (this.title), comment: (this.comment),
          titleID: (this.titleID), commentIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
          .then(()=> console.log("Comment"))
          .catch((err)=> console.log("Comment Error: " + err));

      const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
      shareRef5.add({ uid: (this.uid), displayName: (this.displayName), photoUrl: (this.photoUrl), createdAt: (this.currentTime), title: (this.title), comment: (this.comment),
        titleID: (this.titleID), commentIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Comment"))
          .catch((err)=> console.log("Comment Error: " + err));

      const shareRef3 = this.afs.collection("articles").doc(this.titleID).collection("comments");
        shareRef3.add({ uid: (this.uid), displayName: (this.displayName), photoUrl: (this.photoUrl), createdAt: (this.currentTime), title: (this.title), comment: (this.comment),
          titleID: (this.titleID), commentIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
          .then(()=> console.log("Comment"))
          .catch((err)=> console.log("Comment Error: " + err));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), displayName: (this.displayName), photoUrl: (this.photoUrl), createdAt: (this.currentTime), title: (this.title), comment: (this.comment),
            titleID: (this.titleID), commentIsTrue: (true), articleUrl: (this.articleUrl), publishDate: (this.publishDate), publisher: (this.publisher) })
            .then(()=> console.log("Comment to follower: " + result.followerUid))
          .catch((err)=> console.log("Comment Error: " + err));
        }
      })
      this.presentToast("Comment posted!");
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
    console.log("commentLike event & comment data: " + $event, comment);

    if (!this.userHasRead) {
      this.presentToast("Articles must be read before comments can be liked");
    }
    
    else {
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("comments").doc(comment.id).collection("commentLikes");
        shareRef1.add({ uid: (this.uid), photoUrl: (this.photoUrl), displayName: (this.displayName), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) })
          .then(()=> console.log("Like Comment"))
          .catch((err)=> console.log(" LikeComment Error: " + err));

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity").doc(comment.id).collection("commentLikes");
        shareRef2.add({ uid: (this.uid), photoUrl: (this.photoUrl), displayName: (this.displayName), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) })
          .then(()=> console.log("Like Comment"))
          .catch((err)=> console.log(" LikeComment Error: " + err));

      const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity").doc(comment.id).collection("commentLikes");
        shareRef5.add({ uid: (this.uid), photoUrl: (this.photoUrl), displayName: (this.displayName), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) })
          .then(()=> console.log("Like Comment"))
          .catch((err)=> console.log(" LikeComment Error: " + err));

      const shareRef3 = this.afs.collection("articles").doc(this.titleID).collection("comments").doc(comment.id).collection("commentLikes");
                                                              
        shareRef3.add({ uid: (this.uid), photoUrl: (this.photoUrl), displayName: (this.displayName), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) })
          .then(()=> console.log("Like Comment"))
          .catch((err)=> console.log(" LikeComment Error: " + err));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), photoUrl: (this.photoUrl), displayName: (this.displayName), comment: (this.comment), createdAt: (this.currentTime), 
            title: (this.title), titleID: (this.titleID), commentIsTrue: (true) })
            .then(()=> console.log("Like Comment"))
          .catch((err)=> console.log(" LikeComment Error: " + err));
        }
      })
      this.presentToast("Comment Liked!");
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
        shareRef1.add({ uid: (this.uid), photoUrl: (this.photoUrl), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) })
          .then(()=> console.log("Comment Reply Added"))
          .catch((err)=> console.log("Comment Reply Error: " + err));

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
        shareRef2.add({ uid: (this.uid), photoUrl: (this.photoUrl), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) })
          .then(()=> console.log("Comment Reply Added"))
          .catch((err)=> console.log("Comment Reply Error: " + err));

      const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
        shareRef5.add({ uid: (this.uid), photoUrl: (this.photoUrl), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) })
          .then(()=> console.log("Comment Reply Added"))
          .catch((err)=> console.log("Comment Reply Error: " + err));

      const shareRef3 = this.afs.collection("articles").doc(this.title).collection("comments");
        shareRef3.add({ uid: (this.uid), photoUrl: (this.photoUrl), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), commentIsTrue: (true) })
          .then(()=> console.log("Comment Reply Added"))
          .catch((err)=> console.log("Comment Reply Error: " + err));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), photoUrl: (this.photoUrl), comment: (this.comment), createdAt: (this.currentTime), 
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