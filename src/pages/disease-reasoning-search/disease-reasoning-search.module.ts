import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiseaseReasoningSearchPage } from './disease-reasoning-search';

@NgModule({
  declarations: [
    DiseaseReasoningSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(DiseaseReasoningSearchPage),
  ],
})
export class DiseaseReasoningSearchPageModule {}
