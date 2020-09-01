import { Component, ViewChild, OnInit } from '@angular/core';
import { AngularFirestore, DocumentData } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { GlobalParamsService } from '../global-params.service';
//import { Content } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss']
})

export class SearchPage implements OnInit  {

  userQuery = new Subject<string>();
  newsQuery: string;

  userResults;

  articles = [];

  topNewsUrl: string = environment.newsApi.topNewsUrl;
  searchUrl: string = environment.newsApi.searchUrl;
  tokenUrl: string = environment.newsApi.tokenURL;
  apiKey: string = environment.newsApi.key;

  searchingNews: boolean = true;
  searchingUsers: boolean = false;


  constructor(private router: Router,
              private afs: AngularFirestore,
              public globalProps: GlobalParamsService) { }
              

  ngOnInit() {

    fetch(this.topNewsUrl + this.tokenUrl + this.apiKey)
      .then((response) => {
        console.log(response);
          return response.json();
      })
      .then((data) => {
          console.log(data.articles);
          this.articles = data.articles;
      });

      this.userResults = this.afs.collection("users").valueChanges()
        .subscribe(activity => this.userResults = activity);
        console.log("User Following Activity: " + this.userResults);
      
      // const queryObservable = this.userQuery.pipe(
      //   switchMap(fullName => 
      //     this.afs.collection('users', ref => ref.where('fullNameSearch', '==', fullName.toUpperCase())).valueChanges()
      //   )
      // );
      // queryObservable.subscribe(queriedItems => {
      //   console.log(queriedItems);  
      // });
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
    let q = $event.target.value;
    fetch(this.searchUrl + q + this.tokenUrl + this.apiKey)
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          console.log(data);
      });
  }

  searchUsers($event) {
    let q = $event.target.value;
    console.log("query: " + q);
    this.userQuery.next(q + "\uf8ff")
  }

  searchUsers2($event) {
    let q = $event.target.value;
    console.log("query: " + q);
    this.userResults = this.afs.collection('users', ref => ref.where('fullNameSearch', '==', q.toUpperCase())).valueChanges();
  }

  openArticle($event, article) {
    this.globalProps.title = article.title;
    this.globalProps.articleUrl = article.url;
    this.globalProps.publishDate = article.publishedAt;
    this.globalProps.publisher = article.source.name;
    this.globalProps.titleID = article.title.replace(/[^A-Z0-9]+/ig, "-");
    console.log(this.globalProps);
    this.router.navigateByUrl('tabs/search/article/' + this.globalProps.titleID)
  }
  
}