import {Component} from '@angular/core';
import {App, NavController} from 'ionic-angular';
import {PlantIdtTabsPage} from "../plant-idt-tabs/plant-idt-tabs";
import {DiseaseSearchPage} from "../disease-search/disease-search";
import {InsectSearchPage} from "../insect-search/insect-search";
import {DiseaseReasoningSearchPage} from "../disease-reasoning-search/disease-reasoning-search";
import {InsectReasoningSearchPage} from "../insect-reasoning-search/insect-reasoning-search";

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
        this.app.getRootNavs()[0].push(PlantIdtTabsPage);
    }

    pushToDiseaseSearch() {
        this.app.getRootNavs()[0].push(DiseaseSearchPage);
    }

    pushToInsectSearch() {
        this.app.getRootNavs()[0].push(InsectSearchPage);
    }

    pushToDiseaseReasoningSearch() {
        this.app.getRootNavs()[0].push(DiseaseReasoningSearchPage);
    }

    pushToInsectReasoningSearch() {
        this.app.getRootNavs()[0].push(InsectReasoningSearchPage);
    }
}
