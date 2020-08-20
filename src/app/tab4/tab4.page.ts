import { Component, ViewChild, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})

export class Tab4Page implements OnInit {

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

  constructor(private router: Router,
              private storage: AngularFireStorage) {
    
    const ref = this.storage.ref('users/davideast.jpg');
    this.profileUrl = ref.getDownloadURL();
  }
  
  ngOnInit() {
    
  }

  settings() {
    this.router.navigateByUrl('tabs/tab4/profile-settings')
  }

  editPicture() {
    console.log('edit')
  }

  //fetch profile info
  //display name, username, follower count, following count, friends count, activity

}
