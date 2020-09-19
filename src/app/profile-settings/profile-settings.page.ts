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
  isAnonymous: boolean;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              public globalProps: GlobalParamsService,
              private afs: AngularFirestore) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
        this.profileDoc = this.afs.collection("users").doc(this.uid);
        this.afs.collection("users").doc(this.uid).ref.get().then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            console.log(doc.data().isAnonymous);
            this.isAnonymous = doc.data().isAnonymous;
            this.globalProps.isAnonymous = this.isAnonymous;
          }
        })
      }
    })
  }

  goAnonymous($event) {
    console.log(this.globalProps.isAnonymous)
    this.profileDoc.update({ isAnonymous: this.isAnonymous })
      .then(() => this.globalProps.isAnonymous = this.isAnonymous)
      .catch((err)=> console.log(err));
      console.log(this.isAnonymous, this.globalProps.isAnonymous)
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