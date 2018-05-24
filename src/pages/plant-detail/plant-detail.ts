import {Component, ViewChild} from '@angular/core';
import {App, Content, IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
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
    private loading: Loading;
    data: Object;
    index: 0;
    imageData: string;
    plantDetail: Object;

    @ViewChild(Content) content: Content;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private network: GlobalProvider, private toast: Toast,
                private app: App, private loadingCtl: LoadingController) {
        this.imageData = this.navParams.data.imageData;

        this.index = this.navParams.data.index;

        this.data = this.navParams.data.data;

        if (this.data.hasOwnProperty("data") && this.data['data'].length > 0) {
            if (this.data['data'][this.index].hasOwnProperty("infoUrl")) {
                this.network.getPlant(this.data['data'][this.index]['infoUrl']).then(data => {
                    this.plantDetail = JSON.parse(data.data);
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
        this.presentLoading();
        if (this.data.hasOwnProperty("data") && this.data['data'].length > 0) {
            if (this.data['data'][i].hasOwnProperty("infoUrl")) {
                this.network.getPlant(this.data['data'][i]['infoUrl']).then(data => {
                    this.dismissLoading();
                    this.plantDetail = JSON.parse(data.data);
                }).catch(error => {
                    this.dismissLoading();
                });
            }
        } else {
            this.toast.showShortCenter("没有相关植物信息").subscribe();
        }
        this.content.scrollTo(0, 0, 300);
    }

    presentLoading() {
        let loading = this.loadingCtl.create({
            content: ""
        });
        loading.present();
        this.loading = loading;
    }

    dismissLoading() {
        if (this.loading != null) {
            this.loading.dismiss();
            this.loading = null;
        }
    }
}
