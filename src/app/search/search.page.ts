import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { environment } from '../../environments/environment';
import { GlobalParamsService } from '../global-params.service';
import { IonContent, Platform } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss']
})

export class SearchPage implements OnInit  {

  @ViewChild(IonContent, {static: true}) content: IonContent;

  backToTop: boolean = false;

  showLoader: boolean = true;

  searchTerm: string;
  userQuery = new Subject<string>();
  newsQuery: string;

  startAt = new Subject();
  endAt = new Subject();

  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();

  userResults;
  articles = [];

  topNewsUrl: string = environment.newsApi.topNewsUrl;
  searchUrl: string = environment.newsApi.searchUrl;
  tokenUrl: string = environment.newsApi.tokenURL;
  apiKey: string = environment.newsApi.key;

  searchingNews: boolean = true;
  searchingUsers: boolean = false;

  constructor(private router: Router,
              public platform: Platform,
              private afs: AngularFirestore,
              public globalProps: GlobalParamsService) { }
              
  ngOnInit() {
    fetch(this.topNewsUrl + this.tokenUrl + this.apiKey)
      .then((response) => {
          return response.json();
      })
      .then((data) => {
          this.articles = data.articles;
          this.showLoader = false;
      });
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

  segmentChanged(ev: any) {
    if (ev.detail.value === "news") {
      this.searchingNews = true;
      this.searchingUsers = false;
    }
    else if (ev.detail.value === "users") {
      this.showLoader = true;
      this.searchingNews = false;
      this.searchingUsers = true;
      this.showLoader = false;
      combineLatest([this.startobs, this.endobs]).subscribe((value) => {
        this.fireQuery(value[0], value[1]).subscribe(users => {
          this.userResults = users;
        })
      })
    }
  }          

  openUser($event, user) {
    this.router.navigateByUrl('tabs/search/user/' + user.uid);
  }

  searchNews($event) {
    let q = $event.target.value;
    fetch(this.searchUrl + q + this.tokenUrl + this.apiKey)
      .then((response) => {
          return response.json();
      })
      .then((data) => {
          this.articles = data.articles;
      });
  }

  searchUsers($event) {
    let q = $event.target.value;
    let nq = q.toUpperCase();
    this.startAt.next(nq);
    this.endAt.next(nq + '\uf8ff')
  }

  fireQuery(start, end) {
    return this.afs.collection("users", ref => ref.orderBy('fullNameSearch').startAt(start).endAt(end)).valueChanges();
  }

  openArticle($event, article) {
    this.globalProps.title = article.title;
    this.globalProps.articleUrl = article.url;
    this.globalProps.image = article.image;
    this.globalProps.content = article.content;
    this.globalProps.description = article.description;
    this.globalProps.publishDate = article.publishedAt;
    this.globalProps.publisher = article.source.name;
    this.globalProps.titleID = article.title.replace(/[^A-Z0-9]+/ig, "-");
    this.router.navigateByUrl('tabs/search/article/' + this.globalProps.titleID)
  }
  
}