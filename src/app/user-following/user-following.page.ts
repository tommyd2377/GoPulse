import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { GlobalParamsService } from '../global-params.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-following',
  templateUrl: './user-following.page.html',
  styleUrls: ['./user-following.page.scss'],
})
export class UserFollowingPage implements OnInit {
  
  uid: string;
  following;

  constructor(private fireAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public router: Router,
    public globalProps: GlobalParamsService) { } 

  ngOnInit() {        
    this.uid = this.globalProps.userId;
    console.log("currentUser: " + this.uid);
    this.following = this.afs.collection("users").doc(this.uid).collection("following").valueChanges()
      .subscribe(following => this.following = following);
  } 

  openUser($event, followee) {
    this.router.navigateByUrl("tabs/" + this.globalProps.currentTab + "/user/" + followee.followeeUid);
  }

}