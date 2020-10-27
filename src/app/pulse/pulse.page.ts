import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { GlobalParamsService } from '../global-params.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare var require: any

@Component({
  selector: 'app-pulse',
  templateUrl: 'pulse.page.html',
  styleUrls: ['pulse.page.scss']
})

export class PulsePage implements OnInit {

  articles: string[];

  constructor(private router: Router,
              public http: HttpClient,
              public globalProps: GlobalParamsService) { }

  ngOnInit() {
    this.worldNews();
  }

  worldNews() {
    let news = [];
    const httpOptions : Object = {
      headers: new HttpHeaders({
        'Accept': 'text/xml',
        'Content-Type': 'text/xml',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }),
      responseType: 'text'
    };

    this.http.get("https://cors-anywhere.herokuapp.com/https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-US&gl=US&ceid=US:en", httpOptions)
      .subscribe((response) => {
        let parseString = require('xml2js').parseString;
        parseString(response, function (err, result) {
           let newsItems = result.rss.channel[0].item;
           console.log(newsItems);
           for (let i of newsItems) {
             news.push(i);
           }
        })
      })
      this.articles = news;
  }

  segmentChanged(ev: any) {
    let topic = ev.detail.value;
    console.log('Segment changed', topic);
    let news = [];
    const httpOptions : Object = {
      headers: new HttpHeaders({
        'Accept': 'text/xml',
        'Content-Type': 'text/xml',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
      }),
      responseType: 'text'
    };

    this.http.get("https://cors-anywhere.herokuapp.com/https://news.google.com/rss/headlines/section/topic/" + topic + "?hl=en-US&gl=US&ceid=US:en", httpOptions)
      .subscribe((response) => {
        let parseString = require('xml2js').parseString;
        parseString(response, function (err, result) {
           let newsItems = result.rss.channel[0].item;
           console.log(newsItems);
           for (let i of newsItems) {
             news.push(i);
           }
        })
      })
      this.articles = news;  
  }
  
  openArticle($event, article) {
    console.log($event, article);
    this.globalProps.title = article.title[0];
    this.globalProps.articleUrl = article.link[0];
    this.globalProps.publishDate = article.pubDate[0];
    this.globalProps.publisher = article.source[0]._;
    let newTitle: string = article.title[0];
    this.globalProps.titleID = newTitle.replace(/[^A-Z0-9]+/ig, "-");
    console.log(this.globalProps);
    this.router.navigateByUrl('tabs/pulse/article/' + this.globalProps.titleID);
  }

}