import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, Loading, LoadingController, NavParams} from 'ionic-angular';
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
    plantDetail: Object;
    showLoading: boolean = true;

    @ViewChild(Content) content: Content;

    constructor(public navParams: NavParams, public loadingCtl: LoadingController,
                public network: GlobalProvider, public toast: Toast) {

        this.index = this.navParams.data.index;

        this.data = this.navParams.data.data;

        if (this.data.hasOwnProperty("data") && this.data['data'].length > 0) {
            if (this.data['data'][this.index].hasOwnProperty("infoUrl")) {
                this.network.getPlant(this.data['data'][this.index]['infoUrl'], (data, error) => {
                    if (data) {
                        this.plantDetail = data;
                        if (this.showLoading) {
                            this.dismissLoading();
                            this.showLoading = false;
                        }
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

    ionViewDidEnter() {
        if (this.showLoading) {
            this.presentLoading();
        }
    }

    jumpToOtherPlant(i) {
        this.presentLoading();
        if (this.data.hasOwnProperty("data") && this.data['data'].length > 0) {
            if (this.data['data'][i].hasOwnProperty("infoUrl")) {
                this.network.getPlant(this.data['data'][i]['infoUrl'], (data, error) => {
                    if (data) {
                        this.dismissLoading();
                        this.plantDetail = data;
                    }

                    if (error) {
                        this.dismissLoading();
                    }
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
