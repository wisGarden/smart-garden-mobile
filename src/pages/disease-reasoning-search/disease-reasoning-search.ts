import { Component } from '@angular/core';
import {AlertController, App, IonicPage, Keyboard, NavController, NavParams} from 'ionic-angular';
import {DiseasePlantPage} from "../disease-plant/disease-plant";
import {DiseaseDetailPage} from "../disease-detail/disease-detail";
import {GlobalProvider} from "../../providers/global/global";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";

/**
 * Generated class for the DiseaseReasoningSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-disease-reasoning-search',
  templateUrl: 'disease-reasoning-search.html',
})
export class DiseaseReasoningSearchPage {

    plantList: any = null;
    hotList: any = null;
    historyList: any = [];

    currentPage: number = 1;
    keyword: string = null;
    infiniteScroll = null;

    hasMorePlant: boolean = true;

    updateHistorySql: boolean = false;

    constructor(public app: App, public navParams: NavParams,
                public keyboard: Keyboard, public network: GlobalProvider,
                public sqlite: SQLite, public alerCtrl: AlertController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DiseaseSearchPage');
        this.loadHotData(true);
        this.loadHistory();
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
        this.loadData(true);
    }

    replaceAll(text) {
        if (text != null && text != '') {
            return text.replace(/&#12288;/g, "");
        } else {
            return text;
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

    doRefresh(refresher) {
        this.currentPage = 1;
        this.hasMorePlant = true;
        if (this.infiniteScroll != null) {
            this.infiniteScroll.enable(true);
        }
        if (!this.shouldLoadHotData(true)) {
            this.loadData(true);
        }
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }

    doInfinite(infiniteScroll) {
        this.infiniteScroll = infiniteScroll;
        if (!this.shouldLoadHotData(false)) {
            this.loadData(false);
        }
    }

    loadPlantData(isFirstTime) {
        this.network.getMuchDiseasePlant(this.keyword, this.currentPage, (data, error) => {
            if (data) {
                if (data.data != null) {
                    if (isFirstTime) {
                        this.plantList = data;
                    } else {
                        for (let i = 0; i < data.data.length; i++) {
                            this.plantList.data.push(data.data[i]);
                        }
                    }
                } else {
                    if (isFirstTime) {
                        this.plantList = data;
                    } else {
                        this.hasMorePlant = false;
                        if (this.infiniteScroll != null && !this.hasMorePlant) {
                            this.infiniteScroll.enable(false);
                        }
                    }
                }

            }

            if (this.infiniteScroll != null) {
                this.infiniteScroll.complete();
            }
        });
    }

    loadHotData(isFirstTime) {
        if (isFirstTime) {
            this.currentPage = 1;
            if (this.infiniteScroll != null) {
                this.infiniteScroll.enable(true);
            }
        }
        this.network.getMuchDiseasePlant('', this.currentPage++, (data, error) => {
            if (data) {
                if (data.data != null) {
                    if (isFirstTime) {
                        this.hotList = data;
                    } else {
                        for (let i = 0; i < data.data.length; i++) {
                            this.hotList.data.push(data.data[i]);
                        }
                    }
                } else {
                    if (isFirstTime) {
                        this.hotList = data;
                    } else {
                        if (this.infiniteScroll != null) {
                            this.infiniteScroll.enable(false);
                        }
                    }
                }

            }

            if (this.infiniteScroll != null) {
                this.infiniteScroll.complete();
            }
        });
    }

    shouldLoadHotData(isFirstTime) {
        if (this.plantList == null) {
            this.loadHotData(isFirstTime);
            return true;
        }
        if (this.plantList != null && this.plantList.data == null) {
            this.loadHotData(isFirstTime);
            return true;
        }
        return false;
    }

    loadData(isFirstTime) {
        if (this.keyword == null || this.keyword.toString().trim() == "") {
            this.plantList = null;
            this.loadHotData(true);
            return;
        }
        if (isFirstTime) {
            this.currentPage = 1;
            this.hasMorePlant = true;
            if (this.infiniteScroll != null) {
                this.infiniteScroll.enable(true);
            }
        }
        this.loadPlantData(isFirstTime);
        this.currentPage++;
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
            db.executeSql('SELECT * FROM keywords WHERE keyword = ? and delete_time = 0 and type = 2', [keyword])
                .then(res => {
                    if (res.rows.length != 0) {
                        let id = res.rows.item(0).id;
                        let updateTime = Date.now() / 1000;
                        db.executeSql('UPDATE keywords SET update_time = ? WHERE id = ?', [updateTime, id])
                            .then(res => console.log('Executed SQL'))
                            .catch(e => console.log(e));
                    } else {
                        let updateTime = Date.now() / 1000;
                        db.executeSql('INSERT INTO keywords VALUES(NULL, 2, ?, ?, 0)',
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
            db.executeSql('SELECT * FROM keywords WHERE type = 2 and delete_time = 0 ORDER BY update_time DESC limit 15', {})
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
                db.executeSql('UPDATE keywords SET delete_time = ? where delete_time = 0 and type = 2', [deleteTime])
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
            this.loadData(true);
        }, 500);
    }

    doDeleteHistory(id) {
        let confirm = this.alerCtrl.create({
            title: '您确定要删除吗？',
            message: '您确定删除'+ (id == 0 ? '所有' : '这条') +'历史记录吗？确定点击是，不确定点击否。',
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

    jumpToDiseasePlant(id) {
        this.setHistory(this.keyword);
        this.app.getRootNav().push(DiseasePlantPage,
            {
                id: id
            });
    }
}
