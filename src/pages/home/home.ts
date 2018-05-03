import {Component} from '@angular/core';
import {App, NavController} from 'ionic-angular';
import {PlantIdtTabsPage} from "../plant-idt-tabs/plant-idt-tabs";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(public app: App, public navCtrl: NavController) {
    }

    ionViewDidLoad() {
    }

    pushToPlantIdt() {
        this.app.getRootNav().push(PlantIdtTabsPage);
    }
}
