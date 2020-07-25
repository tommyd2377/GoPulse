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

  worldRequest: string;
  worldResults: Object[];
  worldView: boolean;

  baseUrl: string = environment.newsApi.baseURL;
  tokenUrl: string = environment.newsApi.tokenURL;
  apiKey: string = environment.newsApi.key;
  category: string = "world";


  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              private afs: AngularFirestore) { }

  ngOnInit() {
    fetch(this.baseUrl + this.category + this.tokenUrl + this.apiKey)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
          console.log(data);
      });
  }

  newsByTopic(topic: string) {
    fetch(this.baseUrl + this.category + this.tokenUrl + this.apiKey)
      .then((response) => {
          return response.json();
      })
      .then((data) => {
          console.log(data);
      });
  }
  
  openArticle() {
    this.router.navigateByUrl('article/')
  }

}