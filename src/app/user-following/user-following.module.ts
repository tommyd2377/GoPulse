import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserFollowingPageRoutingModule } from './user-following-routing.module';

import { UserFollowingPage } from './user-following.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserFollowingPageRoutingModule
  ],
  declarations: [UserFollowingPage]
})
export class UserFollowingPageModule {}
