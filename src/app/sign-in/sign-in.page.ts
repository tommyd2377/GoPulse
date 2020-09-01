import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})

export class SignInPage {
  
  email: string;
  password: string;
  error: string;
  
  constructor(private fireAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router,
              public platform: Platform) { }

  emailSignIn() {
    this.fireAuth.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(res => {
        if (res.user) {
          console.log("User Signed In: " + res.user);
          this.router.navigateByUrl('/tabs');
        }
      })
      .catch(err => {
        this.error = err.message;
        console.log("User Sign In Error: " + err);
        console.log("User Sign Error Message: " + this.error);
      });
  }  

}