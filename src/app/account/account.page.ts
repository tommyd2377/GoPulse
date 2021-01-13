import { Component, OnInit } from '@angular/core';
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
export class AccountPage implements OnInit {

  uid: string;
  profileDoc: any;
  code1: string;
  code2: string;
  code3: string;
  code4: string;
  code5: string;
  code6: string;
  code7: string;
  goCode: string;
  signedUpOn: string;

  constructor(private fireAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore,
    public platform: Platform,
    public alertController: AlertController,
    public toastController: ToastController) { }
  
  
  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;

        this.signedUpOn = user.metadata.creationTime;
        
        this.profileDoc = this.afs.collection("users").doc(user.uid).valueChanges();
        
        this.profileDoc.subscribe((doc) => { 
          this.goCode = doc.goCode;
          this.code1 = doc.goCodes[0];
          this.code2 = doc.goCodes[1];
          this.code3 = doc.goCodes[2];
          this.code4 = doc.goCodes[3];
          this.code5 = doc.goCodes[4];
          this.code6 = doc.goCodes[5];
          this.code7 = doc.goCodes[6];
        });
      }
    });
  }

  copyCode(index) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = index;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.presentToast("Copied " + index)
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000
    });
    toast.present();
  }

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
        let email = user.email;
        let id = user.uid;
        user.delete()
        .then(()=> {
          const stripeCancel = this.afs.collection('canceledSubs');
          stripeCancel.add({ email: (email), uid: (id) });
          this.router.navigateByUrl('/welcome');
          this.presentToast("Subscription Canceled for " + id);
      })
        .catch((err)=> this.presentToast("User Canceled Subscription: " + err));
      }
    });
  }

}
