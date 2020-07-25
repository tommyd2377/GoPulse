import { Component, ViewChild } from '@angular/core';
//import { Content } from '@ionic/angular';
import { AngularFirestore, DocumentData } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page {

  newsQuery: string;
  userQuery: string;
  newsResults: Object[];
  userResults: Observable<DocumentData[]>;

  baseURL: string = "https://gnews.io/v1/topics"
  apiKey: string = "enter string";

  constructor(private router: Router,
              private afs: AngularFirestore) { }
        
  // fetch('https://gnews.io/api/v3/top-news?&token=API-Token')
  //   .then(function (response) {
  //       return response.json();
  //   })
  //   .then(function (data) {
  //       console.log(data);
  //   });            

  openUser(uid) {
    this.router.navigateByUrl('user/'+uid)
  }

  searchNews($event) {
    fetch('https://gnews.io/api/v3/search?q=example&token=API-Token')
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          console.log(data);
      });
  }

  searchUsers($event) {
    
  }


  //query API with user input
    //display title, summary, publisher, date
    //open article page
  //query users with user input
    //display pic, name, username
    //open user profile

}
