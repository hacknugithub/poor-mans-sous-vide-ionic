import { Component, OnInit, Input } from '@angular/core';
// ÷import { Observable } from 'rxjs/Observable';
import { timer, interval, Observable, of} from 'rxjs';
// import 'rxjs/add/observable/interval';
// import 'rxjs/add/observable/timer';
import * as firebase from 'firebase/app';
import { AlertController, ToastController } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';




@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})

export class TimerComponent implements OnInit {

  timerVar: any;
  timerVal: any;

  preTimer: any;
  preTimerVal: any;

  @Input() sel_temp: string
  @Input() sel_time: string
  @Input() full_time: string
  @Input() hr: number
  @Input() mm: number
  @Input() ss: number

  time: any;
  temp: any;

  act_temp: any;
  pre_temp: any;

  timerStat: any;
  heating: any;
  isPreheatingVal: any;
  processStat: any;

  timer_total: number;
  timer_current: number;

  data ={};
  constructor(public alertController: AlertController, private nativeAudio: NativeAudio, public toastController: ToastController) {
   }

  ngOnInit() {
    this.time = {
      'hours': this.hr,
      'minutes': this.mm,
      'seconds': this.ss
    }
    this.temp = {
      'init': this.sel_temp,
      'actual': this.act_temp
    };
    this.timerStat = true;
    this.heating = 'medium';

    var total_time_sec = this.getTotalTimeInSeconds(this.full_time);

    console.log('temp from cooking page: ', this.sel_temp);
    console.log('full time from cooking page: ', this.full_time);
    console.log('full time in seconds: ', total_time_sec);

    this.processStat = 'Off'

    this.nativeAudio.preloadSimple('ringtoneId', 'assets/audio/ring1.mp3').then(res=>{console.log('alarm loaded',res)}, err=>{console.log(err)});
    this.nativeAudio.preloadSimple('readyCookId', 'assets/audio/ring2.mp3').then(res=>{console.log('preheated tune loaded',res)}, err=>{console.log(err)});


  }

  ngOnDestroy(){
    if(this.timerVal){
      this.timerVal.unsubscribe();
    }
    if(this.preTimerVal){
      this.preTimerVal.unsubscribe();
    }
    this.nativeAudio.unload('ringtoneId').then(res=>{console.log('alarm unloaded',res)}, err=>{console.log(err)});
    this.nativeAudio.unload('readyCookId').then(res=>{console.log('preheated tune unloaded',res)}, err=>{console.log(err)});
  }

  startProcess(){
    this.timerStat = !this.timerStat;
    this.setCookingTemp(parseFloat(this.sel_temp));

    this.preTimer = interval(1000);
    this.preTimerVal = this.preTimer.subscribe(y =>{

      this.pre_temp = this.getActualTemp();
      this.isPreheatingVal = this.isPreHeating(parseFloat(this.sel_temp),this.pre_temp);
      if(this.isPreheatingVal){
        console.log('is preheating');
        this.processStat = 'Pre Heating';
        this.heating = this.getHeatingStatus();
        if(this.pre_temp){
          this.temp.actual = parseFloat(this.pre_temp).toFixed(2);
        } else {
          this.temp.actual = 0.0;
        }
      } else {
        this.preTimerVal.unsubscribe();
        this.nativeAudio.play('readyCookId', () => console.log('Insert the bag into the water!'));
        this.showToast('Insert the bag into the water!');
        this.startTimer();
      }
    });
  }

  async showToast(message: string){
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  startTimer(){
    // this.timerStat = !this.timerStat;
    // this.heating = 'warning';
    // this.setCookingTemp(parseFloat(this.sel_temp));
    this.countDown();
    this.processStat = 'Cooking';
    console.log('is cookin');
    //  if(this.isPreHeating(parseFloat(this.sel_temp))){
    //   console.log('is preheating');
    //  } else {

    //  }
  }

  isPreHeating(cooking_temp, actual_temp){
    console.log('actual temp is: ', actual_temp);
    console.log('cooking temp is: ', cooking_temp);
    // let calibration_temp = 2;
    // cooking_temp = cooking_temp - calibration_temp;
    let preHeat = true;
    if((actual_temp == cooking_temp) || (actual_temp > cooking_temp) ){
      preHeat = false;
    } else {
      preHeat = true;
    }
    return preHeat;
  }

  stopTimer(){
    this.timerStat = !this.timerStat;
    this.heating = 'medium';
    this.processStat = 'Off';
    if(this.timerVal){
      this.timerVal.unsubscribe();
      this.time.seconds = this.ss;
      this.time.minutes = this.mm;
      this.time.hours = this.hr;
    }
    if(this.preTimerVal){
      this.preTimerVal.unsubscribe();
    }
    firebase.database().ref('status').set('off');

    console.log('is not cookin anymore');

  }

  getTotalTimeInSeconds(date:string){
  var date1 = new Date(date);
  return this.timer_total = date1.getSeconds() + (date1.getMinutes() * 60) + (date1.getHours()*60*60);
  }

  updateTime(current_time){
      var seconds = current_time;
      const format = val => `0${Math.floor(val)}`.slice(-2)
      const hours = seconds / 3600
      const minutes = (seconds % 3600) / 60

      // return [hours, minutes, seconds %= 60].map(format).join(':');
      return [hours, minutes, seconds %= 60].map(format);
  }

  countDown(){

      this.timerVar = interval(1000);
      this.timerVal = this.timerVar.subscribe(x=>{
        // console.log('subscribe val is: ', x);
        if(x == this.timer_total){
          this.timerVal.unsubscribe();
          this.stopTimer();
          this.playAlarm();
          this.showAlert();
          // alert('Timer has reached end');
        } else {
          this.act_temp = this.getActualTemp();
          this.isPreheatingVal = this.isPreHeating(parseFloat(this.sel_temp),this.act_temp);
          // console.log('preheating: ', this.isPreheatingVal);
          // if(this.isPreheatingVal){
            // console.log('is preheating');
            // this.heating = this.getHeatingStatus();
            // this.temp.actual = parseFloat(this.act_temp).toFixed(2);
            // this.elapsedPreHeating = x;
            // console.log('elapsed secs preheating: ', this.elapsedPreHeating);

          // } else {
            // this.timer_current = (this.timer_total - x) + this.elapsedPreHeating;
            this.timer_current = this.timer_total - x;
            var display_time = this.updateTime(this.timer_current);
            this.time.seconds = display_time[2];
            this.time.minutes = display_time[1];
            this.time.hours = display_time[0];
            console.log(display_time);
            this.heating = this.getHeatingStatus();
            this.temp.actual = parseFloat(this.act_temp).toFixed(2);
            console.log(this.act_temp);
          // }
        }
      });
  }

  getActualTemp(){
    firebase.database().ref('currentTemp').on('value', resp =>{
      this.data = snapshotToObject(resp);
    });
    // this.act_temp = this.firebaseRDBService.getInfo('currentTemp')

    return this.data;
  }

  getHeatingStatus(){
    firebase.database().ref('heating').on('value', resp =>{
      this.data = snapshotToObject(resp);
    });
    if(this.data){
      this.data = 'warning';
    } else {
      this.data = 'medium';
    }
    // this.act_temp = this.firebaseRDBService.getInfo('currentTemp')
    return this.data;
  }

  setCookingTemp(value){
    firebase.database().ref('initTemp').set(value);
    firebase.database().ref('status').set('on');
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Cooking is done!',
      message: 'Your cooking is <strong>done</strong>, remove from water now. !!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            this.stopAlarm();
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.stopAlarm();
          }
        }
      ]
    });

    await alert.present();
  }

  playAlarm(){
    this.nativeAudio.loop('ringtoneId').then(res=>{console.log(res)}, err=>{console.log(err)});
  }

  stopAlarm(){
    this.nativeAudio.stop('ringtoneId').then(res=>{console.log(res)}, err=>{console.log(err)});
  }

}

export const snapshotToObject = snapshot => {
  let item = snapshot.val();
  return item;
}
