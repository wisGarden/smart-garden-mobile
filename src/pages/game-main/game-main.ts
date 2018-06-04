import {Component} from '@angular/core';
import {AlertController, App, IonicPage, NavParams, Platform} from 'ionic-angular';
import {GameDoingPage} from "../game-doing/game-doing";
import {TabsPage} from "../tabs/tabs";

/**
 * Generated class for the GameMainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-game-main',
    templateUrl: 'game-main.html',
})
export class GameMainPage {

    constructor(public app: App, public navParams: NavParams,
                public alertCtrl: AlertController, private platform: Platform) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GameMainPage');
        this.platform.ready().then(() => {
            this.platform.registerBackButtonAction(() => {
                this.jumpToMainPage();
            });
        });
    }

    ionViewDidEnter() {
        this.platform.ready().then(() => {
            this.platform.registerBackButtonAction(() => {
                this.jumpToMainPage();
            });
        });
    }

    jumpToDoing(type) {
        this.app.getRootNavs()[0].push(GameDoingPage, {
            type: type
        });
    }

    jumpToMainPage() {
        let confirm = this.alertCtrl.create({
            title: '确定要退出游戏吗？',
            message: '常回来看看哦',
            buttons: [
                {
                    text: '否',
                    handler: () => {

                    }
                },
                {
                    text: '是',
                    handler: () => {
                        this.app.getRootNavs()[0].setRoot(TabsPage);
                    }
                }
            ]
        });
        confirm.present();
    }
}
