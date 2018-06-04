import {Component} from '@angular/core';
import {AlertController, App, IonicPage, Loading, LoadingController, NavParams, Platform} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {GameResultPage} from "../game-result/game-result";

/**
 * Generated class for the GameDoingPage page. 假定数据库question_game id从1开始不缺失
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-game-doing',
    templateUrl: 'game-doing.html',
})
export class GameDoingPage {
    private loading: Loading;
    // 倒计时开始秒数
    START_NUM = 30;
    // 倒计时当前秒数
    current_num = 30;
    // 倒计时每隔旋转PER_ROT1次
    PER_ROT = 10;
    // 倒计时每次旋转rot/1000 * 360度
    rot = 10;
    // 循环变量
    interval: any;
    // 当前题目id（type==1） || 当前题目序号
    current_ques_id: number = 1;
    // 题目类型 1 -> 练习模式 2 -> 挑战模式 3 -> 极限模式
    type: number = 1;
    // 问题内容
    question: any = null;
    // 是否禁用按钮点击事件
    disabledButtons: boolean = false;
    // 按钮dom节点
    optionButtons: any;
    // 正确答题数
    rightNum: number = 0;
    // 分页获取问题id列表
    questionIdList: any = [];
    // id列表分页
    page: number = 0;
    // 当前选项
    whichOption: number = -1;
    // 是否进行计时操作
    cancelTimeOut: boolean = false;

    constructor(public app: App, public navParams: NavParams,
                public network: GlobalProvider, public loadingCtl: LoadingController,
                public alertCtrl: AlertController, public platform: Platform) {
        this.type = navParams.data.type;
        if (this.type == 1) {
            this.getQuestionById(this.current_ques_id);
        } else {
            this.getQuestionIds();
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GameDoingPage');
        this.platform.ready().then(() => {
            this.platform.registerBackButtonAction(() => {
                let confirm = this.alertCtrl.create({
                    title: '确定要退出挑战吗？',
                    message: '完成挑战可以获得相应的成就哦',
                    buttons: [
                        {
                            text: '否',
                            handler: () => {

                            }
                        },
                        {
                            text: '是',
                            handler: () => {
                                this.timeoutCancel();
                                this.reset(this.whichOption);
                                this.clearInterval();
                                this.app.getRootNavs()[0].pop();
                            }
                        }
                    ]
                });
                confirm.present();
            });
        });
    }

    ionViewDidEnter() {
        if (this.type == 3) {
            this.interval = setInterval(() => {
                this.rotate();
            }, this.PER_ROT);
        }
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

    rotate() {
        document.getElementById("rotate").style.transform = "rotate(" + this.rot / 1000 * 360 + "deg)";
        if (this.current_num == 0) {
            this.clearInterval();
            this.rot = 10;
            this.jumpToResult();
            return;
        }
        if (this.rot == 1000) {
            this.rot = 0;
            this.current_num--;
        }
        if (this.current_num <= 5) {
            document.getElementById("number").style.color = "#E14A4B";
        }
        this.rot += 10;
    }

    resetIntervalColor() {
        document.getElementById("number").style.color = "#FFFFFF";
    }

    previous() {
        this.timeoutCancel();
        this.clearInterval();
        this.current_ques_id--;
        this.getQues(this.whichOption);
    }

    next() {
        this.timeoutCancel();
        this.clearInterval();
        this.current_ques_id++;
        this.getQues(this.whichOption);
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

    getQuestionById(id) {
        this.presentLoading();
        this.network.getQuestionById(id, (data, error) => {
            if (data) {
                if (data.data != null) {
                    this.question = data.data;
                } else {
                    this.showExitDialog();
                }
            }

            this.dismissLoading();
        });
    }

    getQuestionIds() {
        this.page++;
        this.network.getQuestionIds(this.page, (data, error) => {
            if (data) {
                if (data.data != null) {
                    for (let i = 0; i < data.data.length; i++) {
                        this.questionIdList.push(data.data[i]);
                    }
                    this.getQuestionById(this.questionIdList[this.current_ques_id - 1]);
                } else {
                    this.showExitDialog();
                }
            }
        });
    }

    /**
     * 获取下一题
     * @param whichOption 选择的选项，从0开始计数
     * @param shouldLoading 是否等待提示答案
     */
    getNextQuestion(whichOption, shouldLoading) {
        this.whichOption = whichOption;
        if (this.disabledButtons) {
            return;
        }
        this.disabledButtons = true;
        if (shouldLoading) {
            this.showAnswer(whichOption);
            setTimeout(() => {
                if (this.cancelTimeOut) {
                    this.cancelTimeOut = false;
                    return;
                }
                this.current_ques_id++;
                this.getQues(whichOption);
            }, 3000);
        } else {
            if (!this.showAnswer(whichOption)) {
                if (this.type == 2) {
                    setTimeout(() => {
                        if (this.cancelTimeOut) {
                            this.cancelTimeOut = false;
                            return;
                        }
                        this.reset(whichOption);
                        this.jumpToResult();
                    }, 3000);
                    return;
                } else {
                    setTimeout(() => {
                        if (this.cancelTimeOut) {
                            this.cancelTimeOut = false;
                            return;
                        }
                        this.current_ques_id++;
                        this.getQues(whichOption);
                        this.reset(whichOption);
                    }, 1000);
                }
            } else {
                this.current_ques_id++;
                this.getQues(whichOption);
            }

        }
    }

    getQues(whichOption) {
        this.reset(whichOption);
        if (this.type == 1) {
            this.getQuestionById(this.current_ques_id);
        } else {
            if (this.questionIdList != null) {
                // idList被读取完，加载新idList
                if (this.current_ques_id > this.questionIdList.length) {
                    this.getQuestionIds();
                } else {
                    this.getQuestionById(this.questionIdList[this.current_ques_id - 1]);
                }
            } else {
                this.showExitDialog();
            }
        }
        this.disabledButtons = false;
    }

    showAnswer(whichOption) {
        this.optionButtons = [document.getElementById("option-a"), document.getElementById("option-b"),
            document.getElementById("option-c"), document.getElementById("option-d")];
        if (this.question.answer == whichOption) {
            this.optionButtons[whichOption].classList.remove("game-option");
            this.optionButtons[whichOption].classList.add("game-option-right");
            this.rightNum++;
            return true;
        } else {
            this.optionButtons[whichOption].classList.remove("game-option");
            this.optionButtons[whichOption].classList.add("game-option-wrong");
            this.optionButtons[this.question.answer].classList.remove("game-option");
            this.optionButtons[this.question.answer].classList.add("game-option-right");
            return false;
        }
    }

    reset(whichOption) {
        if (whichOption >= 0 && whichOption <= 3) {
            this.optionButtons = [document.getElementById("option-a"), document.getElementById("option-b"),
                document.getElementById("option-c"), document.getElementById("option-d")];
            this.optionButtons[whichOption].classList.remove("game-option-wrong");
            this.optionButtons[whichOption].classList.add("game-option");
            this.optionButtons[this.question.answer].classList.remove("game-option-right");
            this.optionButtons[this.question.answer].classList.add("game-option");
        }
        this.whichOption = -1;
    }

    clearInterval() {
        if (this.interval != null) {
            window.clearInterval(this.interval);
            this.interval = null;
        }
    }

    jumpToResult() {
        this.timeoutCancel();
        this.reset(this.whichOption);
        this.clearInterval();
        this.app.getRootNavs()[0].push(GameResultPage, {
            num: this.rightNum,
            callback: this.callback
        });
    }

    timeoutCancel() {
        this.cancelTimeOut = true;
        setTimeout(() => {
            this.cancelTimeOut = false;
        }, 3000);
    }

    showExitDialog() {
        let confirm = this.alertCtrl.create({
            title: '没有题目了，~~(>_<)~~',
            message: '真厉害，答完了所有的题目，快来看看成绩吧！',
            buttons: [
                {
                    text: '继续',
                    handler: () => {
                        this.jumpToResult();
                    }
                }
            ]
        });
        confirm.present();
    }

    // 页面pop回调方法
    callback = (data) => {
        return new Promise((resolve, reject) => {
            this.interval = null;
            this.current_ques_id = 1;
            // 问题内容
            this.question = null;
            // 是否禁用按钮点击事件
            this.disabledButtons = false;
            // 按钮dom节点
            this.optionButtons = null;
            // 正确答题数
            this.rightNum = 0;
            if (this.type == 1) {
                this.getQuestionById(this.current_ques_id);
            } else {
                if (this.type == 3) {
                    this.rot = 10;
                    this.current_num = this.START_NUM;
                    this.resetIntervalColor();
                }
                this.questionIdList = [];
                // id列表分页
                this.page = 0;
                this.getQuestionIds();
            }
            resolve();
        });
    }
}
