import {Component} from '@angular/core';

import {AboutPage} from '../about/about';
import {ContactPage} from '../contact/contact';
import {HomePage} from '../home/home';
import {PlantListPage} from "../plant-list/plant-list";
import {Platform} from "ionic-angular";
import {Toast} from "@ionic-native/toast";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    public backButtonPressed: boolean = false;

    // tab1Root = PlantListPage;
    tab1Root = HomePage;
    tab2Root = AboutPage;
    tab3Root = ContactPage;

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
