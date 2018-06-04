import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GameResultPage } from './game-result';

@NgModule({
  declarations: [
    GameResultPage,
  ],
  imports: [
    IonicPageModule.forChild(GameResultPage),
  ],
})
export class GameResultPageModule {}
