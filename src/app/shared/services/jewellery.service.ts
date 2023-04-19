import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Image } from '../models/Image';

@Injectable({
  providedIn: 'root'
})
export class JewelleryService {

  collectionName = 'Images'

  constructor(private angularFirestore: AngularFirestore) { }

  update(image: Image) {
    return this.angularFirestore.collection<Image>(this.collectionName).doc(image.id).set(image);
  }
}
