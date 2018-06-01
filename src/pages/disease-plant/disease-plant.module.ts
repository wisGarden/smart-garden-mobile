import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiseasePlantPage } from './disease-plant';

@NgModule({
  declarations: [
    DiseasePlantPage,
  ],
  imports: [
    IonicPageModule.forChild(DiseasePlantPage),
  ],
})
export class DiseasePlantPageModule {}
