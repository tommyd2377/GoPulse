import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserFollowersPage } from './user-followers.page';

const routes: Routes = [
  {
    path: '',
    component: UserFollowersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserFollowersPageRoutingModule {}
