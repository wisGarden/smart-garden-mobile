import {Component} from '@angular/core';
import {App, IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {PlantDetailPage} from "../plant-detail/plant-detail";

/**
 * Generated class for the PlantIdtHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-plant-idt-history',
    templateUrl: 'plant-idt-history.html',
})
export class PlantIdtHistoryPage {
    private loading: Loading;
    notShowList: boolean = true;
    plantList: any;
    private page: number = 1;
    private currentPage: number = 1;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public storage: Storage, private loadingCtl: LoadingController,
                public app: App) {
    }

    jumpToDetail(plant) {
        this.app.getRootNav().push(PlantDetailPage,
            {
                data: plant,
                index: 0
            });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PlantIdtHistoryPage');
    }

    ionViewDidEnter() {
        // this.storage.get("page").then(page => {
        //     if (page == null) {
        //         this.notShowList = true;
        //     } else {
        //         this.page = page;
        //     }
        //     console.log("aa page: "+ this.page + " currentPage: " + this.currentPage);
        // });

        this.storage.get("data").then(value => {
            this.notShowList = value == null;
            if (value != null) {
                console.log(JSON.stringify(value));
                this.plantList = value;
            }
        });
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

    // doInfinite(infiniteScroll) {
    //     console.log("page: "+ this.page + " currentPage: " + this.currentPage);
    //     if (this.currentPage < this.page) {
    //         this.currentPage++;
    //         this.storage.get("data"+ this.currentPage).then(value => {
    //             if (value != null) {
    //                 this.plantList = this.plantList.concat(value);
    //             }
    //             infiniteScroll.complete();
    //
    //             if (this.currentPage >= this.page) {
    //                 infiniteScroll.enable(false);
    //             }
    //         });
    //     } else {
    //         infiniteScroll.complete();
    //         infiniteScroll.enable(false);
    //     }
    // }
}
