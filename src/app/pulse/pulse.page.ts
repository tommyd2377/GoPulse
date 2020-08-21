import { Component, OnInit  } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-pulse',
  templateUrl: 'pulse.page.html',
  styleUrls: ['pulse.page.scss']
})

export class PulsePage implements OnInit {

  results: Object[];

  topicsUrl: string = environment.newsApi.topicsUrl;
  tokenUrl: string = environment.newsApi.tokenURL;
  apiKey: string = environment.newsApi.key;
  category: string = "world";

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              private afs: AngularFirestore) { }

  ngOnInit() {
    fetch(this.topicsUrl + this.category + this.tokenUrl + this.apiKey)
      .then((response) => {
        return response.json();
      })
      .then((data) => {

          console.log(data);
      });
  }

  segmentChanged(ev: any) {
    let topic = ev.detail.value;
    console.log('Segment changed', topic);
    console.log(this.topicsUrl + topic + this.tokenUrl + this.apiKey);
    fetch(this.topicsUrl + topic + this.tokenUrl + this.apiKey)
      .then((response) => {
          return response.json();
      })
      .then((data) => {
        console.log(data);
        this.results = data;
      });
  }
  
  openArticle() {
    this.router.navigateByUrl('tabs/pulse/article/33')
  }

}