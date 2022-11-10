import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})

export class ListPage implements OnInit {

  validations_form: FormGroup;
  formated_date: any;
  // temp: Number;
  // cook_time: String;

  constructor(public formBuilder: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      temp: new FormControl('', Validators.compose([
        Validators.maxLength(2),
        Validators.minLength(1),
        Validators.min(30),
        Validators.max(90),
        Validators.required
      ])),
      cookTime: new FormControl('', Validators.required)
    });

  }

  validation_messages = {
      'temp': [
        {type: 'required', message: 'Es necesario poner una temperatura.'},
        {type: 'maxLength', message: 'Selecciona una temperatura valida.'},
        {type: 'minLength', message: 'Selecciona una temperatura valida.'},
        {type: 'min', message: 'Selecciona una temperatura de coccion superior'},
        {type: 'max', message: 'Por seguridad no excedas los 90 grados C.'}
      ],
      'cook_time': [
        {type: 'required', message: 'Es necesario un tiempo de coccion'},
        {type: 'maxLength', message: 'No debes dejar tanto tiempo encendido el dispositivo'},
      ]
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
  onSubmit(values){
    this.formated_date = this.parseDate(values.cookTime);
    console.log(values);
    this.router.navigate(['/cooking', {'temp':values.temp, 'time':this.formated_date, 'full_time':values.cookTime}]);
  }

  parseDate(cook_date){
    return this.formated_date = cook_date.slice(11,-10);
    // console.log('parsed date: ', this.formated_date);
  }
}
