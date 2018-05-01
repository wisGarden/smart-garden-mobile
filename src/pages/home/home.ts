import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PlantIdtTabsPage} from "../plant-idt-tabs/plant-idt-tabs";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
  }

  ionViewDidLoad() {
  }

  pushToPlantIdt() {
      this.navCtrl.push(PlantIdtTabsPage);
  }
}
