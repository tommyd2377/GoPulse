import { Component, ViewChild, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalParamsService } from '../global-params.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {

  profileDoc;
  uid;
  userActivity;
  title: string = "2020 election";
  publisher: string;
  publishDate: string;
  articleUrl: string;
  comment: string;
  titleID: string
  profileUrl: Observable<string | null>;
  followers;
  following;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              private afs: AngularFirestore,
              private storage: AngularFireStorage,
              public globalProps: GlobalParamsService) {
                this.globalProps.title = this.title;
                this.globalProps.articleUrl = this.articleUrl;
                this.globalProps.publishDate = this.publishDate;
                this.globalProps.publisher = this.publisher;
                this.globalProps.titleID = this.titleID;
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
        
        this.profileDoc = this.afs.collection("users").doc(this.uid).valueChanges();
   

        this.userActivity = this.afs.collection("users").doc(this.uid).collection("publicActivity").valueChanges()
        .subscribe(activity => this.userActivity = activity);

        this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
        this.following = this.afs.collection("users").doc(this.uid).collection("following").valueChanges();

        console.log(this.profileDoc);
        console.log(this.userActivity);
      }
    })
  }
  
  openArticle($event, active) {
    console.log($event, active);
    this.globalProps.title = active.title;
    this.globalProps.articleUrl = active.articleUrl;
    this.globalProps.publishDate = active.publishDate;
    this.globalProps.publisher = active.publisher;
    this.globalProps.titleID = active.title.replace(/[^A-Z0-9]+/ig, "-");
    this.router.navigateByUrl('tabs/profile/article/' + this.globalProps.titleID);
  }

  goToFollowers() {
    this.router.navigateByUrl('tabs/profile/followers');
  }

  goToFollowing() {
    this.router.navigateByUrl('tabs/profile/following');
  }

  settings() {
    this.router.navigateByUrl('tabs/profile/profile-settings');
  }

}