import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.page.html',
  styleUrls: ['./profile-settings.page.scss'],
})
export class ProfileSettingsPage {

  constructor(private fireAuth: AngularFireAuth,
              private router: Router) { }

  emailSignOut() {
     this.fireAuth.auth.signOut()
        .then(() => this.router.navigateByUrl('/welcome'));
  }

  goToUpdateProfile() {
    this.router.navigateByUrl("tabs/profile/profile-settings/update-profile")
  }

  goToAccount() {
    this.router.navigateByUrl("tabs/profile/profile-settings/account")
  }

}



