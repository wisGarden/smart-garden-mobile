import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {PlantIdtAlbumPage} from "../plant-idt-album/plant-idt-album";
import {PlantIdtPhotoPage} from "../plant-idt-photo/plant-idt-photo";
import {PlantIdtHistoryPage} from "../plant-idt-history/plant-idt-history";

/**
 * Generated class for the PlantIdtTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-plant-idt-tabs',
    templateUrl: 'plant-idt-tabs.html',
})
export class PlantIdtTabsPage {

    tab1Root = PlantIdtAlbumPage;
    tab2Root = PlantIdtPhotoPage;
    tab3Root = PlantIdtHistoryPage;

    constructor() {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PlantIdtTabsPage');
    }

}
