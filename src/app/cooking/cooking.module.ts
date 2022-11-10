import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CookingPage } from './cooking.page';
import { TimerComponent } from '../components/timer/timer.component';

const routes: Routes = [
  {
    path: '',
    component: CookingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CookingPage, TimerComponent]
})
export class CookingPageModule {}
