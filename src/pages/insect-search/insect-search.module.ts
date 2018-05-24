import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InsectSearchPage } from './insect-search';

@NgModule({
  declarations: [
    InsectSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(InsectSearchPage),
  ],
})
export class InsectSearchPageModule {}
