import { Component, ViewChild, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage implements OnInit {

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

  //@ViewChild(IonContent) private ionContent: IonContent;

  uid: string;
  titleID: string;
  followingActivity: Observable<DocumentData[]>;
  unread: Observable<DocumentData[]>;
  read: Observable<DocumentData[]>;
 // activity: Observable<DocumentData[]>;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              private afs: AngularFirestore) {}

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        
        console.log(user.displayName);
        this.uid = user.uid;
        
        this.followingActivity = this.afs.collection("users").doc(this.uid).collection("following-activity").valueChanges();
          //.map((array) => array.reverse()) as Observable<any[]>;

        this.unread = this.afs.collection("users").doc(this.uid).collection("unread-direct-sends").valueChanges();
          //.map((array) => array.reverse()) as Observable<any[]>;
      }
    })
  }

  ionViewWillEnter() {
  //  this.ionContent.scrollToTop();
  }

  ionSelected() {
    // this.content.scrollToTop();
  }

  openArticle(event, active) {
    this.router.navigateByUrl('tabs/home/article/33');
  }

  openUser(uid) {
    this.router.navigateByUrl('user/'+uid);
  }

  openFollower(followerUid) {
    this.router.navigateByUrl('user/');
  }

  openFollowing(followingUid) {
    this.router.navigateByUrl('user/');
  }
  
}