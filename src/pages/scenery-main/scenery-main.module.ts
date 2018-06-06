import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SceneryMainPage } from './scenery-main';

@NgModule({
  declarations: [
    SceneryMainPage,
  ],
  imports: [
    IonicPageModule.forChild(SceneryMainPage),
  ],
})
export class SceneryMainPageModule {}
