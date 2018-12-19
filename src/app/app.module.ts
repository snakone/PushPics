import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { UploadPage } from '../pages/upload/upload';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule,
         AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { firebaseConfig } from '../firebase-config';
import { PipesModule } from '../pipes/pipes.module';

import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { UploadProvider } from '../providers/upload/upload';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    UploadPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    UploadPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    ImagePicker,
    UploadProvider
  ]
})
export class AppModule {}
