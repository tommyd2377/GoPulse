import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { GlobalParamsService } from '../global-params.service';

@Component({
  selector: 'app-pulse',
  templateUrl: 'pulse.page.html',
  styleUrls: ['pulse.page.scss']
})

export class PulsePage implements OnInit {

  articles = [];

  topicsUrl: string = environment.newsApi.topicsUrl;
  tokenUrl: string = environment.newsApi.tokenURL;
  apiKey: string = environment.newsApi.key;
  category: string = "world";

  constructor(private router: Router,
              public globalProps: GlobalParamsService) { }

  ngOnInit() {
    fetch(this.topicsUrl + this.category + this.tokenUrl + this.apiKey)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.articles = data.articles;
      });
  }

  segmentChanged(ev: any) {
    let topic = ev.detail.value;
    console.log('Segment changed', topic);
    console.log(this.topicsUrl + topic + this.tokenUrl + this.apiKey);
    fetch(this.topicsUrl + topic + this.tokenUrl + this.apiKey)
      .then((response) => {
        console.log(response);
          return response.json();
      })
      .then((data) => {
        console.log(data);
        this.articles = data.articles;
        console.log("Articles: " + topic + this.articles);
      });
  }
  
  openArticle($event, article) {
    console.log($event, article);
    this.globalProps.title = article.title;
    this.globalProps.articleUrl = article.url;
    this.globalProps.publishDate = article.publishedAt;
    this.globalProps.publisher = article.source.name;
    this.globalProps.titleID = article.title.replace(/[^A-Z0-9]+/ig, "-");
    console.log(this.globalProps);
    this.router.navigateByUrl('tabs/pulse/article/' + this.globalProps.titleID);
  }

}