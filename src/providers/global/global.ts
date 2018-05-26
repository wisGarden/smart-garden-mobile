import {Injectable} from '@angular/core';
import {HTTP, HTTPResponse} from "@ionic-native/http";
import {Toast} from "@ionic-native/toast";

const BASEURL = "http://192.168.43.84:8080/";
const PLANT = "getPlant";
const PLANT_LIST = "getPlantList";

@Injectable()
export class GlobalProvider {

    constructor(public http: HTTP, public toast: Toast) {
        http.setRequestTimeout(20000);
        // console.log('Hello GlobalProvider Provider');
    }

    /**
     * 获取植物列表
     */
    getPlantList(img): Promise<HTTPResponse> {
        let response : Promise<HTTPResponse> = this.http.post(BASEURL + PLANT_LIST, {img: img}, {});
        response.catch(error => {
            this.error(error);
        });
        return response;
    }

    /**
     * 获取植物详情
     */
    getPlant(infoUrl): Promise<HTTPResponse> {
        let response : Promise<HTTPResponse> = this.http.get(BASEURL + PLANT, {code: infoUrl}, {});
        response.catch(error => {
            this.error(error);
        });
        return response;
    }

    error(error) {
        if (error.error.contains("timed out")) {
            this.toast.showShortCenter("网络请求失败").subscribe();
        } else {
            alert(error.error);
        }
    }
}
