import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendToPage } from './send-to.page';

const routes: Routes = [
  {
    path: '',
    component: SendToPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendToPageRoutingModule {}
