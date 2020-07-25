import { Component, OnInit } from '@angular/core';
//import { Content } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-article',
  templateUrl: './article.page.html',
  styleUrls: ['./article.page.scss'],
})

export class ArticlePage implements OnInit {

  constructor() { }

  apiKey: string = "c4931a014b7fd1f739c2f493b08d751a";

  ngOnInit() {
    //use titleId to retrieve data
    //read #, flag #, comment #, direct send #
    //article comments
  }

  //link to user from comment

}
