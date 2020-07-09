import { Component, ViewChild } from '@angular/core';
//import { Content } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class homePage {

  //@ViewChild(Content) content: Content;

  constructor() {}

  //retrieve users/uid/following-activity collection
  //this.afs.collection("users").doc(uid).collection("following-activity").valueChanges()
  //.map((array) => array.reverse()) as Observable<any[]>;

  //retrieve users/uid/inbound-direct-sends
  //this.afs.collection("users").doc(uid).collection("unread-direct-sends").valueChanges()
  //.map((array) => array.reverse()) as Observable<any[]>;
  
  //after article opened remove from unread-direct-sends to read & activity
  //this.afs.collection("users").doc(uid).collection("read-direct-sends").valueChanges()
  //.map((array) => array.reverse()) as Observable<any[]>;
  //this.afs.collection("users").doc(uid).collection("activity").valueChanges()
  //.map((array) => array.reverse()) as Observable<any[]>;

}