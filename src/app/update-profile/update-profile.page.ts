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
  downloadURL;
  newPassword: string;
  newDisplayName: string;
  newEmail: string;
  newFullName: string;
  bio: string;
  profileDoc;
  photoUrl;

  constructor(private storage: AngularFireStorage,
              private fireAuth: AngularFireAuth,
              private afs: AngularFirestore) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.profileDoc = this.afs.collection("users").doc(user.uid).valueChanges();
      }
    }) 
  }

  uploadFile(event) {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        let uid = user.uid;
        let userData = this.afs.collection("users").doc(uid);
        const file = event.target.files[0];
        const filePath = 'users/' + uid + '.jpg';
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);
    
        // observe percentage changes
        this.uploadPercent = task.percentageChanges();
        // get notified when the download URL is available
        task.snapshotChanges().pipe(finalize(() => 
             fileRef.getDownloadURL()
                .subscribe(profilePicture => { console.log(profilePicture)
                  this.downloadURL = profilePicture;
                  user.updateProfile({ photoURL: profilePicture })
                    .then(() => userData.update({ photoURL: profilePicture }));
                })         
        ))   
        .subscribe()
      }
    })
  }
  
  updateProfile() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        let uid = user.uid;
        let userData = this.afs.collection("users").doc(uid);
        if (this.newEmail) {
          user.updateEmail(this.newEmail)
            .then(() => userData.update({ email: this.newEmail }));
        }
        if (this.newPassword) {
          user.updatePassword(this.newPassword);
        } 
        if (this.newDisplayName) {
          user.updateProfile({ displayName: this.newDisplayName })
            .then(() => userData.update({ displayName: this.newDisplayName }));
          
        } 
        if (this.newFullName) {
          userData.update({ fullName: this.newFullName,
          fullNameSearch: this.newFullName.toUpperCase() });
        }
        if (this.bio) {
          userData.update({ bio: this.bio });
        }
      }
    })
  }

}