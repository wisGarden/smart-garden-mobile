import {Component} from '@angular/core';
import {App, IonicPage, Loading, LoadingController, NavParams, Platform} from 'ionic-angular';
import {GlobalProvider} from "../../providers/global/global";
import {Toast} from "@ionic-native/toast";
import {InsectDetailPage} from "../insect-detail/insect-detail";

/**
 * Generated class for the InsectReasoningPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-insect-reasoning',
    templateUrl: 'insect-reasoning.html',
})
export class InsectReasoningPage {
    letters = ['A', "B", 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    loading: Loading;

    plantId;
    plantName;
    type;

    currentPage: number = 1; // 注意默认值为1
    // 题目内容，index从0开始
    options = [];
    // 选择的答案位置数组 index从1开始
    answers = [];
    // 上一次选择的答案位置数组 index从1开始
    pre_answers = [];
    // 下一题问题id
    nextQuestionId: number;

    isNextDisabled: boolean = false;
    isPreviousDisabled: boolean = false;

    constructor(public app: App, public navParams: NavParams,
                public network: GlobalProvider, public toast: Toast,
                public loadingCtl: LoadingController, public platform: Platform) {
        this.plantId = navParams.data.plantId;
        this.plantName = navParams.data.plantName;
        this.type = navParams.data.type;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad InsectReasoningPage');
        this.loadData(true);
    }

    ionViewWillEnter() {
        this.platform.ready().then(() => {
            this.platform.registerBackButtonAction(() => {
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

    /**
     * 选中状态
     * @param pos 当前框框位置
     * @param isNextClicked 当点击上一页或直接点击框框时，记录上一次pre_answers的状态；点击下一页不记录上一次pre_answers的状态
     */
    border_active(pos, isNextClicked) {
        if (!isNextClicked) {
            this.pre_answers[this.currentPage] = this.answers[this.currentPage];
        }
        if (this.answers[this.currentPage] != pos && this.answers[this.currentPage + 1] != null) {
            this.answers[this.currentPage + 1] = null;
        }
        this.answers[this.currentPage] = pos;
        for (let i = 0; i < document.getElementsByClassName("option").length; i++) {
            if (i == pos) {
                document.getElementsByClassName("option").item(i).classList.add("option-active");
            } else {
                document.getElementsByClassName("option").item(i).classList.remove("option-active");
            }
        }
    }

    next() {
        if (this.answers[this.currentPage] == null) {
            this.toast.showShortCenter("请选择一个选项").subscribe();
            // alert("请选择一个选项");
            return;
        }
        if (this.pre_answers[this.currentPage] == this.answers[this.currentPage]) {
            setTimeout(() => {
                this.border_active(this.answers[this.currentPage], true);
                let pos = this.answers[this.currentPage];
                let nextQuestionId = null;
                if (this.options[this.currentPage - 1] != null && this.options[this.currentPage - 1].options[pos] != null
                    && this.options[this.currentPage - 1].options[pos].nextQuestionId != null) {
                    nextQuestionId = this.options[this.currentPage - 1].options[pos].nextQuestionId;
                }
                if (this.nextQuestionId != null) {
                    this.changeNextButton(nextQuestionId);
                }
            }, 100);
            this.currentPage++;
        } else {
            this.loadData(false);
        }
    }

    previous() {
        --this.currentPage;
        // if (this.answers.length - this.currentPage > 3) {
        //     for (let i = this.currentPage + 2; i < this.answers.length; i++) {
        //         this.answers[i] = null;
        //         this.pre_answers[i] = null;
        //     }
        // }
        setTimeout(() => {
            this.border_active(this.answers[this.currentPage], false);
            let pos = this.answers[this.currentPage];
            let nextQuestionId = this.options[this.currentPage - 1].options[pos].nextQuestionId;
            this.changeNextButton(nextQuestionId);
        }, 100);
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

    loadData(isFirstTime) {
        if (isFirstTime) {
            this.presentLoading();
            this.isNextDisabled = true;
            this.isPreviousDisabled = true;

            this.network.getFirstDiseaseQuestion(this.plantId, this.type, (data, error) => {
                if (data) {
                    if (data.data != null) {
                        this.options.push(data.data);
                    }
                }

                this.isNextDisabled = false;
                this.isPreviousDisabled = false;
                this.dismissLoading();
            });
        } else {
            // 由于next已经修改了this.currentPage为下一页，因此需要额外-1
            let pos = this.answers[this.currentPage];
            this.nextQuestionId = this.options[this.currentPage - 1].options[pos].nextQuestionId;
            if (this.nextQuestionId == 0) {
                let optionId = this.options[this.currentPage - 1].options[pos].id;
                this.jumpToInsectDetail(optionId);
            } else {
                this.presentLoading();
                this.isNextDisabled = true;
                this.isPreviousDisabled = true;

                this.network.getDiseaseQuestion(this.nextQuestionId, (data, error) => {
                    if (data) {
                        if (data.data != null) {
                            this.options[this.currentPage] = data.data;
                            this.currentPage++;
                        }
                    }

                    this.isNextDisabled = false;
                    this.isPreviousDisabled = false;
                    this.dismissLoading();
                });
            }
        }
    }

    jumpToInsectDetail(optionId) {
        this.app.getRootNavs()[0].push(InsectDetailPage, {
            optionId: optionId
        });
    }

    changeNextButton(nextQuestionId) {
        if (nextQuestionId == 0) {
            document.getElementById("nextButton").innerHTML = "提&#12288;交";
        } else {
            document.getElementById("nextButton").innerHTML = "下一题";
        }
    }

    changeNumStyle(num) {
        if( num >= 0 && num < 10) {
            return '0' + num;
        } else {
            return num + '';
        }
    }
}
