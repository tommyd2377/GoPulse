import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
              public platform: Platform,
              private afs: AngularFirestore,
              public globalProps: GlobalParamsService) { }
              
  ngOnInit() {
    fetch('https://gnews.io/api/v4/top-headlines?&country=us&token=' + this.apiKey)
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
      this.userResults = this.afs.collection("users").valueChanges();
      this.showLoader = false;
    }
  }          

  openUser($event, user) {
    this.router.navigateByUrl('tabs/search/user/' + user.uid);
  }

  searchNews($event) {
    let q = $event.target.value;
    fetch("https://gnews.io/api/v4/search?q=" + q + "&country=us&token=" + this.apiKey)
      .then((response) => {
          return response.json();
      })
      .then((data) => {
          this.articles = data.articles;
      });
  }

  searchUsers($event) {
    let q = $event.target.value;
    this.userResults = this.afs.collection("users", ref => ref.where('fullName', '==', q)).valueChanges()
      .subscribe(activity => this.userResults = activity);
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