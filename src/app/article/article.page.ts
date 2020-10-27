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
import { CommentRepliesPage } from '../comment-replies/comment-replies.page';

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
  flagCount: any;
  sendCount: any;
  commentCount: any;
  commentLikeCount: any;
  commentLikeCounts: any;
  commentReplyCounts: any;
  commentReplyCount: any;

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
              }

  ngOnInit() {
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

        this.comments = this.afs.collection("articles").doc(this.titleID).collection("comments").valueChanges({idField: 'customIdName'})
          .subscribe(comments => this.comments = comments)

          this.commentLikeCounts = this.afs.collection("articles").doc(this.titleID).collection("comments").valueChanges({idField: 'customIdName'})
              .subscribe(comments => {
                for (let comment of comments) { 
                  this.commentLikeCount = this.afs.collection("articles").doc(this.titleID).collection("comments").doc(comment.customIdName).collection("commentLikes");
                  }
            });

            this.commentReplyCounts = this.afs.collection("articles").doc(this.titleID).collection("comments").valueChanges({idField: 'customIdName'})
              .subscribe(comments => {
                for (let comment of comments) { 
                  this.commentReplyCount = this.afs.collection("articles").doc(this.titleID).collection("comments").doc(comment.customIdName).collection("commentReplies");
                  }
            });
        
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

  async openReplies($event, comments) {
      const modal = await this.modalController.create({
        component: CommentRepliesPage,
        componentProps: {
          comment: comments
        }
      });
      return await modal.present();
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

    else if (!this.userHasRead) {
      this.presentToast("Articles must be read before they can be shared");
    }
    else {
      this.presentToast("Articles must be read before they can be shared");
    }
   
  }

  unShare() {
    
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
   
  }

  newComment() {
    if (this.userHasRead) {
      this.date = new Date();
      this.currentTime = this.date.getTime();

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
    
  }

  likeComment($event, comment) {

    if (!this.userHasRead) {
      this.presentToast("Articles must be read before comments can be liked");
    }
    
    else {
      console.log("commentLike event & comment data: " + $event, comment);
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("likedComments");
        shareRef1.add({ uid: (this.uid), photoUrl: (this.photoUrl), publishDate: (this.publishDate), publisher: (this.publisher), displayName: (this.displayName), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), docID: (comment.customIdName), likedCommentIsTrue: (true) })
          .then(()=> console.log("Like Comment"))
          .catch((err)=> console.log(" LikeComment Error: " + err));

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
        shareRef2.add({ uid: (this.uid), photoUrl: (this.photoUrl), publishDate: (this.publishDate), publisher: (this.publisher), displayName: (this.displayName), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), likedCommentIsTrue: (true) })
          .then(()=> console.log("Like Comment"))
          .catch((err)=> console.log(" LikeComment Error: " + err));

      const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
        shareRef5.add({ uid: (this.uid), photoUrl: (this.photoUrl), publishDate: (this.publishDate), publisher: (this.publisher), displayName: (this.displayName), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), likedCommentIsTrue: (true) })
          .then(()=> console.log("Like Comment"))
          .catch((err)=> console.log(" LikeComment Error: " + err));

      const shareRef3 = this.afs.collection("articles").doc(this.titleID).collection("comments").doc(comment.customIdName).collection("commentLikes");
                                                              
        shareRef3.add({ uid: (this.uid), photoUrl: (this.photoUrl), publishDate: (this.publishDate), publisher: (this.publisher), displayName: (this.displayName), comment: (this.comment), createdAt: (this.currentTime), 
          title: (this.title), titleID: (this.titleID), likedCommentIsTrue: (true) })
          .then(()=> console.log("Like Comment"))
          .catch((err)=> console.log(" LikeComment Error: " + err));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), photoUrl: (this.photoUrl), publishDate: (this.publishDate), publisher: (this.publisher), displayName: (this.displayName), comment: (this.comment), createdAt: (this.currentTime), 
            title: (this.title), titleID: (this.titleID), likedCommentIsTrue: (true) })
            .then(()=> console.log("Like Comment"))
          .catch((err)=> console.log(" LikeComment Error: " + err));
        }
      })
      this.presentToast("Comment Liked!");
    }
  }

  unlikeComment($event, comment) {

  }

}