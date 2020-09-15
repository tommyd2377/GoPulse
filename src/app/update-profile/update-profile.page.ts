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
                    .then(()=> console.log("photoUrl profile update"));
                  userData.update({ photoURL: profilePicture })
                    .then(()=> console.log("photoUrl set"))
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
            .then(()=> console.log("email update"))
            .catch((err)=> console.log("email update error: " + err));
          userData.update({ email: this.newEmail })
            .then(()=> console.log("email update doc"))
            .catch((err)=> console.log("email update doc error: " + err));
        }
        if (this.newPassword) {
          user.updatePassword(this.newPassword)
            .then(()=> console.log("password update"))
            .catch((err)=> console.log("password update error: " + err));
        } 
        if (this.newDisplayName) {
          user.updateProfile({ displayName: this.newDisplayName })
            .then(()=> console.log("displayname update"))
            .catch((err)=> console.log("displayname update error: " + err));
          userData.update({ displayName: this.newDisplayName })
            .then(()=> console.log("displayname update doc"))
            .catch((err)=> console.log("displayname update doc error: " + err));
        } 
        if (this.newFullName) {
          userData.update({ fullName: this.newFullName,
          fullNameSearch: this.newFullName.toUpperCase() })
            .then(()=> console.log("fullname update doc"))
            .catch((err)=> console.log("fullname update doc error: " + err));
        }
      }
    })
  }

}