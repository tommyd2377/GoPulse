import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent {

  isLoggedIn: boolean = true;

  constructor(private router : Router, public platform: Platform, 
              private splashScreen: SplashScreen, private statusBar: StatusBar,
              public fireAuth: AngularFireAuth) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then((readySource) => {

      console.log('Platform ready from', readySource);

      // this.fireAuth.auth.onAuthStateChanged((user) => {
        
      //   // if (user) {
      //   //   console.log(user);
      //   //   this.router.navigateByUrl('tabs');
      //   // }

      //   // else if (!user) {
      //   //   console.log("No user logged in");
      //   //   this.router.navigateByUrl('welcome');
      //   // }

      //   // else {
      //   //   console.log("No user logged in fallback");
      //   //   this.router.navigateByUrl('welcome');
      //   // }
      
      // });

      if (this.isLoggedIn) {
        this.router.navigateByUrl('tabs');
      }
      else if (!this.isLoggedIn) {
        this.router.navigateByUrl('welcome');
      }
      
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}