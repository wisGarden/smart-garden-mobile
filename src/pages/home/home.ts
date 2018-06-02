import {Component} from '@angular/core';
import {App, NavController} from 'ionic-angular';
import {PlantIdtTabsPage} from "../plant-idt-tabs/plant-idt-tabs";
import {DiseaseSearchPage} from "../disease-search/disease-search";
import {InsectSearchPage} from "../insect-search/insect-search";
import {DiseaseReasoningSearchPage} from "../disease-reasoning-search/disease-reasoning-search";

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

    pushToDiseaseSearch() {
        this.app.getRootNav().push(DiseaseSearchPage);
    }

    pushToInsectSearch() {
        this.app.getRootNav().push(InsectSearchPage);
    }

    pushToDiseaseReasoningSearch() {
        this.app.getRootNav().push(DiseaseReasoningSearchPage);
    }
}
