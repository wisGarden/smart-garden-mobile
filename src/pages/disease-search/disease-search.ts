import {Component} from '@angular/core';
import {IonicPage, Keyboard, NavController, NavParams} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";

/**
 * Generated class for the DiseaseSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-disease-search',
    templateUrl: 'disease-search.html',
})
export class DiseaseSearchPage {

    option: string = "plant";
    diseaseList: any = null;
    plantList: any = null;
    hotList: any = null;
    historyList: any = null;

    currentPage: number = 1;
    keyword: string = null;
    infiniteScroll = null;

    hasMoreDisease: boolean = true;
    hasMorePlant: boolean = true;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public keyboard: Keyboard, public network: GlobalProvider,
                private sqlite: SQLite) {
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
            // TODO
            let keyword = event.target.value;
            if (keyword != null && keyword.toString().trim() != "") {
                alert(keyword);
                this.setHistory(keyword);
            }
            this.getItems(event);
        }
    }

    getItems(event) {
        this.keyword = event.target.value;
        this.loadData(true);
        // alert(keyword);
    }

    replaceAll(text) {
        if (text != null && text != '') {
            return text.replace(/&#12288;/g, "");
        } else {
            return text;
        }
    }

    getImageUrl(imageUrls) {
        if (!imageUrls.split("#")[0].match("http")) {
            return this.network.getBaseUrl() + imageUrls.split("#")[0];
        } else {
            return imageUrls.split("#")[0];
        }
    }

    doRefresh(refresher) {
        this.currentPage = 1;
        this.hasMoreDisease = true;
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

    loadDiseaseData(isFirstTime) {
        this.network.getDiseaseList(this.keyword, this.currentPage, (data, error) => {
            if (data) {
                if (data.data != null) {
                    if (isFirstTime) {
                        this.diseaseList = data;
                    } else {
                        for (let i = 0; i < data.data.length; i++) {
                            this.diseaseList.data.push(data.data[i]);
                        }
                    }
                } else {
                    if (isFirstTime) {
                        this.diseaseList = data;
                    } else {
                        this.hasMoreDisease = false;
                        if (this.infiniteScroll != null && !this.hasMoreDisease && !this.hasMorePlant) {
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

    loadPlantData(isFirstTime) {
        this.network.getDiseasePlant(this.keyword, this.currentPage, (data, error) => {
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
                        if (this.infiniteScroll != null && !this.hasMoreDisease && !this.hasMorePlant) {
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
        this.network.getDiseaseList('', this.currentPage++, (data, error) => {
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
        if (this.diseaseList == null && this.plantList == null) {
            this.loadHotData(isFirstTime);
            return true;
        }
        if (this.diseaseList != null && this.diseaseList.data == null && this.plantList == null) {
            this.loadHotData(isFirstTime);
            return true;
        }
        if (this.plantList != null && this.plantList.data == null && this.diseaseList == null) {
            this.loadHotData(isFirstTime);
            return true;
        }
        if (this.diseaseList != null && this.diseaseList.data == null && this.plantList != null && this.plantList.data == null) {
            this.loadHotData(isFirstTime);
            return true;
        }
        return false;
    }

    loadData(isFirstTime) {
        if (this.keyword == null || this.keyword.toString().trim() == "") {
            this.plantList = null;
            this.diseaseList = null;
            this.loadHistory();
            this.loadHotData(true);
            return;
        }
        if (isFirstTime) {
            this.currentPage = 1;
            this.hasMoreDisease = true;
            this.hasMorePlant = true;
            if (this.infiniteScroll != null) {
                this.infiniteScroll.enable(true);
            }
        }
        this.loadDiseaseData(isFirstTime);
        this.loadPlantData(isFirstTime);
        this.currentPage++;
    }

    setHistory(keyword) {
        this.sqlite.create({
            name: 'ionicdb.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('CREATE TABLE IF NOT EXISTS keywords(id INTEGER PRIMARY KEY, type INT, keyword TEXT DEFAULT 0, update_time INT DEFAULT 0, delete_time INT DEFAULT 0)', {})
                .then(res => console.log('Executed SQL'))
                .catch(e => console.log(e));
            db.executeSql('SELECT * FROM keywords WHERE keyword = ? and delete_time = 0', [keyword])
                .then(res => {
                    if (res.rows.length != 0) {
                        let id = res.rows.item(0);
                        let updateTime = Date.parse(new Date().toDateString()) / 1000;
                        db.executeSql('UPDATE keywords SET update_time = ? WHERE id = ?', [updateTime, id])
                            .then(res => console.log('Executed SQL'))
                            .catch(e => console.log(e));
                    } else {
                        let updateTime = Date.parse(new Date().toDateString()) / 1000;
                        db.executeSql('INSERT INTO keywords VALUES(NULL, 0, ?, ?, 0)',
                            [keyword, updateTime])
                            .then(res => console.log(res))
                            .catch(e => console.log(e));
                    }
                })
                .catch(e => {
                    console.log(e);
                });
        }).catch(e => console.log(e));
    }

    loadHistory() {
        this.sqlite.create({
            name: 'ionicdb.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('CREATE TABLE IF NOT EXISTS keywords(id INTEGER PRIMARY KEY, type INT, keyword TEXT DEFAULT 0, update_time INT DEFAULT 0, delete_time INT DEFAULT 0)', {})
                .then(res => console.log('Executed SQL'))
                .catch(e => console.log(e));
            db.executeSql('SELECT * FROM keywords WHERE type = 0 and delete_time = 0 ORDER BY update_time DESC limit 15', {})
                .then(res => {
                    for (let i = 0; i < res.rows.length; i++) {
                        this.historyList.push(JSON.parse(res.rows.item(i)));
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

            let deleteTime = Date.parse(new Date().toDateString()) / 1000;
            if (id == 0) {
                db.executeSql('UPDATE keywords SET deleteTime = ? where delete_time <> 0', [deleteTime])
                    .then(res => console.log('Executed SQL'))
                    .catch(e => console.log(e));
            } else {
                db.executeSql('UPDATE keywords SET deleteTime = ? WHERE id = ?', [deleteTime, id])
                    .then(res => console.log('Executed SQL'))
                    .catch(e => console.log(e));
            }
        }).catch(e => console.log(e));
    }
}
