import {Component, Input} from '@angular/core';
import {NavController} from "ionic-angular";

/**
 * Generated class for the TitleBarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'title-bar',
    templateUrl: 'title-bar.html'
})
export class TitleBarComponent {
    @Input() pageTitle: string;
    @Input() startIconName: string;
    @Input() searchIconName: string;
    @Input() endIconName: string;
    @Input() isSearch: string;

    constructor(public navCtrl: NavController) {
        this.pageTitle = '植物大全';
        this.startIconName = 'close';
        this.searchIconName = 'search';
        this.endIconName = 'menu';
    }

    backClick() {
        if (this.startIconName == "arrow-back") {
            this.navCtrl.pop();
        }
    }

    rightClick() {
        if (this.endIconName != "") {
            alert("right");
        }
    }

    searchClick() {
        if (this.searchIconName != "") {
            alert("search");
        }
    }

}
