import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-comment-replies',
  templateUrl: './comment-replies.page.html',
  styleUrls: ['./comment-replies.page.scss'],
})
export class CommentRepliesPage implements OnInit {

  @Input() comments;

  followers;
  uid: string;
  date: Date;
  currentTime: number;
  displayName: string;
  photoUrl: string;
  comment: any;
  commentReply: any;
  commentReplies: any;

  constructor(private fireAuth: AngularFireAuth,
              private afs: AngularFirestore,
              public modalController: ModalController,
              public toastController: ToastController) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
        this.displayName = user.displayName
        this.photoUrl = user.photoURL
        this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges()
          .subscribe(followers => this.followers = followers);
          console.log(this.followers);
          console.log(this.comment);
          this.commentReplies = this.afs.collection("articles").doc(this.comment.titleID).collection("comments")
            .doc(this.comment.customIdName).collection("commentReplies").valueChanges({idField: 'customIdName'})
              .subscribe(replies => this.commentReplies = replies);
      }
    })
  }

  openUser($event, comment) {

  }

  likeComment($event, comment) {
    this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("likedComments");
        shareRef1.add({ uid: (this.uid), photoUrl: (this.photoUrl), publishDate: (comment.publishDate), publisher: (comment.publisher), displayName: (this.displayName), comment: (this.comment), createdAt: (this.currentTime), 
          title: (comment.title), titleID: (comment.titleID), docID: (comment.customIdName), likedCommentIsTrue: (true) })
          .then(()=> console.log("Like Comment"))
          .catch((err)=> console.log(" LikeComment Error: " + err));

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
        shareRef2.add({ uid: (this.uid), photoUrl: (this.photoUrl), publishDate: (comment.publishDate), publisher: (comment.publisher), displayName: (this.displayName), comment: (this.comment), createdAt: (this.currentTime), 
          title: (comment.title), titleID: (comment.titleID), likedCommentIsTrue: (true) })
          .then(()=> console.log("Like Comment"))
          .catch((err)=> console.log(" LikeComment Error: " + err));

      const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
        shareRef5.add({ uid: (this.uid), photoUrl: (this.photoUrl), publishDate: (comment.publishDate), publisher: (comment.publisher), displayName: (this.displayName), comment: (this.comment), createdAt: (this.currentTime), 
          title: (comment.title), titleID: (comment.titleID), likedCommentIsTrue: (true) })
          .then(()=> console.log("Like Comment"))
          .catch((err)=> console.log(" LikeComment Error: " + err));

      const shareRef3 = this.afs.collection("articles").doc(comment.titleID).collection("comments").doc(comment.customIdName).collection("commentLikes");
                                                              
        shareRef3.add({ uid: (this.uid), photoUrl: (this.photoUrl), publishDate: (comment.publishDate), publisher: (comment.publisher), displayName: (this.displayName), comment: (this.comment), createdAt: (this.currentTime), 
          title: (comment.title), titleID: (comment.titleID), likedCommentIsTrue: (true) })
          .then(()=> console.log("Like Comment"))
          .catch((err)=> console.log(" LikeComment Error: " + err));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), photoUrl: (this.photoUrl), publishDate: (comment.publishDate), publisher: (comment.publisher), displayName: (this.displayName), comment: (this.comment), createdAt: (this.currentTime), 
            title: (comment.title), titleID: (comment.titleID), likedCommentIsTrue: (true) })
            .then(()=> console.log("Like Comment"))
          .catch((err)=> console.log(" LikeComment Error: " + err));
        }
      })
      this.presentToast("Comment Liked!");
    
  }

  newComment() {
    console.log(this.commentReply);
    this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("commentReplies");
        shareRef1.add({ uid: (this.uid), displayName: (this.displayName), photoUrl: (this.photoUrl), createdAt: (this.currentTime), title: (this.comment.title), comment: (this.comment.comment),
          titleID: (this.comment.titleID), commentID: (this.comment.customIdName), reply: (this.commentReply), commentReplyIsTrue: (true), articleUrl: (this.comment.articleUrl), publishDate: (this.comment.publishDate), publisher: (this.comment.publisher) })
          .then(()=> console.log("Comment"))
          .catch((err)=> console.log("Comment Error: " + err));

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
        shareRef2.add({ uid: (this.uid), displayName: (this.displayName), photoUrl: (this.photoUrl), createdAt: (this.currentTime), title: (this.comment.title), comment: (this.comment.comment),
          titleID: (this.comment.titleID), commentID: (this.comment.customIdName), reply: (this.commentReply), commentReplyIsTrue: (true), articleUrl: (this.comment.articleUrl), publishDate: (this.comment.publishDate), publisher: (this.comment.publisher) })
          .then(()=> console.log("Comment"))
          .catch((err)=> console.log("Comment Error: " + err));

      const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
      shareRef5.add({ uid: (this.uid), displayName: (this.displayName), photoUrl: (this.photoUrl), createdAt: (this.currentTime), title: (this.comment.title), comment: (this.comment.comment),
        titleID: (this.comment.titleID), commentID: (this.comment.customIdName), reply: (this.commentReply), commentReplyIsTrue: (true), articleUrl: (this.comment.articleUrl), publishDate: (this.comment.publishDate), publisher: (this.comment.publisher) })
        .then(()=> console.log("Comment"))
          .catch((err)=> console.log("Comment Error: " + err));

      const shareRef3 = this.afs.collection("articles").doc(this.comment.titleID).collection("comments").doc(this.comment.customIdName).collection("commentReplies");
        shareRef3.add({ uid: (this.uid), displayName: (this.displayName), photoUrl: (this.photoUrl), createdAt: (this.currentTime), title: (this.comment.title), comment: (this.comment.comment),
          titleID: (this.comment.titleID), commentID: (this.comment.customIdName), reply: (this.commentReply), commentReplyIsTrue: (true), articleUrl: (this.comment.articleUrl), publishDate: (this.comment.publishDate), publisher: (this.comment.publisher) })
          .then(()=> console.log("Comment"))
          .catch((err)=> console.log("Comment Error: " + err));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), displayName: (this.displayName), photoUrl: (this.photoUrl), createdAt: (this.currentTime), title: (this.comment.title), comment: (this.comment.comment),
            titleID: (this.comment.titleID), commentID: (this.comment.customIdName), reply: (this.commentReply), commentReplyIsTrue: (true), articleUrl: (this.comment.articleUrl), publishDate: (this.comment.publishDate), publisher: (this.comment.publisher) })
            .then(()=> console.log("Comment to follower: " + result.followerUid))
          .catch((err)=> console.log("Comment Error: " + err));
        }
      })
      this.presentToast("Comment posted!");
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000
    });
    toast.present();
  }

  dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}