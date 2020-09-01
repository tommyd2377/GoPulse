import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
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
              public platform: Platform,
              public alertController: AlertController,
              public toastController: ToastController) { }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm Sign Up',
      message: 'By clicking "Sign Up" you agree to our <strong>Privacy Policy</strong> and <strong>Terms and Conditions</strong>.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Sign Up',
          handler: () => {
            console.log('Confirm Okay');
            this.emailSignUp();
          }
        }
      ]
    });
    await alert.present();
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000
    });
    toast.present();
  }

  emailSignUp() {

   
      console.log(this.email, this.password);
      this.fireAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
        .then(res => {
          if (res.user) {
            console.log("User Created: " + res.user);
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
        user.updateProfile({
          displayName: this.displayName,
          photoURL: "",
        }).then(() => {
            console.log("Profile Updated: " + user.uid);
          })
        user.sendEmailVerification().then(() => {
          let uid = user.uid;
            console.log(uid)
            let userData = this.afs.collection("users").doc(uid);
            userData.set({
              uid: uid,
              email: this.email,
              displayName: this.displayName,
              fullName: this.fullName,
              fullNameSearch: this.fullName.toUpperCase(),
              photoURL: "",
              isAnonymous: false
            })
            .then(() => console.log("Profile Data Set: " + user.uid))
            .catch((error) => console.log("Profile Data Set Error: " + error));
          console.log("email verification sent to: " + user.uid);
        })
        .catch(error => console.log("email verification error: " + error));
        this.router.navigateByUrl('/tabs');
      }
    }) 
  }

}