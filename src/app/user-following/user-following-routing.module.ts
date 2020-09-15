import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserFollowingPage } from './user-following.page';

const routes: Routes = [
  {
    path: '',
    component: UserFollowingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserFollowingPageRoutingModule {}
