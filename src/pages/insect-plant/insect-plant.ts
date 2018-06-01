import {Component} from '@angular/core';
import {App, IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {DiseaseDetailPage} from "../disease-detail/disease-detail";
import {GlobalProvider} from "../../providers/global/global";
import {InsectDetailPage} from "../insect-detail/insect-detail";

/**
 * Generated class for the InsectPlantPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-insect-plant',
    templateUrl: 'insect-plant.html',
})
export class InsectPlantPage {
    loading: Loading;

    plantDataLoaded: boolean = false;
    insectDataLoaded: boolean = false;
    plantData: any = null;
    insectList: any = [];

    infiniteScroll = null;
    currentPage = 1;
    id;

    constructor(public app: App, public navParams: NavParams,
                public network: GlobalProvider, public loadingCtl: LoadingController) {
        this.id = this.navParams.data.id;
        this.presentLoading();
        this.loadData(true);
        this.network.getPlantDescription(this.id, (data, error) => {
            if (data) {
                if (data.data != null) {
                    this.plantData = data.data;
                }
            }

            this.plantDataLoaded = true;
            if (this.insectDataLoaded && this.plantDataLoaded) {
                this.dismissLoading();
            }
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DiseasePlantPage');
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
        if (imageUrls == null) {
            return null;
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

    doInfinite(infiniteScroll) {
        this.infiniteScroll = infiniteScroll;
        this.loadData(false);
    }

    loadData(isFirstTime) {
        this.network.getInsectsByPlantId(this.id, this.currentPage++, (data, error) => {
            if (data) {
                if (data.data != null) {
                    for (let i = 0; i < data.data.length; i++) {
                        this.insectList.push(data.data[i]);
                    }
                } else {
                    if (this.infiniteScroll != null) {
                        this.infiniteScroll.complete();
                    }
                }
            }

            if (this.infiniteScroll != null) {
                this.infiniteScroll.complete();
            }

            if (isFirstTime) {
                this.insectDataLoaded = true;
                if (this.insectDataLoaded && this.plantDataLoaded) {
                    this.dismissLoading();
                }
            }
        });
    }

    jumpToDetail(id) {
        this.app.getRootNav().push(InsectDetailPage, {
            id: id
        });
    }
}
