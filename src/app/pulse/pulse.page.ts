import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { GlobalParamsService } from '../global-params.service';

declare var require: any

@Component({
  selector: 'app-pulse',
  templateUrl: 'pulse.page.html',
  styleUrls: ['pulse.page.scss']
})

export class PulsePage implements OnInit {

  @ViewChild(IonContent, {static: true}) content: IonContent;

  backToTop: boolean = false;

  showLoader: boolean = true;

  articles: string[];

  topicsUrl: string = environment.newsApi.topicsUrl;
  tokenUrl: string = environment.newsApi.tokenURL;
  apiKey: string = environment.newsApi.key;
  category: string = "world";

  constructor(private router: Router,
              public platform: Platform,  
              public globalProps: GlobalParamsService) { }

  ngOnInit() {
    fetch(this.topicsUrl + this.category + this.tokenUrl + this.apiKey)
    .then((response) => {
      return response.json()
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
    let topic = ev.detail.value;
    let news = [];
    fetch(this.topicsUrl + topic + this.tokenUrl + this.apiKey)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      this.articles = data.articles;
    });
  }
  
  openArticle($event, article) {
    this.globalProps.title = article.title;
    this.globalProps.image = article.image;
    this.globalProps.content = article.content;
    this.globalProps.description = article.description;
    this.globalProps.articleUrl = article.url;
    this.globalProps.publishDate = article.publishedAt;
    this.globalProps.publisher = article.source.name;
    let newTitle: string = article.title;
    this.globalProps.titleID = newTitle.replace(/[^A-Z0-9]+/ig, "-");
    this.router.navigateByUrl('tabs/pulse/article/' + this.globalProps.titleID);
  }

}