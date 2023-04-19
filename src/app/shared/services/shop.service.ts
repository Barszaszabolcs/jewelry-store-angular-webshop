import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Image } from '../models/Image';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  collectionName = 'Images';

  // HTTP
  constructor(private http: HttpClient, private angularFirestore: AngularFirestore, private storage: AngularFireStorage) {}

  loadImageMeta(metaUrl: string): Observable<Array<Image>> {
    return this.angularFirestore.collection<Image>(this.collectionName).valueChanges();
  }

  loadImage(imageUrl: string) {
    return this.storage.ref(imageUrl).getDownloadURL();
  }
}
