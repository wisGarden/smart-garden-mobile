import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SceneryListPage } from './scenery-list';

@NgModule({
  declarations: [
    SceneryListPage,
  ],
  imports: [
    IonicPageModule.forChild(SceneryListPage),
  ],
})
export class SceneryListPageModule {}
