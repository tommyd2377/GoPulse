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

  constructor(private router : Router, 
              public platform: Platform,  
              private statusBar: StatusBar,
              public fireAuth: AngularFireAuth,
              private splashScreen: SplashScreen) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then((readySource) => {

      console.log('Platform ready from', readySource);

      this.fireAuth.auth.onAuthStateChanged((user) => {
        
        if (user) {
          this.router.navigateByUrl('tabs');
        }

        else {
          console.log("No user logged in; else fallback");
          this.router.navigateByUrl('welcome');
        }
      
      });
      
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}