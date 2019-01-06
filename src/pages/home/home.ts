import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UploadPage } from '../upload/upload';
import { UploadProvider } from '../../providers/upload/upload';

import { SocialSharing } from '@ionic-native/social-sharing';
import { Post } from '../../models/post.model';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  uploadPage:any = UploadPage;

  pictures: any[];
  MorePictures: boolean = true;

  constructor(public navCtrl: NavController,
              private _post: UploadProvider,
              private socialSharing: SocialSharing,
              public alertCtrl: AlertController) {
        
                this.pictures = this.getPictures();
  }

  getPictures() {
    return this._post.postList;
  }

  doInfinite(infiniteScroll) {
    this._post.getPictures()
     .subscribe((res:boolean) => {
       this.MorePictures = res;
       infiniteScroll.complete();
     })
  }

  shareWithFacebook(post: Post): void {
   this.socialSharing.shareViaFacebook(post.title, null, post.img)
    .then(() => {
      console.log("Shared!");
    }).catch(err => {
      console.log(JSON.stringify(err));
    })
  }

  deletePost(post: Post, i: number): void {
    this.showConfirm(post, i);
  }

  showConfirm(post: Post, i: number) {
    this.alertCtrl.create({
      title: 'Delete Picture?',
      message: 'Do you want to delete this Picture?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this._post.removePicture(post, i);
          }
        }
      ]
    }).present();
  }

}
