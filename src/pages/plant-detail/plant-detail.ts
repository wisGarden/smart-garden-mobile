import {Component, ViewChild} from '@angular/core';
import {App, Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {Toast} from "@ionic-native/toast";

/**
 * Generated class for the PlantDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-plant-detail',
    templateUrl: 'plant-detail.html',
})
export class PlantDetailPage {

    data: Object;
    index: 0;
    imageData: string;
    plantDetail: Object;

    @ViewChild(Content) content: Content;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private network: GlobalProvider, private toast: Toast,
                private app: App) {
        this.imageData = this.navParams.data.imageData;

        this.index = this.navParams.data.index;

        this.data = this.navParams.data.data;

        if (this.data.hasOwnProperty("result") && this.data['result'].length > 0) {
            if (this.data['result'][this.index].hasOwnProperty("infoUrl")) {
                this.network.getPlant(this.data['result'][this.index]['infoUrl']).then(data => {
                    this.plantDetail = JSON.parse(data.data);
                }).catch(error => {
                    if (error.error.contains("timed out")) {
                        this.toast.showShortCenter("网络请求失败").subscribe();
                    } else {
                        alert(error.error);
                    }
                });
            }

        } else {
            this.toast.showShortCenter("没有相关植物信息").subscribe();
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PlantDetailPage');
    }

    jumpToOtherPlant(i) {
        if (this.data.hasOwnProperty("result") && this.data['result'].length > 0) {
            if (this.data['result'][i].hasOwnProperty("infoUrl")) {
                this.network.getPlant(this.data['result'][i]['infoUrl']).then(data => {
                    this.plantDetail = JSON.parse(data.data);
                }).catch(error => {
                    if (error.error.contains("timed out")) {
                        this.toast.showShortCenter("网络请求失败").subscribe();
                    } else {
                        alert(error.error);
                    }
                });
            }

        } else {
            this.toast.showShortCenter("没有相关植物信息").subscribe();
        }
        this.content.scrollTo(0, 0, 300);
    }

}
