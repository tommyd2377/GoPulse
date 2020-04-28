import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignUpPageRoutingModule } from './sign-up-routing.module';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { SignUpPage } from './sign-up.page';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestore } from 'angularfire2/firestore';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignUpPageRoutingModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  declarations: [SignUpPage],
  providers: [
    FirebaseAuthentication,
    AngularFirestore
  ]
})
export class SignUpPageModule {}
