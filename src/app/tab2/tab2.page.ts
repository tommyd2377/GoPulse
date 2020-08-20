import { Component, OnInit  } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page implements OnInit {

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
    this.router.navigateByUrl('tabs/tab2/article/33')
  }

}