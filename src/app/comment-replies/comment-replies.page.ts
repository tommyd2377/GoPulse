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
  comment: string;

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
      }
    })
  }

  openUser($event, comment) {

  }

  likeComment($event, comment) {

  }

  newComment() {

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