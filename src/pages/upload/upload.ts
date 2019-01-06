import { Component } from '@angular/core';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { UploadProvider } from '../../providers/upload/upload';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})

export class UploadPage {

  title: string = "";
  imagePreview: string = "";
  image64: string;
  percent: number;

  constructor(private camera: Camera,
              public _uploadFireBase: UploadProvider,
              public navCtrl: NavController) {
          this.percent = _uploadFireBase.percent;
  }

  openCamera(){

    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
       this.imagePreview = 'data:image/jpg;base64,' + imageData;
       this.image64 = imageData;
      }, (err) => {
       console.log("Camera Error " + JSON.stringify(err));
       this._uploadFireBase.presentToast("Image not Supported. Try another.");
    });
  }

  selectPicture(){

    const options: CameraOptions = {
       quality: 50,
       destinationType: this.camera.DestinationType.DATA_URL,
       encodingType: this.camera.EncodingType.JPEG,
       mediaType: this.camera.MediaType.PICTURE,
       sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

     this.camera.getPicture(options).then((imageData:string) => {
       this.imagePreview = 'data:image/jpg;base64,' + imageData;
       this.image64 = imageData;
     }, (err) => {
         console.log("Error picking Picture: ", JSON.stringify(err));
         this._uploadFireBase.presentToast("Image not Supported. Try another.");
     });
  }

  uploadPicture(){

    let file = {
      title: this.title,
      img: this.image64
    }

    this._uploadFireBase.uploadToFireBase(file)
     .then(()=> {
       this.navCtrl.pop();
     });
  }

}
