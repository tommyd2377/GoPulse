import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})

export class ForgotPasswordPage {

  email: string;

  constructor(private fireAuth: AngularFireAuth) { }

  passwordResetEmail() {
    this.fireAuth.auth.sendPasswordResetEmail(this.email);
  }
 
}
