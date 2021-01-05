import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})

export class ForgotPasswordPage {

  email: string;

  constructor(private fireAuth: AngularFireAuth,
              private toast: ToastController) { }

  passwordResetEmail() {
    console.log(this.email)
    this.fireAuth.auth.sendPasswordResetEmail(this.email)
      .then(()=> { 
        console.log("Password Reset Email Sent to: " + this.email);
        this.presentToast("All finished, please check your email to reset your password.");
      })
      .catch((error)=>console.log("Password Reset Email Error: " + error));
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 4000
    });
    toast.present();
  }
 
}