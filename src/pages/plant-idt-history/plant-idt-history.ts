import {Component} from '@angular/core';
import {App, IonicPage, NavController, NavParams} from 'ionic-angular';
import {PlantDetailPage} from "../plant-detail/plant-detail";
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";

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
    private infiniteScroll = null;
    notShowList: boolean = true;
    plantList: any = [];
    private currentPage: number = 0;
    private ITEM_NUM = 10;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public app: App, private sqlite: SQLite) {
    }

    jumpToDetail(plant) {
        this.app.getRootNavs()[0].push(PlantDetailPage,
            {
                data: plant,
                index: 0
            });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PlantIdtHistoryPage');
    }

    ionViewWillEnter() {
        this.loadData(true);
    }

    doRefresh(refresher) {
        this.currentPage = 0;
        if (this.infiniteScroll != null) {
            this.infiniteScroll.enable(true);
        }
        this.loadData(true);
        setTimeout(() => {
            refresher.complete();
        }, 2000);
    }

    doInfinite(infiniteScroll) {
        this.infiniteScroll = infiniteScroll;
        this.loadData(false);

    }

    loadData(isFirstTime) {
        if (isFirstTime) {
            this.currentPage = 0;
            if (this.infiniteScroll != null) {
                this.infiniteScroll.enable(true);
            }
        }
        this.sqlite.create({
            name: 'ionicdb.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            db.executeSql('CREATE TABLE IF NOT EXISTS identification(id INTEGER PRIMARY KEY, data TEXT)', {})
                .then(res => console.log('Executed SQL'))
                .catch(e => console.log(e));
            db.executeSql('SELECT * FROM identification ORDER BY id DESC limit ? offset ?', [this.ITEM_NUM, this.currentPage++ * this.ITEM_NUM])
                .then(res => {
                    if (isFirstTime) {
                        this.plantList = [];
                        this.notShowList = res.rows.length == 0;
                    }
                    if (res.rows.length == 0 && this.infiniteScroll != null) {
                        this.infiniteScroll.enable(false);
                        return;
                    }
                    let temp: string = '';
                    for (let i = 0; i < res.rows.length; i++) {
                        this.plantList.push(JSON.parse(res.rows.item(i).data));
                        temp += res.rows.item(i).id + " ";
                    }
                    console.log("id: " + temp + "page: " + this.currentPage);
                    setTimeout(() => {
                        if (this.infiniteScroll != null) {
                            this.infiniteScroll.complete();
                        }
                    }, 1000);
                })
                .catch(e => {
                    console.log(e);
                    if (this.infiniteScroll != null) {
                        this.infiniteScroll.complete();
                    }
                });
        }).catch(e => {
            console.log(e);
            if (this.infiniteScroll != null) {
                this.infiniteScroll.complete();
            }
        });
    }
}
