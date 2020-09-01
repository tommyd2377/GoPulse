import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.page.html',
  styleUrls: ['./profile-settings.page.scss'],
})
export class ProfileSettingsPage {

  uid;
  profileDoc;
  isAnonymous: boolean;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              private afs: AngularFirestore) { 
                
    
              }

              ngOnInit() {
       

                this.fireAuth.auth.onAuthStateChanged((user) => {
                  if (user) {
                    
                    console.log(user.displayName);
                    console.log(user);
                    this.uid = user.uid;
                    console.log(this.uid);
            
                    // const ref = this.storage.ref('users/' + (this.uid) + '.jpg');
                    //   this.profileUrl = ref.getDownloadURL();
                    
                    this.profileDoc = this.afs.collection("users").doc(this.uid).get();

                    console.log(this.profileDoc)
               
            
                
                  }
                })
              }


  goAnonymous($event) {
    this.profileDoc.update({ isAnonymous: this.isAnonymous })
     .then(()=> console.log("email update doc"))
      .catch((err)=> console.log("email update doc error: " + err));
    
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



