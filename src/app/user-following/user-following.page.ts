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
  
  userId: string;
  following: any;

  constructor(private fireAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public router: Router,
    public globalProps: GlobalParamsService) { } 

  ngOnInit() {      
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) { 
        this.userId = this.globalProps.userId;
        console.log("User: " + this.userId);
        this.following = this.afs.collection("users").doc(this.userId).collection("following").valueChanges()
          .subscribe(following => this.following = following);

        console.log(this.following);
      }
    });
  } 

  openUser($event, followee) {
    this.router.navigateByUrl("tabs/" + this.globalProps.currentTab + "/user/" + followee.followeeUid);
  }

}