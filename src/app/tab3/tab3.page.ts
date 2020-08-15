import { Component, ViewChild, OnInit } from '@angular/core';
import { AngularFirestore, DocumentData } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
//import { Content } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page implements OnInit  {

  users$: Observable<any>;
  sizeFilter$: BehaviorSubject<string|null>;
  colorFilter$: BehaviorSubject<string|null>;

  newsQuery: string;
  userQuery: string;
  newsResults: Object[];
  userResults: Observable<DocumentData[]>;

  topNewsUrl: string = environment.newsApi.topNewsUrl;
  searchUrl: string = environment.newsApi.searchUrl;
  tokenUrl: string = environment.newsApi.tokenURL;
  apiKey: string = environment.newsApi.key;

  searchingNews: boolean = true;
  searchingUsers: boolean = false;

  constructor(private router: Router,
              private afs: AngularFirestore) { }

  ngOnInit() {
    fetch(this.topNewsUrl + this.tokenUrl + this.apiKey)
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          console.log(data);
      });
  }

  segmentChanged(ev: any) {
    if (ev.detail.value === "news") {
      console.log(ev.detail.value);
      this.searchingNews = true;
      this.searchingUsers = false;
    }
    else if (ev.detail.value === "users") {
      console.log(ev.detail.value);
      this.searchingNews = false;
      this.searchingUsers = true;
    }
  }          

  openUser(uid) {
    this.router.navigateByUrl('user/' + uid)
  }

  searchNews($event) {
    fetch(this.searchUrl + $event + this.tokenUrl + this.apiKey)
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          console.log(data);
      });
  }

  searchUsers() {
    
    console.log("query: " + this.userQuery.toUpperCase());

    this.sizeFilter$ = new BehaviorSubject(null);
    this.colorFilter$ = new BehaviorSubject(null);
    this.users$ = combineLatest(
      this.sizeFilter$,
      this.colorFilter$
    ).pipe(
      switchMap(([size, color]) => 
        this.afs.collection('users', ref => {
          let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
          if (size) { query = query.where('size', '==', size) };
          if (color) { query = query.where('color', '==', color) };
          return query;
        }).valueChanges()
      )
    );
  }
  
  filterBySize(size: string|null) {
    this.sizeFilter$.next(size); 
  }
  filterByColor(color: string|null) {
    this.colorFilter$.next(color); 
  }
  
}