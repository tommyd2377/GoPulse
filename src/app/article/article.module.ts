import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArticlePageRoutingModule } from './article-routing.module';

import { ArticlePage } from './article.page';
import { SendToPageModule } from '../send-to/send-to.module';
import { CommentRepliesPageModule } from '../comment-replies/comment-replies.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArticlePageRoutingModule,
    SendToPageModule,
    CommentRepliesPageModule
  ],
  declarations: [ArticlePage]
})
export class ArticlePageModule {}
