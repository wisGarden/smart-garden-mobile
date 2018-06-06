import {Component, Input} from '@angular/core';
import {App, NavController} from "ionic-angular";

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

    // 专为scenery-list后退设计使用
    @Input() callback: any = null;
    @Input() keyword: any = null;
    @Input() province: any = null;

    constructor(public app:App, public navCtrl: NavController) {
        this.pageTitle = '植物大全';
        this.startIconName = 'close';
        this.searchIconName = 'search';
        this.endIconName = 'menu';
    }

    backClick() {
        if (this.startIconName == "arrow-back" || this.startIconName == "md-close") {
            if (this.callback != null) {
                this.callback(this.keyword, this.province).then(() => {
                    this.app.getRootNavs()[0].pop();
                });
            } else {
                this.app.getRootNavs()[0].pop();
            }
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
