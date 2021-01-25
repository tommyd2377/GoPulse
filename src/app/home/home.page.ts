import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection  } from '@angular/fire/firestore';
import { IonContent, ToastController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { GlobalParamsService } from '../global-params.service';
import { TabsPage } from '../tabs/tabs.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage implements OnInit {

  @ViewChild(IonContent, {static: true}) content: IonContent; 

  backToTop: boolean = false;

  showLoader: boolean = true;
  uid: string;
  followingActivity;
  profileDoc: any;
  codes;
  code1: string;
  code2: string;
  code3: string;
  code4: string;
  code5: string;
  code6: string;
  code7: string;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              public toastController: ToastController,
              private afs: AngularFirestore,
              public globalProps: GlobalParamsService,
              public tabs: TabsPage,
              public platform: Platform) {}

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged(async (user) => {
      if (user) {
        this.uid = user.uid;
        
        this.profileDoc = await this.afs.collection("customers").doc(this.uid).valueChanges();

        this.codes = await this.profileDoc.subscribe((doc) => { 
          this.code1 = doc.goCodes[0];
          this.code2 = doc.goCodes[1];
          this.code3 = doc.goCodes[2];
          this.code4 = doc.goCodes[3];
          this.code5 = doc.goCodes[4];
          this.code6 = doc.goCodes[5];
          this.code7 = doc.goCodes[6];
        });

        this.followingActivity = this.afs.collection("users").doc(this.uid).collection("followingActivity", 
          ref => ref.orderBy('createdAt', 'desc')).valueChanges();

        this.showLoader = false;
      }
    })
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

  copyCode(index) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = index;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.presentToast("Copied " + index)
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000
    });
    toast.present();
  }

  openArticle($event, active) {
    this.globalProps.title = active.title;
    this.globalProps.articleUrl = active.articleUrl;
    this.globalProps.publishDate = active.publishDate;
    this.globalProps.publisher = active.publisher;
    this.globalProps.image = active.image;
    this.globalProps.description = active.description;
    this.globalProps.content = active.publisher;
    this.globalProps.titleID = active.titleID;
    this.router.navigateByUrl('tabs/home/article/' + this.globalProps.titleID);
  }

  openUser(event, active) {
    if (active.senderUid) {
      this.router.navigateByUrl('tabs/home/user/' + active.senderUid);
    }
    else if (active.uid) {
      this.router.navigateByUrl('tabs/home/user/' + active.uid);
    }
    else if (active.followerUid) {
      this.router.navigateByUrl('tabs/home/user/' + active.followerUid);
    }
  }

  openFollowee(event, active) {
    if (active.followeeUid) {
      this.router.navigateByUrl('tabs/home/user/' + active.followeeUid);
    }
  }

}