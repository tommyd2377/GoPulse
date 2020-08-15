import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})

export class SignUpPage {

  email: string;
  password: string;
  displayName: string;
  fullName: string;
  error: string;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              private afs: AngularFirestore,
              public platform: Platform) { }

  emailSignUp() {

    this.fireAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then(res => {
        if (res.user) {
          console.log(res.user);
          this.setProfile();
        }
      })
      .catch(err => {
        console.log(`signup failed ${err}`);
        this.error = err.message;
      });
    
  }

  setProfile() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        user.updateProfile({
          displayName: this.displayName,
          photoURL: "",
        }).then(() => {
            let uid = user.uid;
            let userData = this.afs.collection("users").doc(uid);
            userData.set({
              uid: uid,
              email: this.email,
              displayName: this.displayName,
              fullName: this.fullName,
              fullNameSearch: this.fullName.toUpperCase(),
              photoURL: "",
              signedUp: user.metadata.creationTime,
              signedIn: user.metadata.lastSignInTime,
              isAnonymous: false
            })
          })
        user.sendEmailVerification().then(() => {
          console.log("email verification sent");
        }).catch(error => 
          console.log("email verification error: " + error));
        this.router.navigateByUrl('/tabs');
      }
    }) 
  }

}