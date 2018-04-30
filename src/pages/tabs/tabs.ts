import {Component} from '@angular/core';

import {HomePage} from '../home/home';
import {PlantListPage} from "../plant-list/plant-list";
import {Platform} from "ionic-angular";
import {Toast} from "@ionic-native/toast";
import {FindPage} from "../find/find";
import {MinePage} from "../mine/mine";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    public backButtonPressed: boolean = false;

    // tab1Root = PlantListPage;
    tab1Root = HomePage;
    tab2Root = FindPage;
    tab3Root = MinePage;

    constructor(private platform: Platform, private toast: Toast) {

    }

    ionViewDidLoad() {
        this.platform.ready().then(() => {
            this.platform.registerBackButtonAction(() => {
                this.showExit();
            });
        });
    }

    showExit() {
        if (this.backButtonPressed) {
            this.platform.exitApp();
        } else {
            this.toast.showShortCenter("再按一次退出应用").subscribe();
            this.backButtonPressed = true;
            setTimeout(() => {
                this.backButtonPressed = false;
            }, 2000)
        }
    }

}
