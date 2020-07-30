import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Platform } from '@ionic/angular';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';

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
              private firebaseAuthentication: FirebaseAuthentication,
              private router: Router,
              public platform: Platform) { }

  emailSignIn() {
    this.platform.ready().then((readySource) => {

      console.log('Platform ready from', readySource);

      if (readySource === "dom") {
        console.log(readySource)
        this.fireAuth.auth.signInWithEmailAndPassword(this.email, this.password)
          .then(res => {
            if (res.user) {
              console.log(res.user);
              this.router.navigateByUrl('/tabs');
            }
          })
          .catch(err => {
            console.log(`login failed ${err}`);
            this.error = err.message;
          });
        }

        else if (readySource === "cordova") {
          this.firebaseAuthentication.signInWithEmailAndPassword(this.email, this.password)
            .then(res => {
              if (res.user) {
                console.log(res.user);
                this.router.navigateByUrl('/tabs');
              }
            })
            .catch(err => {
              console.log(`login failed ${err}`);
              this.error = err.message;
            });
        }
    })  
  }  

}