import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage {

  constructor(private fireAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore,
    public platform: Platform,
    public alertController: AlertController,
    public toastController: ToastController) { }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Warning',
      message: 'This action cannot be undone. By canceling your subscription you will be deleting your account and user profile. After canceling, you will not be charged a monthly subscription.',
      buttons: [
         {
          text: 'Cancel Subscription',
          handler: () => {
            console.log('Confirm Cancel Sub');
            this.cancelSubscription();
          }
        },
        {
          text: "Don't Cancel just yet",
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log("Don't cancel");
          }
        }
      ]
    });
    await alert.present();
    }

  cancelSubscription() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        user.delete()
        .then(()=> {
          console.log("User Canceled Subscription: " + user.uid);
          this.router.navigateByUrl('/welcome');
      })
        .catch((err)=> console.log("User Canceled Subscription: " + err));
      }
    });
  }

}
