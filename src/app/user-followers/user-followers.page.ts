import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { GlobalParamsService } from '../global-params.service';

@Component({
  selector: 'app-user-followers',
  templateUrl: './user-followers.page.html',
  styleUrls: ['./user-followers.page.scss'],
})
export class UserFollowersPage implements OnInit {

  uid: string;
  followers;

  constructor(private fireAuth: AngularFireAuth,
              private afs: AngularFirestore,
              public router: Router,
              public globalProps: GlobalParamsService) { }

  ngOnInit() {
        console.log("currentUser: " + this.globalProps.userId);
        this.uid = this.globalProps.userId;
        this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges()
          .subscribe(followers => this.followers = followers)
          console.log(this.followers);
  }
  
  openUser($event, follower) {
    this.router.navigateByUrl("tabs/" + this.globalProps.currentTab + "/user/" + follower.followeeUid);
  }

}
