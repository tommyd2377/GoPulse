import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { GlobalParamsService } from '../global-params.service';

declare var require: any

@Component({
  selector: 'app-pulse',
  templateUrl: 'pulse.page.html',
  styleUrls: ['pulse.page.scss']
})

export class PulsePage implements OnInit {

  articles: string[];

  topicsUrl: string = environment.newsApi.topicsUrl;
  tokenUrl: string = environment.newsApi.tokenURL;
  apiKey: string = environment.newsApi.key;
  category: string = "world";

  constructor(private router: Router,
              public globalProps: GlobalParamsService) { }

  ngOnInit() {
    fetch('https://gnews.io/api/v4/top-headlines?&country=us&topic=world&token=' + this.apiKey)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      console.log(data);
      this.articles = data.articles;
    });
  }

  segmentChanged(ev: any) {
    let topic = ev.detail.value;
    console.log('Segment changed', topic);
    let news = [];
    fetch('https://gnews.io/api/v4/top-headlines?&country=us&topic=' + topic + '&token=' + this.apiKey)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      console.log(data);
      this.articles = data.articles;
    });
  }
  
  openArticle($event, article) {
    console.log($event, article);
    this.globalProps.title = article.title;
    this.globalProps.image = article.image;
    this.globalProps.content = article.content;
    this.globalProps.description = article.description;
    this.globalProps.articleUrl = article.url;
    this.globalProps.publishDate = article.publishedAt;
    this.globalProps.publisher = article.source.name;
    let newTitle: string = article.title;
    this.globalProps.titleID = newTitle.replace(/[^A-Z0-9]+/ig, "-");
    console.log(this.globalProps);
    this.router.navigateByUrl('tabs/pulse/article/' + this.globalProps.titleID);
  }

}