import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommentRepliesPage } from './comment-replies.page';

const routes: Routes = [
  {
    path: '',
    component: CommentRepliesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommentRepliesPageRoutingModule {}
