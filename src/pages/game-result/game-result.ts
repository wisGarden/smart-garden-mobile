import {Component} from '@angular/core';
import {App, IonicPage, NavParams} from 'ionic-angular';
import {GameMainPage} from "../game-main/game-main";
import {GameDoingPage} from "../game-doing/game-doing";

/**
 * Generated class for the GameResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-game-result',
    templateUrl: 'game-result.html',
})
export class GameResultPage {
    achievements = ["快来扶我", "智商才露尖尖角", "山下的朋友你们好", "小试牛刀", "渐入佳境", "以一答百", "小露锋芒", "锋芒毕露", "想输太难", "智商爆灯", "我的智商无懈可击", "献上你的膝盖吧", "想要我的签名吗", "竟然不是人类"];
    achievements_num = [0, 1, 3, 5, 8, 10, 15, 25, 35, 45, 50, 60, 75, 100];
    // 每题分数
    PER_SCORE = 10;
    // 答对题目数
    rightNum: number = 0;
    // 成就名
    achievement;
    // 回调
    callback;

    constructor(public app: App, public navParams: NavParams) {
        this.rightNum = navParams.data.num;
        this.getAchievement();
        this.callback = navParams.data.callback;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GameResultPage');
    }

    getAchievement() {
        if (this.rightNum > this.achievements_num[this.achievements_num.length - 1]) {
            this.achievement = this.achievements[this.achievements.length];
            return;
        }
        if (this.rightNum == 0) {
            this.achievement = this.achievements[0];
        }
        for(let i = 0; i < this.achievements_num.length; i++) {
            if (this.achievements_num[i] > this.rightNum) {
                this.achievement = this.achievements[i - 1];
                break;
            }
        }
    }

    jumpToMainGame() {
        this.app.getRootNavs()[0].setRoot(GameMainPage);
    }

    jumpToReTry() {
        this.callback().then(() => {
            this.app.getRootNavs()[0].pop();
        });
    }
}
