import {Component} from '@angular/core';
import {
    AlertController, App, IonicPage, Keyboard, Loading, LoadingController, NavParams,
    Platform
} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {PlantDetailPage} from "../plant-detail/plant-detail";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";

/**
 * Generated class for the PlantListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-plant-list',
    templateUrl: 'plant-list.html',
})
export class PlantListPage {

    loading: Loading;

    keyword: string = '';
    // 列表数据
    fgList: any = [];
    // 每页列表加载的页数，每一项均为number
    listPage: any = [];
    // 当前页
    currentPage: number = 1;
    navList: any = [];

    infiniteScroll = null;

    historyList: any = [];
    updateHistorySql: boolean = false;
    plantList: any = [];
    plantListPage: number = 1;

    constructor(public app: App, public navParams: NavParams,
                public keyboard: Keyboard, public network: GlobalProvider,
                public loadingCtl: LoadingController, public platform: Platform,
                public sqlite: SQLite, public alertCtrl: AlertController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PlantListPage');
        this.currentPage = 1;
        this.fgList = [];
        this.listPage = [];
        this.loadFamilyData(true);
        this.loadHistory();
    }

    ionViewWillEnter() {
        this.platform.ready().then(() => {
            this.platform.registerBackButtonAction(() => {
                if (this.keyboard.isOpen()) {//如果键盘开启则隐藏键盘
                    this.keyboard.close();
                    return;
                }
                if (this.keyword != null && this.keyword.toString().trim() != '') {
                    this.keyword = '';
                    return;
                }
                if (this.currentPage != 1) {
                    this.previous();
                } else {
                    this.app.getRootNavs()[0].pop();
                }
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
            let keyword = event.target.value;
            if (keyword != null && keyword.toString().trim() != "") {
                this.setHistory(keyword);
            }
            this.getItems(event);
        }
    }

    getItems(event) {
        this.keyword = event.target.value;
        this.loadSearchData(true);
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

    loadFamilyData(isFirstTime) {
        if (isFirstTime) {
            this.presentLoading();
            if (this.infiniteScroll != null) {
                this.infiniteScroll.enable(true);
            }
        }
        this.network.getFamily(isFirstTime ? (this.listPage[this.currentPage - 1] = 1) : ++this.listPage[this.currentPage - 1], (data, error) => {
            if (data) {
                if (data.data != null) {
                    if (isFirstTime) {
                        this.fgList[this.currentPage - 1] = [];
                    }
                    for (let i = 0; i < data.data.length; i++) {
                        this.fgList[this.currentPage - 1].push(data.data[i]);
                    }
                } else {
                    if (this.infiniteScroll != null) {
                        this.infiniteScroll.enable(false);
                    }
                }
            }
            if (this.infiniteScroll != null) {
                this.infiniteScroll.complete();
            }
            if (isFirstTime) {
                this.dismissLoading();
            }
        });
    }

    loadGenusData(isFirstTime, familyName) {
        if (isFirstTime) {
            this.presentLoading();
            if (this.infiniteScroll != null) {
                this.infiniteScroll.enable(true);
            }
        }
        this.network.getGenus(familyName, isFirstTime ? (this.listPage[this.currentPage - 1] = 1) : ++this.listPage[this.currentPage - 1], (data, error) => {
            if (data) {
                if (data.data != null) {
                    if (isFirstTime) {
                        this.fgList[this.currentPage - 1] = [];
                    }
                    for (let i = 0; i < data.data.length; i++) {
                        this.fgList[this.currentPage - 1].push(data.data[i]);
                    }
                } else {
                    if (this.infiniteScroll != null) {
                        this.infiniteScroll.enable(false);
                    }
                }
            }
            if (this.infiniteScroll != null) {
                this.infiniteScroll.complete();
            }
            if (isFirstTime) {
                this.dismissLoading();
            }
        });
    }

    loadPlantData(isFirstTime, genus) {
        if (isFirstTime) {
            this.presentLoading();
            if (this.infiniteScroll != null) {
                this.infiniteScroll.enable(true);
            }
        }
        this.network.getPlantsByGenus(genus, isFirstTime ? (this.listPage[this.currentPage - 1] = 1) : ++this.listPage[this.currentPage - 1], (data, error) => {
            if (data) {
                if (data.data != null) {
                    if (isFirstTime) {
                        this.fgList[this.currentPage - 1] = [];
                    }
                    for (let i = 0; i < data.data.length; i++) {
                        this.fgList[this.currentPage - 1].push(data.data[i]);
                    }
                } else {
                    if (this.infiniteScroll != null) {
                        this.infiniteScroll.enable(false);
                    }
                }
            }
            if (this.infiniteScroll != null) {
                this.infiniteScroll.complete();
            }
            if (isFirstTime) {
                this.dismissLoading();
            }
        });
    }

    loadSearchData(isFirstTime) {
        if (isFirstTime) {
            this.plantListPage = 1;
            if (this.infiniteScroll != null) {
                this.infiniteScroll.enable(true);
            }
        }
        this.network.getMuchDiseasePlant(this.keyword, this.plantListPage++, (data, error) => {
            if (data) {
                if (data.data != null) {
                    if (isFirstTime) {
                        this.plantList = [];
                    }
                    for (let i = 0; i < data.data.length; i++) {
                        this.plantList.push(data.data[i]);
                    }
                } else {
                    if (isFirstTime) {
                        this.plantList = [];
                    }
                    if (this.infiniteScroll != null) {
                        this.infiniteScroll.enable(false);
                    }
                }
            }

            if (this.infiniteScroll != null) {
                this.infiniteScroll.complete();
            }
        });
    }

    next(data) {
        this.navList[this.currentPage - 1] = data;
        if (this.currentPage == 1) {
            this.currentPage++;
            this.loadGenusData(true, data);
        } else if (this.currentPage == 2) {
            this.currentPage++;
            this.loadPlantData(true, data);
        }

        setTimeout(() => {
            this.activeNav();
        }, 1);
    }

    previous() {
        this.currentPage--;
        setTimeout(() => {
            this.activeNav();
        }, 1);
    }

    jumpToPage(page) {
        this.currentPage = page;
        this.activeNav();
    }

    activeNav() {
        if (this.currentPage == 1) {
            document.getElementById("nav1").classList.add("my-active");
        } else if (this.currentPage == 2) {
            document.getElementById("nav1").classList.remove("my-active");
            document.getElementById("nav2").classList.add("my-active");
        } else {
            document.getElementById("nav1").classList.remove("my-active");
            document.getElementById("nav2").classList.remove("my-active");
            document.getElementById("nav3").classList.add("my-active");
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

    jumpToDetail(id) {
        if (this.keyword != null && this.keyword.toString().trim() != '') {
            this.setHistory(this.keyword);
        }
        this.app.getRootNavs()[0].push(PlantDetailPage, {
            id: id
        });
    }

    doInfinite(infiniteScroll) {
        this.infiniteScroll = infiniteScroll;
        if (this.keyword != null && this.keyword.toString().trim() != '') {
            this.loadSearchData(false);
        } else {
            if (this.currentPage == 1) {
                this.loadFamilyData(false);
            } else if (this.currentPage == 2) {
                this.loadGenusData(false, this.navList[this.currentPage - 2]);
            } else if (this.currentPage == 3) {
                this.loadPlantData(false, this.navList[this.currentPage - 2]);
            }
        }
    }

    replaceAll(text) {
        if (text != null && text != '') {
            return text.replace(/&#12288;/g, "");
        } else {
            return text;
        }
    }

    setHistory(keyword) {
        if (this.keyword == null || this.keyword.toString().trim() == "") {
            return;
        }
        if (this.updateHistorySql) {
            return;
        }
        this.updateHistorySql = true;

        this.sqlite.create({
            name: 'ionicdb.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('CREATE TABLE IF NOT EXISTS keywords(id INTEGER PRIMARY KEY, type INT, keyword TEXT DEFAULT 0, update_time INT DEFAULT 0, delete_time INT DEFAULT 0)', {})
                .then(res => console.log('Executed SQL'))
                .catch(e => console.log(e));
            db.executeSql('SELECT * FROM keywords WHERE keyword = ? and delete_time = 0 and type = 4', [keyword])
                .then(res => {
                    if (res.rows.length != 0) {
                        let id = res.rows.item(0).id;
                        let updateTime = Date.now() / 1000;
                        db.executeSql('UPDATE keywords SET update_time = ? WHERE id = ?', [updateTime, id])
                            .then(res => console.log('Executed SQL'))
                            .catch(e => console.log(e));
                    } else {
                        let updateTime = Date.now() / 1000;
                        db.executeSql('INSERT INTO keywords VALUES(NULL, 4, ?, ?, 0)',
                            [keyword, updateTime])
                            .then(res => console.log(res))
                            .catch(e => console.log(e));
                    }
                    this.updateHistorySql = false;

                    // 用户无感知刷新列表
                    this.loadHistory();
                })
                .catch(e => {
                    console.log(e);
                    this.updateHistorySql = false;
                });
        }).catch(e => {
            console.log(e);
            this.updateHistorySql = false;
        });
    }

    loadHistory() {
        this.sqlite.create({
            name: 'ionicdb.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('CREATE TABLE IF NOT EXISTS keywords(id INTEGER PRIMARY KEY, type INT, keyword TEXT DEFAULT 0, update_time INT DEFAULT 0, delete_time INT DEFAULT 0)', {})
                .then(res => console.log('Executed SQL'))
                .catch(e => console.log(e));
            db.executeSql('SELECT * FROM keywords WHERE type = 4 and delete_time = 0 ORDER BY update_time DESC limit 15', {})
                .then(res => {
                    this.historyList = [];
                    for (let i = 0; i < res.rows.length; i++) {
                        this.historyList.push(res.rows.item(i));
                    }
                })
                .catch(e => {
                    console.log(e);
                });
        }).catch(e => {
            console.log(e);
        });
    }

    deleteHistory(id) {
        this.sqlite.create({
            name: 'ionicdb.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('CREATE TABLE IF NOT EXISTS keywords(id INTEGER PRIMARY KEY, type INT, keyword TEXT DEFAULT 0, update_time INT DEFAULT 0, delete_time INT DEFAULT 0)', {})
                .then(res => console.log('Executed SQL'))
                .catch(e => console.log(e));

            let deleteTime = Date.now() / 1000;
            if (id == 0) {
                db.executeSql('UPDATE keywords SET delete_time = ? where delete_time = 0 and type = 4', [deleteTime])
                    .then(res => console.log('Executed SQL'))
                    .catch(e => console.log(e));
            } else {
                db.executeSql('UPDATE keywords SET delete_time = ? WHERE id = ?', [deleteTime, id])
                    .then(res => console.log('Executed SQL'))
                    .catch(e => console.log(e));
            }
        }).catch(e => console.log(e));
    }

    historySearch(keyword) {
        setTimeout(() => {
            this.keyword = keyword;
            document.getElementById("searchbar").classList.add("searchbar-has-focus");
            document.getElementById("searchbar").getElementsByTagName("input").item(0).focus();
            this.setHistory(keyword);
            this.loadSearchData(true);
        }, 500);
    }

    doDeleteHistory(id) {
        let confirm = this.alertCtrl.create({
            title: '您确定要删除吗？',
            message: '您确定删除' + (id == 0 ? '所有' : '这条') + '历史记录吗？确定点击是，不确定点击否。',
            buttons: [
                {
                    text: '否',
                    handler: () => {
                    }
                },
                {
                    text: '是',
                    handler: () => {
                        this.deleteHistory(id);
                        this.loadHistory();
                    }
                }
            ]
        });
        confirm.present();
    }
}
