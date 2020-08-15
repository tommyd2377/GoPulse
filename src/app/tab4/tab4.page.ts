import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page {

  constructor(private router: Router) { }

  settings() {
    this.router.navigateByUrl('tabs/tab4/profile-settings')
  }

  editPicture() {
    console.log('edit')
  }

  //fetch profile info
  //display name, username, follower count, following count, friends count, activity

}
