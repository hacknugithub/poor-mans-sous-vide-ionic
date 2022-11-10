import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-cooking',
  templateUrl: './cooking.page.html',
  styleUrls: ['./cooking.page.scss']
})

export class CookingPage implements OnInit {

  sel_temp: any;
  sel_time: any;
  full_time: any;
  hr: any;
  mm: any;
  ss: any;
  
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.sel_temp = this.activatedRoute.snapshot.paramMap.get('temp');
    this.sel_time = this.activatedRoute.snapshot.paramMap.get('time');
    this.full_time = this.activatedRoute.snapshot.paramMap.get('full_time');

    this.sliceTime(this.sel_time);
    console.log("time is: ", this.sel_time);
    console.log("temp is: ", this.sel_temp);
  }

  sliceTime(time){
    this.hr = time.substr(0,2);
    this.mm = time.substr(3,2);
    this.ss = time.substr(6,2);
  }

}
