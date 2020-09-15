import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserFollowersPageRoutingModule } from './user-followers-routing.module';

import { UserFollowersPage } from './user-followers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserFollowersPageRoutingModule
  ],
  declarations: [UserFollowersPage]
})
export class UserFollowersPageModule {}
