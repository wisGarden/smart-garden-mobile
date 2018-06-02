import {Component} from '@angular/core';
import {App, IonicPage, Loading, LoadingController, NavParams} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {DiseaseDetailPage} from "../disease-detail/disease-detail";
import {DiseaseReasoningPage} from "../disease-reasoning/disease-reasoning";

/**
 * Generated class for the DiseasePlantPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-disease-plant',
    templateUrl: 'disease-plant.html',
})
export class DiseasePlantPage {
    loading: Loading;

    plantDataLoaded: boolean = false;
    diseaseDataLoaded: boolean = false;
    plantData: any = null;
    diseaseList: any = [];

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
            if (this.diseaseDataLoaded && this.plantDataLoaded) {
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

    doInfinite(infiniteScroll) {
        this.infiniteScroll = infiniteScroll;
        this.loadData(false);
    }

    loadData(isFirstTime) {
        this.network.getDiseasesByPlantId(this.id, this.currentPage++, (data, error) => {
            if (data) {
                if (data.data != null) {
                    for (let i = 0; i < data.data.length; i++) {
                        this.diseaseList.push(data.data[i]);
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
                this.diseaseDataLoaded = true;
                if (this.diseaseDataLoaded && this.plantDataLoaded) {
                    this.dismissLoading();
                }
            }
        });
    }

    jumpToDetail(id) {
        this.app.getRootNav().push(DiseaseDetailPage, {
            id: id
        });
    }

    jumpToDiseaseReasoning() {
        this.app.getRootNav().push(DiseaseReasoningPage, {
            plantId: this.id,
            plantName: this.plantData.plantName,
            type: 0
        });
    }
}
