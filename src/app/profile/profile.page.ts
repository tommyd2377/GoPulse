import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { GlobalParamsService } from '../global-params.service';
import { Observable } from 'rxjs';
import { IonContent, Platform } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {

  @ViewChild(IonContent, {static: true}) content: IonContent;

  backToTop: boolean = false;

  showLoader: boolean = true;

  profileDoc;
  uid;
  userActivity;
  title: string;
  publisher: string;
  publishDate: string;
  articleUrl: string;
  comment: string;
  titleID: string;
  followers;
  following;
  parentTab;
  Tab;
  profileUrl: Observable<string | null>;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              private afs: AngularFirestore,
              private storage: AngularFireStorage,
              public globalProps: GlobalParamsService,
              public platform: Platform) { }
  
  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        
        this.uid = user.uid;

        const ref = this.storage.ref('users/' + this.uid + '.jpg');
        this.profileUrl = ref.getDownloadURL();
        
        this.profileDoc = this.afs.collection("users").doc(this.uid).valueChanges();
   
        this.userActivity = this.afs.collection("users").doc(this.uid).collection("privateActivity", ref => ref.orderBy('createdAt', 'desc')).valueChanges();

        this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
        
        this.following = this.afs.collection("users").doc(this.uid).collection("following").valueChanges();
      }
    })
    this.showLoader = false;
  }

  getScrollPos(pos: number) {
    if (pos > this.platform.height()) {
         this.backToTop = true;
    } else {
         this.backToTop = false;
    }
  }

  gotToTop() {
    this.content.scrollToTop(500);
  }
  
  openArticle($event, active) {
    this.globalProps.title = active.title;
    this.globalProps.articleUrl = active.articleUrl;
    this.globalProps.publishDate = active.publishDate;
    this.globalProps.publisher = active.publisher;
    this.globalProps.content = active.content;
    this.globalProps.image = active.image;
    this.globalProps.description = active.description;
    this.globalProps.titleID = active.titleID;
    this.router.navigateByUrl('tabs/profile/article/' + this.globalProps.titleID);
  }

  openUser($event, active) {
    console.log($event, active);
    this.router.navigateByUrl('tabs/profile/user/' + active.uid);
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