import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-send-to',
  templateUrl: './send-to.page.html',
  styleUrls: ['./send-to.page.scss'],
})

export class SendToPage implements OnInit {

  @Input() title: string;
  @Input() titleID: string;
  @Input() articleUrl: string;
  @Input() publishDate: string;
  @Input() publisher: string;

  followers;
  uid: string;
  date: Date;
  currentTime: number;
  displayName: string;
  photoUrl: string;

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
          .subscribe(followers => this.followers = followers)
          console.log(this.followers)
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

  sendArticle($event, follower) { 
    this.date = new Date();
    this.currentTime = this.date.getTime();

    const shareRef1 = this.afs.collection("users").doc(this.uid).collection("sends");
      shareRef1.add({ senderUid: (this.uid), senderDisplayName: (this.displayName), senderPhotoUrl: (this.photoUrl), 
        sendeeUid: (follower.followerUid), sendeePhotoUrl: (follower.followerPhotoUrl), sendeeDisplayName: (follower.followerDisplayName),
         createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), sentIsTrue: (true), articleUrl: (this.articleUrl),
          publishDate: (this.publishDate), publisher: (this.publisher) })
      .then(()=> console.log("Sent"))
        .catch((err)=> console.log("Sent Error: " + err));

    const shareRef2 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
    shareRef2.add({ senderUid: (this.uid), senderDisplayName: (this.displayName), senderPhotoUrl: (this.photoUrl), 
      sendeeUid: (follower.followerUid), sendeePhotoUrl: (follower.followerPhotoUrl), sendeeDisplayName: (follower.followerDisplayName),
      createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), sentIsTrue: (true), articleUrl: (this.articleUrl),
       publishDate: (this.publishDate), publisher: (this.publisher) })
      .then(()=> console.log("Sent"))
        .catch((err)=> console.log("Sent Error: " + err));

    const shareRef4 = this.afs.collection("users").doc(follower.followerUid).collection("sends");
    shareRef4.add({ senderUid: (this.uid), senderDisplayName: (this.displayName), senderPhotoUrl: (this.photoUrl), 
      sendeeUid: (follower.followerUid), sendeePhotoUrl: (follower.followerPhotoUrl), sendeeDisplayName: (follower.followerDisplayName),
      createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), recievedIsTrue: (true), articleUrl: (this.articleUrl),
       publishDate: (this.publishDate), publisher: (this.publisher) })
    .then(()=> console.log("Sent"))
      .catch((err)=> console.log("Sent Error: " + err));

    const shareRef6 = this.afs.collection("users").doc(follower.followerUid).collection("followingActivity");
    shareRef6.add({ senderUid: (this.uid), senderDisplayName: (this.displayName), senderPhotoUrl: (this.photoUrl), 
      sendeeUid: (follower.followerUid), sendeePhotoUrl: (follower.followerPhotoUrl), sendeeDisplayName: (follower.followerDisplayName),
      createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), recievedIsTrue: (true), articleUrl: (this.articleUrl),
        publishDate: (this.publishDate), publisher: (this.publisher) })
    .then(()=> console.log("Sent"))
      .catch((err)=> console.log("Sent Error: " + err));

    const shareRef5 = this.afs.collection("users").doc(follower.followerUid).collection("privateActivity");
    shareRef5.add({ senderUid: (this.uid), senderDisplayName: (this.displayName), senderPhotoUrl: (this.photoUrl), 
      sendeeUid: (follower.followerUid), sendeePhotoUrl: (follower.followerPhotoUrl), sendeeDisplayName: (follower.followerDisplayName),
      createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), recievedIsTrue: (true), articleUrl: (this.articleUrl),
      publishDate: (this.publishDate), publisher: (this.publisher) })
      .then(()=> console.log("Sent"))
        .catch((err)=> console.log("Sent Error: " + err));

    const shareRef3 = this.afs.collection("articles").doc(this.titleID).collection("sends");
    shareRef3.add({ senderUid: (this.uid), senderDisplayName: (this.displayName), senderPhotoUrl: (this.photoUrl), 
      sendeeUid: (follower.followerUid), sendeePhotoUrl: (follower.followerPhotoUrl), sendeeDisplayName: (follower.followerDisplayName),
      createdAt: (this.currentTime), title: (this.title), titleID: (this.titleID), sentIsTrue: (true), articleUrl: (this.articleUrl),
       publishDate: (this.publishDate), publisher: (this.publisher) })
      .then(()=> console.log("Sent"))
        .catch((err)=> console.log("Sent Error: " + err));
    
    this.presentToast("Article sent to " + follower.followerDisplayName);
    this.dismissModal();
  }

  dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}