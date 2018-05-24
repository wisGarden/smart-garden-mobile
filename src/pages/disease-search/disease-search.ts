import {Component} from '@angular/core';
import {IonicPage, Keyboard, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the DiseaseSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-disease-search',
    templateUrl: 'disease-search.html',
})
export class DiseaseSearchPage {

    option : string = "plant";

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public keyboard: Keyboard) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DiseaseSearchPage');
    }

    onSearchKeyUp(event) {
        if (event.key == "Enter") {
            // TODO
            if (this.keyboard.isOpen()) {//如果键盘开启则隐藏键盘
                this.keyboard.close();
            }
        }
    }

    getItems(event) {
        let keyword = event.target.value;
        // alert(keyword);
    }
}
