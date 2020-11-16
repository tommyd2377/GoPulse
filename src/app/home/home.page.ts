import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GlobalParamsService } from '../global-params.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage implements OnInit {

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
              public globalProps: GlobalParamsService) {}

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
        
        this.profileDoc = this.afs.collection("users").doc(this.uid).valueChanges();

        this.codes = this.profileDoc.subscribe((doc) => { 
          this.code1 = doc.goCodes[0];
          this.code2 = doc.goCodes[1];
          this.code3 = doc.goCodes[2];
          this.code4 = doc.goCodes[3];
          this.code5 = doc.goCodes[4];
          this.code6 = doc.goCodes[5];
          this.code7 = doc.goCodes[6];
        });

        this.followingActivity = this.afs.collection("users").doc(this.uid).collection("followingActivity").valueChanges()
          .subscribe(activity => this.followingActivity = activity);
      }
    })
  }

  copyCode(index) {
    console.log(index);
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
    this.globalProps.titleID = active.title.replace(/[^A-Z0-9]+/ig, "-");
    this.router.navigateByUrl('tabs/home/article/' + this.globalProps.titleID);
  }

  openUser(event, active) {
    this.router.navigateByUrl('tabs/home/user/' + active.uid);
  }

}