import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { GlobalParamsService } from '../global-params.service';

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
  worldArticles: string[];
  nationArticles: string[];
  businessArticles: string[];
  technologyArticles: string[];
  entertainmentArticles: string[];
  sportsArticles: string[];
  scienceArticles: string[];
  healthArticles: string[];

  worldIsTrue: boolean;
  nationIsTrue: boolean;
  businessIsTrue: boolean;
  technologyIsTrue: boolean;
  entertainmentIsTrue: boolean;
  sportsIsTrue: boolean;
  scienceIsTrue: boolean;
  healthIsTrue: boolean;

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
      this.worldArticles = data.articles;
      this.worldIsTrue = true;
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
    let topic: string = ev.detail.value;
      switch (topic) {
        case "world":
          if (this.worldArticles) {
            this.worldIsTrue = true;
            this.nationIsTrue = false;
            this.businessIsTrue = false;
            this.technologyIsTrue = false;
            this.entertainmentIsTrue = false;
            this.sportsIsTrue = false;
            this.scienceIsTrue = false;
            this.healthIsTrue = false;
          }
          else {
            fetch(this.topicsUrl + topic + this.tokenUrl + this.apiKey)
            .then((response) => {
              return response.json()
            })
            .then((data) => {
              this.worldIsTrue = true;
              this.nationIsTrue = false;
              this.businessIsTrue = false;
              this.technologyIsTrue = false;
              this.entertainmentIsTrue = false;
              this.sportsIsTrue = false;
              this.scienceIsTrue = false;
              this.healthIsTrue = false;
              this.worldArticles = data.articles;
            })
          }
          break;

        case "nation":
          if (this.nationArticles) {
            this.worldIsTrue = false;
            this.nationIsTrue = true;
            this.businessIsTrue = false;
            this.technologyIsTrue = false;
            this.entertainmentIsTrue = false;
            this.sportsIsTrue = false;
            this.scienceIsTrue = false;
            this.healthIsTrue = false;
          }
          else {
            fetch(this.topicsUrl + topic + this.tokenUrl + this.apiKey)
            .then((response) => {
              return response.json()
            })
            .then((data) => {
              this.worldIsTrue = false;
              this.nationIsTrue = true;
              this.businessIsTrue = false;
              this.technologyIsTrue = false;
              this.entertainmentIsTrue = false;
              this.sportsIsTrue = false;
              this.scienceIsTrue = false;
              this.healthIsTrue = false;
              this.nationArticles = data.articles;
            })
          }
          break;
        
        case "business":
          if (this.businessArticles) {
            this.worldIsTrue = false;
            this.nationIsTrue = false;
            this.businessIsTrue = true;
            this.technologyIsTrue = false;
            this.entertainmentIsTrue = false;
            this.sportsIsTrue = false;
            this.scienceIsTrue = false;
            this.healthIsTrue = false;
          }
          else {
            fetch(this.topicsUrl + topic + this.tokenUrl + this.apiKey)
            .then((response) => {
              return response.json()
            })
            .then((data) => {
              this.worldIsTrue = false;
              this.nationIsTrue = false;
              this.businessIsTrue = true;
              this.technologyIsTrue = false;
              this.entertainmentIsTrue = false;
              this.sportsIsTrue = false;
              this.scienceIsTrue = false;
              this.healthIsTrue = false;
              this.businessArticles = data.articles;
            })
          }
          break;

          case "technology":
          if (this.technologyArticles) {
            this.worldIsTrue = false;
            this.nationIsTrue = false;
            this.businessIsTrue = false;
            this.technologyIsTrue = true;
            this.entertainmentIsTrue = false;
            this.sportsIsTrue = false;
            this.scienceIsTrue = false;
            this.healthIsTrue = false;
          }
          else {
            fetch(this.topicsUrl + topic + this.tokenUrl + this.apiKey)
            .then((response) => {
              return response.json()
            })
            .then((data) => {
              this.worldIsTrue = false;
              this.nationIsTrue = false;
              this.businessIsTrue = false;
              this.technologyIsTrue = true;
              this.entertainmentIsTrue = false;
              this.sportsIsTrue = false;
              this.scienceIsTrue = false;
              this.healthIsTrue = false;
              this.technologyArticles = data.articles;
            })
          }
          break;

          case "entertainment":
          if (this.entertainmentArticles) {
            this.worldIsTrue = false;
            this.nationIsTrue = false;
            this.businessIsTrue = false;
            this.technologyIsTrue = false;
            this.entertainmentIsTrue = true;
            this.sportsIsTrue = false;
            this.scienceIsTrue = false;
            this.healthIsTrue = false;
          }
          else {
            fetch(this.topicsUrl + topic + this.tokenUrl + this.apiKey)
            .then((response) => {
              return response.json()
            })
            .then((data) => {
              this.worldIsTrue = false;
              this.nationIsTrue = false;
              this.businessIsTrue = false;
              this.technologyIsTrue = false;
              this.entertainmentIsTrue = true;
              this.sportsIsTrue = false;
              this.scienceIsTrue = false;
              this.healthIsTrue = false;
              this.entertainmentArticles = data.articles;
            })
          }
          break;

          case "sports":
          if (this.sportsArticles) {
            this.worldIsTrue = false;
            this.nationIsTrue = false;
            this.businessIsTrue = false;
            this.technologyIsTrue = false;
            this.entertainmentIsTrue = false;
            this.sportsIsTrue = true;
            this.scienceIsTrue = false;
            this.healthIsTrue = false;
          }
          else {
            fetch(this.topicsUrl + topic + this.tokenUrl + this.apiKey)
            .then((response) => {
              return response.json()
            })
            .then((data) => {
              this.worldIsTrue = false;
              this.nationIsTrue = false;
              this.businessIsTrue = false;
              this.technologyIsTrue = false;
              this.entertainmentIsTrue = false;
              this.sportsIsTrue = true;
              this.scienceIsTrue = false;
              this.healthIsTrue = false;
              this.sportsArticles = data.articles;
            })
          }
          break;

          case "science":
          if (this.scienceArticles) {
            this.worldIsTrue = false;
              this.nationIsTrue = false;
              this.businessIsTrue = false;
              this.technologyIsTrue = false;
              this.entertainmentIsTrue = false;
              this.sportsIsTrue = false;
              this.scienceIsTrue = true;
              this.healthIsTrue = false;
          }
          else {
            fetch(this.topicsUrl + topic + this.tokenUrl + this.apiKey)
            .then((response) => {
              return response.json()
            })
            .then((data) => {
              this.nationIsTrue = false;
              this.businessIsTrue = false;
              this.technologyIsTrue = false;
              this.entertainmentIsTrue = false;
              this.sportsIsTrue = false;
              this.scienceIsTrue = true;
              this.healthIsTrue = false;
              this.scienceArticles = data.articles;
            })
          }
          break;

          case "health":
          if (this.healthArticles) {
            this.nationIsTrue = false;
            this.businessIsTrue = false;
            this.technologyIsTrue = false;
            this.entertainmentIsTrue = false;
            this.sportsIsTrue = false;
            this.scienceIsTrue = false;
            this.healthIsTrue = true;
          }
          else {
            fetch(this.topicsUrl + topic + this.tokenUrl + this.apiKey)
            .then((response) => {
              return response.json()
            })
            .then((data) => {
              this.nationIsTrue = false;
              this.businessIsTrue = false;
              this.technologyIsTrue = false;
              this.entertainmentIsTrue = false;
              this.sportsIsTrue = false;
              this.scienceIsTrue = false;
              this.healthIsTrue = true;
              this.healthArticles = data.articles;
            })
          }
          break;
      }
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