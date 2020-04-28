import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  email: string;
  password: string;
  displayName: string;
  fullName: string;
  error: string;
  date;
  currentTime;

  constructor(private firebaseAuthentication: FirebaseAuthentication,
              private fireAuth: AngularFireAuth,
              private router: Router,
              private afs: AngularFirestore) { }

  ngOnInit() {
  }

  emailSignUp() {
    this.fireAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
    .then(res => {
      if (res.user) {
        console.log(res.user);
        this.updateProfile();
        this.router.navigateByUrl('/tabs');
      }
    })
    .catch(err => {
      console.log(`login failed ${err}`);
      this.error = err.message;
    });
    
      // this.firebaseAuthentication.createUserWithEmailAndPassword(this.email, this.password)
    //   .then((res: any) => console.log(res))
    //   .catch((error: any) => console.error(error));
  }


  updateProfile() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        user.sendEmailVerification().then(() => {
          console.log("email verification sent");
        }).catch(error => 
          console.log("email verification error: " + error));
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
              photoURL: "",
              signedUp: this.getTime(),
              signedIn: this.getTime(),
            })
          })
      }
    }) 
  }

  getTime() {
    this.date = new Date();
    this.currentTime = this.date.getTime();
    return this.currentTime;
  }

}
