import {Component} from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";

/**
 * Generated class for the InsectDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-insect-detail',
    templateUrl: 'insect-detail.html',
})
export class InsectDetailPage {
    detailList: any;

    loading: Loading;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public network: GlobalProvider, public loadingCtl: LoadingController) {
        let id = this.navParams.data.id;
        this.presentLoading();
        this.network.getDiseaseDetail(id, (data, error) => {
            if (data) {
                this.detailList = data.data;
            }

            this.dismissLoading();
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DiseaseDetailPage');
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

    getImageUrl(imageUrls) {
        if (imageUrls == null || imageUrls.trim() == '') {
            return "assets/imgs/img-default.jpg";
        }
        if (!imageUrls.split("#")[0].match("http")) {
            return this.network.getBaseUrl() + imageUrls.split("#")[0];
        } else {
            return imageUrls.split("#")[0];
        }
    }

    replaceAll(text) {
        if (text != null && text != '') {
            return text.replace(/&#12288;/g, "");
        } else {
            return text;
        }
    }
}
