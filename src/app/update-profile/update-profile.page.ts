import { Component, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})

export class UpdateProfilePage {

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  displayName: string;
  email: string;
  fullName: string;

  constructor(private storage: AngularFireStorage,
              private fireAuth: AngularFireAuth,
              private afs: AngularFirestore) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        
      }
    }) 
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = 'users/tomdevito.jpg';
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
        finalize(() => this.downloadURL = fileRef.getDownloadURL() )
     )
    .subscribe()
  }

  updateProfile() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        user.updateProfile({
          displayName: this.displayName,
          photoURL: "",
        }).then(() => {
            let uid = user.uid;
            let userData = this.afs.collection("users").doc(uid);
            userData.update({
              email: this.email,
              displayName: this.displayName,
              fullName: this.fullName,
              fullNameSearch: this.fullName.toUpperCase(),
              photoURL: ""
            })
          })
      }
    }) 
  }

}