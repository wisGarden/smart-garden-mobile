import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";

/**
 * Generated class for the SceneryDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-scenery-detail',
    templateUrl: 'scenery-detail.html',
})
export class SceneryDetailPage {
    sceneryData: any;
    flag = [];
    list = [];

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public network: GlobalProvider) {
        this.sceneryData = navParams.data.data;
        if (this.sceneryData.hasOwnProperty("pics")) {
            if (this.sceneryData.pics == null || this.sceneryData.pics.length == 0) {
                return;
            }
            for (let i = 0; i < this.sceneryData.pics.length; i++) {
                let temp = new Image();
                if (!this.sceneryData.pics[i].hasOwnProperty("picUrl")) {
                    continue;
                }
                temp.src = this.sceneryData.pics[i].picUrl;
                if (temp.complete) {
                    // this.isAd(temp.width, temp.height, i);
                    this.addToList(temp.width, temp.height, i);
                } else {
                    temp.onload = () => {
                        // this.isAd(temp.width, temp.height, i);
                        this.addToList(temp.width, temp.height, i);
                    }
                }
            }
            setTimeout(() => {
                // for (let item of this.flag) {
                //     this.sceneryData.pics.splice(item, 1);
                // }
                this.sceneryData.pics = this.list;
            }, 1000);
        }
        // alert(JSON.stringify(this.sceneryData));
    }

    addToList(width, height, i) {
        if (width != "189" || height != "89") {
            this.list.push(this.sceneryData.pics[i]);
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SceneryDetailPage');
    }

    getImageUrl(imageUrls) {
        if (imageUrls == null || imageUrls.trim() == '') {
            return "assets/imgs/img-default-long.jpg";
        }
        if (!imageUrls.split("#")[0].match("http")) {
            return this.network.getBaseUrl() + imageUrls.split("#")[0];
        } else {
            return imageUrls.split("#")[0];
        }
    }
}
