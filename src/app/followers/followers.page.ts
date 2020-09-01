import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.page.html',
  styleUrls: ['./followers.page.scss'],
})

export class FollowersPage implements OnInit {

  uid: string;
  followers: Observable<DocumentData[]>;

  constructor(private fireAuth: AngularFireAuth,
              private afs: AngularFirestore) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        
        console.log("currentUser: " + user);
        this.uid = user.uid;
        this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      }
    })
  }

}
