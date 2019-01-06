import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';
import firebase from 'firebase';

import { ToastController} from 'ionic-angular';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Post } from '../../models/post.model';

@Injectable()

export class UploadProvider {

  postList: Post[] = [];
  lastPost: string = null;
  percent: number;

  constructor(public toastCtrl: ToastController,
              public afDB: AngularFireDatabase) {
          this.getLastPicture()
          .pipe(switchMap(()=> this.getPictures()))
          .subscribe()
  }

  uploadToFireBase(picture:Post) {
    return new Promise ((res,req) => {

      this.presentToast("Uploading, Please Wait..");

      let storage = firebase.storage().ref(); // FireBase Storage
      let fileName = new Date().valueOf().toString();

      let uploadTask: firebase.storage.UploadTask =
          storage.child(`img/${fileName}`)
                 .putString(picture.img, 'base64', { contentType: 'image/jpg'});

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // Callback ->
          (res)=> {
           console.log(res)
          }, // Percentage
          (err)=> {
            console.log("Error Loading Picture: " + JSON.stringify(err));
            this.presentToast(JSON.stringify(err));
            req();
        },
          ()=> { // Good 201
            console.log("Picture Upload Successfully");
            this.presentToast("Picture Upload Successfully");

            uploadTask.snapshot.ref.getDownloadURL()
             .then(url => {
              this.postPictureOnFireBase(picture.title,url,fileName);
              res();
             })
             .catch(err => {
               console.log(JSON.stringify(err));
             });
          });
    });
  }

  private getLastPicture(): Observable<any> {
    return this.afDB.list('/post', ref => {
      return ref.orderByKey().limitToLast(1)
    })
    .valueChanges()
    .pipe(
      map((post:Post[]) => {
        this.postList = [];
        
        if (post.length == 0) return;
    
        this.lastPost = post[0].key;
        this.postList.push(post[0]);
      })
    );
  }

  getPictures(): Observable<any> {
    return this.afDB.list('/post', ref => {
     return ref.orderByKey()
               .limitToLast(3)
               .endAt(this.lastPost || '')             
    })
    .valueChanges()
    .pipe(
      map((post:Post[]) => {
        post.pop();
        if (post.length == 0) {
          console.log("No more Pictures");
          return false;
        }

        this.lastPost = post[0].key;

        for (let i = post.length -1; i >= 0; i--) {
          this.postList.push(post[i]);
        }
        
        return true;
      })
    );
  }

  removePicture(post: Post, i: number): void {
    this.afDB.object(`/post/${post.key}`).remove();
    this.postList.splice(i, 1);
    let storage = firebase.storage().ref(`img/${post.key}`); // FireBase Storage
    storage.delete().then(() => {
      console.log("Deleted from Storage");
      this.presentToast('Deleted Successfully');
    });
  }

  private postPictureOnFireBase(title:string, url: string, fileName:string): void {

    let post: Post = {
      img: url,
      title: title,
      key: fileName
    }

      this.afDB.object(`/post/${fileName}`).update(post);
  }

  presentToast(text:string) {
    this.toastCtrl.create({
      message: text,
      duration: 3000
     }).present();
   }

}

