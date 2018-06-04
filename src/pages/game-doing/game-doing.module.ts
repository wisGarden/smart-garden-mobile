import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GameDoingPage } from './game-doing';

@NgModule({
  declarations: [
    GameDoingPage,
  ],
  imports: [
    IonicPageModule.forChild(GameDoingPage),
  ],
})
export class GameDoingPageModule {}
