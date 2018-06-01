import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InsectDetailPage } from './insect-detail';

@NgModule({
  declarations: [
    InsectDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(InsectDetailPage),
  ],
})
export class InsectDetailPageModule {}
