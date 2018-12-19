import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UploadPage } from '../upload/upload';

import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  uploadPage:any = UploadPage;
  pictures: Observable<any[]>;

  constructor(public navCtrl: NavController,
              afDB: AngularFireDatabase) {
      this.pictures = afDB.list('post').valueChanges();
  }

}
