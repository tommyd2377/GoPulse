import { Component, ViewChild, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalParamsService } from '../global-params.service'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage implements OnInit {

  uid: string;
  titleID: string;
  followingActivity;
  read;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              private afs: AngularFirestore,
              public globalProps: GlobalParamsService) {}

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
        this.followingActivity = this.afs.collection("users").doc(this.uid).collection("followingActivity").valueChanges()
          .subscribe(activity => this.followingActivity = activity);
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
    this.router.navigateByUrl('tabs/home/article/' + this.globalProps.titleID);
  }

  openUser(event, active) {
    console.log(event, active);
    this.router.navigateByUrl('tabs/home/user/' + active.uid);
  }

}