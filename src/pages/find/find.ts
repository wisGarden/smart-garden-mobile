import { Component } from '@angular/core';
import {App, IonicPage, NavParams} from 'ionic-angular';
import {PlantListPage} from "../plant-list/plant-list";
import {GameMainPage} from "../game-main/game-main";
import {SceneryMainPage} from "../scenery-main/scenery-main";

/**
 * Generated class for the FindPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-find',
  templateUrl: 'find.html',
})
export class FindPage {

  constructor(public app: App, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindPage');
  }

  jumpToPlantList() {
      this.app.getRootNavs()[0].push(PlantListPage);
  }

  jumpToScenery() {
      this.app.getRootNavs()[0].push(SceneryMainPage);
  }

  jumpToGame() {
      this.app.getRootNavs()[0].push(GameMainPage);
  }
}
