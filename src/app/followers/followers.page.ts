import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { GlobalParamsService } from '../global-params.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.page.html',
  styleUrls: ['./followers.page.scss'],
})

export class FollowersPage implements OnInit {

  uid: string;
  followers;

  constructor(private fireAuth: AngularFireAuth,
              private afs: AngularFirestore,
              public router: Router,
              public globalProps: GlobalParamsService) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
        this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      }
    })
  }
  
  openUser($event, follower) {
    this.router.navigateByUrl("tabs/" + this.globalProps.currentTab + "/user/" + follower.followerUid);
  }

}