import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-following',
  templateUrl: './following.page.html',
  styleUrls: ['./following.page.scss'],
})

export class FollowingPage implements OnInit {

  uid: string;
  following: Observable<DocumentData[]>;

  constructor(private fireAuth: AngularFireAuth,
              private afs: AngularFirestore) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        
        console.log("currentUser: " + user);
        this.uid = user.uid;
        this.following = this.afs.collection("users").doc(this.uid).collection("following").valueChanges();
      }
    })
  }

}
