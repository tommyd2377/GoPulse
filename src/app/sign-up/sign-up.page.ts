import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { GlobalParamsService } from '../global-params.service';

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
              public toastController: ToastController,
              public props: GlobalParamsService) { }

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
          console.log("Document data:", doc.data());
          console.log(doc.data().hasBeenUsed);
          if (doc.data().hasBeenUsed === false) {
            console.log('not used', doc.data().creator)
            this.fireAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
            .then(res => {
              if (res.user) {
                this.setProfile();
                // let creatorUid: string = doc.data().creator;
                // const creatorRef = this.afs.collection("users").doc(creatorUid).collection("privateActivity");
                //   creatorRef.add({ newUserUid: res.user.uid, newUserName: this.fullName, 
                //     newUserDisplayName: this.displayName, goCodeUsed: true });
                //     const creatorRef2 = this.afs.collection("users").doc(creatorUid).collection("followeeActivity");
                //     creatorRef2.add({ newUserUid: res.user.uid, newUserName: this.fullName, 
                //       newUserDisplayName: this.displayName, goCodeUsed: true });
                const goCodeRef = this.afs.collection("goCodes").doc(this.goCode);
                  goCodeRef.update({ hasBeenUsed: true, usedBy: res.user.uid });
                this.presentToast("User Created: " + this.displayName);
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
          let uid = user.uid;
          this.newGoCodes = this.goCodes();
          for (let newCode of this.newGoCodes) {
            const GoRef = this.afs.collection("goCodes").doc(newCode);
            GoRef.set({ goCode: newCode, hasBeenUsed: false, creator: uid})
              .then(() => console.log('gocode added: ' + newCode))
              .catch((err) => console.log(err));
          }
          let userData = this.afs.collection("users").doc(uid);
          userData.set({
            uid: uid,
            email: this.email,
            displayName: this.displayName,
            bio: "Don't forget to update your picture and bio in your profile settings",
            fullName: this.fullName,
            fullNameSearch: this.fullName.toUpperCase(),
            photoURL: "https://logodix.com/logo/1984123.png",
          })
          let customerData = this.afs.collection("customers").doc(uid);
          customerData.set({
            uid: uid,
            email: this.email,
            goCode: this.goCode,
            goCodes: this.newGoCodes
          })
          .then(() => { 
            console.log("Profile Data Set: " + user.uid);
            user.sendEmailVerification().then(() => {
              console.log("email verification sent to: " + user.uid);
            })
            .catch(error => console.log("email verification error: " + error));
            this.router.navigateByUrl('/tabs');
          })
          .catch((error) => console.log("Profile Data Set Error: " + error));
          });
        console.log("Profile Updated: " + user.uid);
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