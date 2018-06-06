import {Component} from '@angular/core';
import {App, IonicPage, Keyboard, NavParams, Platform} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {SceneryDetailPage} from "../scenery-detail/scenery-detail";

/**
 * Generated class for the SceneryListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-scenery-list',
    templateUrl: 'scenery-list.html',
})
export class SceneryListPage {
    province: string = "北京";
    sceneryList: any = [];
    keyword: string = "";
    callback: any = null;

    constructor(public app: App, public navParams: NavParams,
                public network: GlobalProvider, public keyboard: Keyboard,
                public platform: Platform) {
        this.keyword = this.navParams.data.keyword;
        this.province = this.navParams.data.province;
        this.callback = this.navParams.data.callback;
        if (this.keyword == null || this.keyword.toString().trim() == "") {
            return;
        }
        this.getSceneryData();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SceneryListPage');
    }

    ionViewWillEnter() {
        this.platform.ready().then(() => {
            this.platform.registerBackButtonAction(() => {
                this.jumpToMap();
            });
        });
    }

    ionViewWillLeave() {
        this.platform.ready().then(() => {
            this.platform.registerBackButtonAction(() => {
                this.app.getRootNavs()[0].pop();
            });
        });
    }

    onSearchKeyUp(event) {
        if (event.key == "Enter") {
            if (this.keyboard.isOpen()) {//如果键盘开启则隐藏键盘
                this.keyboard.close();
            }
            this.getItems(event);
        }
    }

    getItems(event) {
        this.keyword = event.target.value;
        if (this.keyword == null || this.keyword.toString().trim() == "") {
            this.sceneryList = [];
            return;
        }
        this.getSceneryData();
    }

    // 绑定select改变事件
    change(event) {
        this.keyword = "";
        this.sceneryList = [];
    }

    selectClicked() {
        setTimeout(() => {
            document.getElementsByClassName("alert-head")[0].innerHTML = "<h2 class='alert-title'>选择城市</h2>";
        }, 100);
    }

    getSceneryData() {
        let id = '3'; //默认北京
        for (let i = 0; i < this.network.getProvince().length; i++) {
            if (this.province.match(this.network.getProvince()[i].name)) {
                id = this.network.getProvince()[i].id;
            }
        }
        this.network.getScenery(this.keyword, 1, id, (data, error) => {
            if (data) {
                if (data.data != null) {
                    this.sceneryList = data.data;
                    let list = [];
                    for (let i = 0; i < this.sceneryList.length; i++) {
                        if (this.sceneryList[i].latitude != null && this.sceneryList[i].longitude != null &&
                            parseFloat(this.sceneryList[i].latitude) <= 90) {
                            list.push(this.sceneryList[i]);
                        }
                    }
                    this.sceneryList = list;
                    for (let data of this.sceneryList) {
                        if (data.pics == null || data.pics.length == 0) {
                            continue;
                        }
                        let temp = new Image();
                        temp.src = data.pics[0].picUrl;
                        if (temp.complete) {
                            if (this.isAd(temp.width, temp.height)) {
                                data.pics = null;
                            }
                        } else {
                            temp.onload = () => {
                                if (this.isAd(temp.width, temp.height)) {
                                    data.pics = null;
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    isAd(width, height) {
        return width == "189" && height == "89";
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

    jumpToDetail(data) {
        this.app.getRootNavs()[0].push(SceneryDetailPage, {
            data: data
        });
    }

    jumpToMap() {
        this.callback(this.keyword, this.province).then(() => {
            this.app.getRootNavs()[0].pop();
        });
    }
}
