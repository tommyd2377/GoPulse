import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommentRepliesPageRoutingModule } from './comment-replies-routing.module';

import { CommentRepliesPage } from './comment-replies.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommentRepliesPageRoutingModule
  ],
  declarations: [CommentRepliesPage]
})
export class CommentRepliesPageModule {}
