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
  goCode: string;
  error: string;
  newGoCodes = [];
  goCodesCollection;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              private afs: AngularFirestore,
              public platform: Platform,
              public alertController: AlertController,
              public toastController: ToastController) { }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm Sign Up',
      message: 'By creating an account you agree to our <strong>Privacy Policy</strong> and <strong>Terms and Conditions</strong>.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Agree',
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
    this.goCodesCollection = this.afs.collection("goCodes").doc(this.goCode).ref.get()
      .then((doc) => {
        if (doc.exists) {
          if (doc.data().goCodeUsed === false) {
            console.log("Document data:", doc.data());
            this.fireAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
            .then(res => {
              if (res.user) {
                this.setProfile();
                let creatorUid = doc.data().uid;
                const creatorRef = this.afs.collection("users").doc(creatorUid).collection("privateActivity");
                  creatorRef.add({ newUserUid: res.user.uid, newUserName: this.fullName, 
                    newUserDisplayName: res.user.displayName, goCodeUsed: true });
                const goCodeRef = this.afs.collection("goCodes").doc(this.goCode);
                  goCodeRef.update({ goCodeUsed: true, usedBy: res.user.uid });
                this.presentToast("User Created: " + res.user.displayName);
              }
            })
            .catch(err => {
              this.presentToast("Sign Up Failed: " + err.message);
            });
          }
          else {
            this.presentToast("This GoCode has already been used");
          }
        } 
        else {
          this.presentToast("Invalid GoCode");
        }
      })
    .catch(function(error) {
      this.presentToast("GoCode Error: " + error);
    });
  }

  setProfile() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        user.updateProfile({
          displayName: this.displayName,
          photoURL: "https://logodix.com/logo/1984123.png",
        }).then(() => {
            console.log("Profile Updated: " + user.uid);
          })
        user.sendEmailVerification().then(() => {
          let uid = user.uid;
            console.log(uid);
            this.newGoCodes = this.goCodes();
            let userData = this.afs.collection("users").doc(uid);
            userData.set({
              uid: uid,
              email: this.email,
              displayName: this.displayName,
              fullName: this.fullName,
              fullNameSearch: this.fullName.toUpperCase(),
              photoURL: "https://logodix.com/logo/1984123.png",
              goCodes: this.newGoCodes
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

  goCodes() {
    let goCodes = [];
    for (let i = 0; i < 7; i++) {
      let goCode: string = "";
      let characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let charactersLength: number = characters.length;
      for (let j = 0; j < 7; j++) {
        goCode += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      goCodes.push(goCode)
    } 
    return goCodes;
 }

}