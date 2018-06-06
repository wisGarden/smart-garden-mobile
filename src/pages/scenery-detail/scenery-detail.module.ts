import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SceneryDetailPage } from './scenery-detail';

@NgModule({
  declarations: [
    SceneryDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SceneryDetailPage),
  ],
})
export class SceneryDetailPageModule {}
