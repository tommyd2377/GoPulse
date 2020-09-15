import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendToPageRoutingModule } from './send-to-routing.module';

import { SendToPage } from './send-to.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SendToPageRoutingModule
  ],
  declarations: [SendToPage],
  entryComponents: [SendToPage],
})
export class SendToPageModule {}
