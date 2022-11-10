import { Injectable } from '@angular/core';
import * as firebase from '@ionic-native/firebase';

@Injectable({
  providedIn: 'root'
})
export class FirebaseRDBService {

  data = [];
  info = {};
  res = {};
  ref = firebase.database().ref('/');

  constructor() {
    // this.ref.on('value', resp => {
    //   this.data = [];
    //   this.data = snapshotToArray(resp);
    //   console.log(this.data)
    // });
  }

  saveInfo(value:any, ref:string) {
    let newInfo = firebase.database().ref(ref).push();
    newInfo.set(value);
  }

  getInfo(ref:string) {
    firebase.database().ref(ref).on('value', resp=>{
      console.log(resp);
    });

  }

  testServ(something:number){
    return something + 1;
  }
}
