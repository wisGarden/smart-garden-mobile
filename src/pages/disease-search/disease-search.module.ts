import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiseaseSearchPage } from './disease-search';

@NgModule({
  declarations: [
    DiseaseSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(DiseaseSearchPage),
  ],
})
export class DiseaseSearchPageModule {}
