import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase/storage';

import { ToastController} from 'ionic-angular';

@Injectable()

export class UploadProvider {

  pictures: FileUpload[] = [];

  constructor(public toastCtrl: ToastController,
              public afDB: AngularFireDatabase) {
  }

  uploadToFireBase(picture:FileUpload){
    return new Promise ((res,req) => {

      this.presentToast("Uploading, Please Wait..");

      let storage = firebase.storage().ref(); // FireBase Storage
      let fileName = new Date().valueOf().toString();

      let uploadTask: firebase.storage.UploadTask =
          storage.child(`img/${fileName}`)
                 .putString(picture.img, 'base64', { contentType: 'image/jpg'});

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // Callback ->
          ()=> {}, // Percentage
          (err)=> {
            console.log("Error Loading Picture: " + JSON.stringify(err));
            this.presentToast(JSON.stringify(err));
            req();
        },
          ()=> { // Good 201
            console.log("Picture Upload Successfully");
            this.presentToast("Picture Upload Successfully");

            let url = uploadTask.snapshot.downloadURL;
            this.postPictureOnFireBase(picture.title,url,fileName);
            res();
          })
    });
  }

  presentToast(text:string) {
   this.toastCtrl.create({
     message: text,
     duration: 3000
    }).present();
  }

  private postPictureOnFireBase(title:string, url: string, fileName:string){

    let post: FileUpload = {
      img: url,
      title: title,
      key: fileName
    }

      this.afDB.object(`/post/${fileName}`).update(post);
      this.pictures.push(post);
  }

}

interface FileUpload {
  title:string;
  img:string;
  key?:string
}
