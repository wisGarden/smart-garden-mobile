import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiseaseReasoningPage } from './disease-reasoning';

@NgModule({
  declarations: [
    DiseaseReasoningPage,
  ],
  imports: [
    IonicPageModule.forChild(DiseaseReasoningPage),
  ],
})
export class DiseaseReasoningPageModule {}
