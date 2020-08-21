import { Component, ViewChild, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {

  profileDoc;
  uid;
  userActivity;
  profileUrl: Observable<string | null>;

  activity = [{user: "TommyD",
    title: "Who will win the 2020 Presidential election?",
    publisher: "The Wall Street Journal",
    date: "August 8th, 2020"},
    {user: "TommyD2",
    title: "it works",
    publisher: "wired",
    date: "August 8th, 2020"},
    {user: "TommyD3",
    title: "it works",
    publisher: "wired",
    date: "August 8th, 2020"},
    {user: "TommyD5",
    title: "it works", publisher: "wired",
    date: "August 8th, 2020"},
    {user: "TommyD",
    title: "it works",
    publisher: "wired",
    date: "August 8th, 2020"},
  ]

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              private afs: AngularFirestore,
              private storage: AngularFireStorage) { }
  
  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        
        console.log(user.displayName);
        console.log(user);
        this.uid = user.uid;

        const ref = this.storage.ref('users/' + (this.uid) + '.jpg');
          this.profileUrl = ref.getDownloadURL();
        
        this.profileDoc = this.afs.collection("users").doc(this.uid).get();
          //.map((array) => array.reverse()) as Observable<any[]>;

        this.userActivity = this.afs.collection("users").doc(this.uid).collection("activity").get();

        console.log(this.profileDoc);
        console.log(this.userActivity);
      }
    })
  }

  openArticle(event, active) {
    this.router.navigateByUrl('tabs/profile/article/33');
  }

  followers() {
    this.router.navigateByUrl('tabs/profile/followers');
  }

  following() {
    this.router.navigateByUrl('tabs/profile/following');
  }

  settings() {
    this.router.navigateByUrl('tabs/profile/profile-settings');
  }

}