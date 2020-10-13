import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { GlobalParamsService } from '../global-params.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.page.html',
  styleUrls: ['./profile-settings.page.scss'],
})
export class ProfileSettingsPage {

  uid;
  profileDoc;
  profile;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              public globalProps: GlobalParamsService,
              private afs: AngularFirestore) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
        this.profileDoc = this.afs.collection("users").doc(this.uid);
      }
    })
  }

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