import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  constructor() { }

  activity = [{user: "TommyD",
    title: "Who will win the 2020 Presidential election?",
    publisher: "The Wall Street Journal",
    date: "August 8th, 2020"},
    {user: "TommyD2",
    title: "it works",
    publisher: "wired",
    date: "August 8th, 2020"},
    {user: "TommyD3",
    title: "it works",
    publisher: "wired",
    date: "August 8th, 2020"},
    {user: "TommyD5",
    title: "it works", publisher: "wired",
    date: "August 8th, 2020"},
    {user: "TommyD",
    title: "it works",
    publisher: "wired",
    date: "August 8th, 2020"},
  ]

  ngOnInit() {
  }

}
