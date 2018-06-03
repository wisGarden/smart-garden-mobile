import { Component } from '@angular/core';
import {App, IonicPage, NavParams} from 'ionic-angular';
import {PlantListPage} from "../plant-list/plant-list";

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
}
